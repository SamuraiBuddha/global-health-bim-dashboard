# Visualization Techniques

## Overview

This document details the advanced visualization techniques used in the Global Health BIM Dashboard to represent complex, multi-dimensional data on a 3D globe interface.

## Core Visualization Technologies

### Rendering Pipeline

```
Data Sources → Processing → GPU Optimization → Multi-Scale Rendering → User Interface
```

### Technology Stack

- **Cesium.js**: Primary 3D globe and geospatial rendering
- **Three.js**: Custom shaders and detailed visualizations
- **Deck.gl**: Large-scale data layer rendering
- **WebGPU**: Next-generation GPU compute and rendering

## Data Visualization Categories

### Environmental Data

#### Sea Level Rise Visualization

```javascript
class SeaLevelRenderer {
  constructor(cesiumViewer) {
    this.viewer = cesiumViewer;
    this.waterMaterial = this.createWaterMaterial();
  }

  createWaterMaterial() {
    return new Cesium.Material({
      fabric: {
        type: 'Water',
        uniforms: {
          baseWaterColor: new Cesium.Color(0.0, 0.3, 0.6, 0.5),
          normalMap: './assets/water-normal.jpg',
          frequency: 10000.0,
          animationSpeed: 0.01,
          amplitude: 10.0,
          specularIntensity: 0.5,
          fadeFactor: 1.0
        },
        source: `
          czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);
            
            float time = czm_frameNumber * animationSpeed;
            vec2 st = materialInput.st;
            
            vec2 waveCoord = st * frequency + time;
            vec3 waveNormal = texture2D(normalMap, waveCoord).rgb * 2.0 - 1.0;
            
            material.normal = normalize(materialInput.tangentToEyeMatrix * waveNormal);
            material.diffuse = baseWaterColor.rgb;
            material.alpha = baseWaterColor.a * fadeFactor;
            material.specular = specularIntensity;
            material.shininess = 20.0;
            
            return material;
          }
        `
      }
    });
  }

  async renderProjection(year, scenario) {
    const projectionData = await this.fetchSeaLevelData(year, scenario);
    
    // Create dynamic mesh
    const positions = [];
    const indices = [];
    
    for (const cell of projectionData.cells) {
      const height = cell.elevation + cell.seaLevelRise;
      positions.push(...this.createWaterVertex(cell.lat, cell.lon, height));
    }
    
    const waterSurface = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.Geometry({
          attributes: {
            position: new Cesium.GeometryAttribute({
              componentDatatype: Cesium.ComponentDatatype.DOUBLE,
              componentsPerAttribute: 3,
              values: new Float64Array(positions)
            })
          },
          indices: new Uint32Array(indices)
        })
      }),
      appearance: new Cesium.MaterialAppearance({
        material: this.waterMaterial,
        translucent: true
      })
    });
    
    this.viewer.scene.primitives.add(waterSurface);
  }
}
```

#### Atmospheric Visualization

```glsl
// Vertex shader for volumetric atmosphere
attribute vec3 position;
attribute float temperature;
attribute float co2Level;

uniform mat4 modelViewProjectionMatrix;
uniform float heightScale;

varying float vTemperature;
varying float vCO2;
varying float vAltitude;

void main() {
  vTemperature = temperature;
  vCO2 = co2Level;
  vAltitude = position.z / heightScale;
  
  gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
}

// Fragment shader
varying float vTemperature;
varying float vCO2;
varying float vAltitude;

uniform float tempMin;
uniform float tempMax;
uniform float co2Threshold;

vec3 temperatureToColor(float t) {
  float normalized = (t - tempMin) / (tempMax - tempMin);
  
  // Blue -> Green -> Yellow -> Red gradient
  vec3 cold = vec3(0.0, 0.0, 1.0);
  vec3 mild = vec3(0.0, 1.0, 0.0);
  vec3 warm = vec3(1.0, 1.0, 0.0);
  vec3 hot = vec3(1.0, 0.0, 0.0);
  
  if (normalized < 0.33) {
    return mix(cold, mild, normalized * 3.0);
  } else if (normalized < 0.66) {
    return mix(mild, warm, (normalized - 0.33) * 3.0);
  } else {
    return mix(warm, hot, (normalized - 0.66) * 3.0);
  }
}

void main() {
  vec3 tempColor = temperatureToColor(vTemperature);
  float co2Alpha = smoothstep(co2Threshold, co2Threshold * 1.5, vCO2);
  float altitudeFade = 1.0 - smoothstep(0.7, 1.0, vAltitude);
  
  gl_FragColor = vec4(tempColor, co2Alpha * altitudeFade * 0.3);
}
```

### Geological Hazards

#### Real-time Earthquake Visualization

```typescript
class EarthquakeVisualizer {
  private particleSystem: THREE.Points;
  private earthquakeData: EarthquakeEvent[];
  
  initializeParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_EARTHQUAKES * 3);
    const colors = new Float32Array(MAX_EARTHQUAKES * 3);
    const sizes = new Float32Array(MAX_EARTHQUAKES);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        
        uniform float time;
        uniform float pixelRatio;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          // Pulse effect based on time since earthquake
          float age = mod(time - size, 10.0);
          float scale = 1.0 + sin(age * 3.14159) * 0.5;
          vAlpha = 1.0 - (age / 10.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * scale * pixelRatio / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    this.particleSystem = new THREE.Points(geometry, material);
  }
  
  updateEarthquake(event: EarthquakeEvent) {
    const positions = this.particleSystem.geometry.attributes.position.array;
    const colors = this.particleSystem.geometry.attributes.color.array;
    const sizes = this.particleSystem.geometry.attributes.size.array;
    
    const index = this.getNextIndex();
    const i3 = index * 3;
    
    // Convert lat/lon to 3D position
    const pos = this.latLonToVector3(event.latitude, event.longitude, event.depth);
    positions[i3] = pos.x;
    positions[i3 + 1] = pos.y;
    positions[i3 + 2] = pos.z;
    
    // Color based on magnitude
    const color = this.magnitudeToColor(event.magnitude);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    
    // Size based on magnitude
    sizes[index] = Math.pow(2, event.magnitude) * 10;
    
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    this.particleSystem.geometry.attributes.color.needsUpdate = true;
    this.particleSystem.geometry.attributes.size.needsUpdate = true;
  }
}
```

### Human Crisis Indicators

#### Conflict Zone Heatmaps

```javascript
class ConflictHeatmapLayer {
  constructor(deckGL) {
    this.deck = deckGL;
    this.conflictData = [];
  }
  
  createHeatmapLayer() {
    return new HeatmapLayer({
      id: 'conflict-heatmap',
      data: this.conflictData,
      getPosition: d => [d.longitude, d.latitude],
      getWeight: d => d.intensity * d.casualties,
      radiusPixels: 50,
      intensity: 1,
      threshold: 0.03,
      colorRange: [
        [255, 255, 178, 0],    // Transparent yellow
        [254, 217, 118, 128],  // Light orange
        [254, 178, 76, 178],   // Orange
        [253, 141, 60, 200],   // Dark orange
        [252, 78, 42, 225],    // Red-orange
        [227, 26, 28, 255]     // Red
      ],
      aggregation: 'SUM'
    });
  }
}
```

#### Refugee Flow Visualization

```typescript
class RefugeeFlowRenderer {
  renderFlows(flows: RefugeeFlow[]) {
    const flowLines = flows.map(flow => {
      const curve = this.createBezierCurve(
        flow.origin,
        flow.destination,
        flow.count
      );
      
      return new FlowLine({
        path: curve,
        color: this.getFlowColor(flow.urgency),
        width: Math.log10(flow.count) * 2,
        speed: flow.urgency * 0.1,
        animate: true
      });
    });
    
    return new AnimatedPathLayer({
      id: 'refugee-flows',
      data: flowLines,
      getPath: d => d.path,
      getColor: d => d.color,
      getWidth: d => d.width,
      currentTime: this.currentTime,
      trailLength: 100,
      shadowEnabled: true
    });
  }
  
  createBezierCurve(origin: Coordinate, dest: Coordinate, count: number) {
    const midPoint = this.getMidpoint(origin, dest);
    const altitude = Math.min(count / 1000, 500) * 1000; // Max 500km altitude
    
    midPoint.altitude = altitude;
    
    // Create smooth bezier curve
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(origin.lon, origin.lat, 0),
      new THREE.Vector3(midPoint.lon, midPoint.lat, midPoint.altitude),
      new THREE.Vector3(dest.lon, dest.lat, 0)
    );
    
    return curve.getPoints(50); // 50 points for smooth curve
  }
}
```

## Performance Optimization Techniques

### GPU-Based Data Processing

```javascript
class GPUDataProcessor {
  constructor() {
    this.computeRenderer = new THREE.WebGLRenderer();
    this.computeScene = new THREE.Scene();
    this.computeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }
  
  processLargeDataset(data: Float32Array, operation: string) {
    const size = Math.sqrt(data.length);
    
    // Create data texture
    const dataTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RedFormat,
      THREE.FloatType
    );
    
    // Compute shader
    const computeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dataTexture: { value: dataTexture },
        operation: { value: operation }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dataTexture;
        uniform int operation;
        varying vec2 vUv;
        
        void main() {
          float value = texture2D(dataTexture, vUv).r;
          float result;
          
          if (operation == 1) { // Normalize
            result = (value - minValue) / (maxValue - minValue);
          } else if (operation == 2) { // Smooth
            result = gaussianBlur(dataTexture, vUv);
          }
          
          gl_FragColor = vec4(result, 0.0, 0.0, 1.0);
        }
      `
    });
    
    // Render to texture
    const renderTarget = new THREE.WebGLRenderTarget(size, size, {
      format: THREE.RedFormat,
      type: THREE.FloatType
    });
    
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      computeMaterial
    );
    
    this.computeScene.add(quad);
    this.computeRenderer.setRenderTarget(renderTarget);
    this.computeRenderer.render(this.computeScene, this.computeCamera);
    
    // Read back results
    const result = new Float32Array(size * size);
    this.computeRenderer.readRenderTargetPixels(
      renderTarget, 0, 0, size, size, result
    );
    
    return result;
  }
}
```

### Level-of-Detail Management

```typescript
class AdaptiveLODSystem {
  selectLOD(entity: VisualizationEntity, context: RenderContext): LODLevel {
    const factors = {
      distance: this.calculateDistanceFactor(entity, context.camera),
      importance: this.calculateImportanceFactor(entity, context.crisisLevel),
      performance: this.calculatePerformanceFactor(context.frameRate),
      bandwidth: this.calculateBandwidthFactor(context.networkSpeed)
    };
    
    const score = 
      factors.distance * 0.4 +
      factors.importance * 0.3 +
      factors.performance * 0.2 +
      factors.bandwidth * 0.1;
    
    if (score > 0.8) return LODLevel.ULTRA;
    if (score > 0.6) return LODLevel.HIGH;
    if (score > 0.4) return LODLevel.MEDIUM;
    if (score > 0.2) return LODLevel.LOW;
    return LODLevel.MINIMAL;
  }
}
```

## Best Practices

1. **Performance First**
   - Use GPU acceleration wherever possible
   - Implement aggressive LOD strategies
   - Cache computed visualizations

2. **Visual Clarity**
   - Use consistent color schemes
   - Provide clear legends and scales
   - Avoid visual clutter at global scale

3. **Interactivity**
   - Smooth transitions between views
   - Responsive to user input
   - Progressive data loading

4. **Accessibility**
   - Colorblind-friendly palettes
   - High contrast modes
   - Screen reader support for key data