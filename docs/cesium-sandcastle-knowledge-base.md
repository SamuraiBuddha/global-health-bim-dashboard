# Cesium Sandcastle Knowledge Base

## Overview

Sandcastle is an interactive code editor and example gallery that allows developers to explore CesiumJS capabilities, experiment with code, and learn from examples. The Cesium Sandcastle provides an interactive environment for testing Cesium code.

## Key Features

1. **Interactive Code Editor**
   - Live code editing with immediate visual feedback
   - A toolbar with buttons for running code, saving, sharing, etc.
   - Split-pane interface showing code and visualization side-by-side

2. **Comprehensive Example Gallery**
   - The Sandcastle gallery contains a comprehensive collection of examples organized by categories. Each example demonstrates specific features or capabilities of CesiumJS.
   - Each example is a self-contained HTML file in the Apps/Sandcastle/gallery/ directory, containing all the code needed to demonstrate a particular feature.

3. **Sharing Capabilities**
   - Step 2 - Click the "Share" button This will give you a URL yo...
   - The shared URL contains an encoded version of your code that can be decoded by Sandcastle when loaded. You can also import GitHub Gist examples using the "Import Gist" button.

## Example Categories

Based on the documentation, Sandcastle examples are organized into several categories:

### Core Categories
- **Showcases** - A simple CZML example showing four satellites in orbit around the Earth and some ground objects
- **DataSources** - Examples for loading various data formats
- **3D Tiles** - How to use the 3D Tiles Styling language to style individual features like buildings
- **Geometry & Appearances** - A demonstration of the wide variety of available geometries and appearances
- **Terrain** - How to visualize worldwide, high-resolution terrain
- **Materials** - Various material types and custom shaders
- **Development** - Lower-level API examples

### Example Types (Design Philosophy)
Teaching example These should be extremely simple examples that show a user how to do exactly one thing. There can be dozens and dozens of them. Ideally the entire JavaScript code pane in Sandcastle should around 30-40 lines, with 50 being the absolute most and many being under 15.

## Common Sandcastle Patterns

### Basic Viewer Setup
```javascript
// Standard Sandcastle startup pattern
window.startup = async function (Cesium) {
    "use strict";
    //Sandcastle_Begin
    const viewer = new Cesium.Viewer("cesiumContainer", {
        shouldAnimate: true
    });
    
    // Your code here
    
    //Sandcastle_End
};
```

### Adding Toolbar Buttons
```javascript
// From CZML example
Sandcastle.addDefaultToolbarButton("Satellites", function () {
    viewer.dataSources.add(
        Cesium.CzmlDataSource.load("../../SampleData/simple.czml")
    );
    viewer.camera.flyHome(0);
});

Sandcastle.addToolbarButton("Vehicle", function () {
    viewer.dataSources.add(
        Cesium.CzmlDataSource.load("../../SampleData/Vehicle.czml")
    );
    viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-116.52, 35.02, 95000),
        orientation: { heading: 6 }
    });
});
```

### Reset Function
```javascript
Sandcastle.reset = function () {
    viewer.dataSources.removeAll();
};
```

## Advanced Visualization Patterns

### Heatmap Creation
We need to learn a bit of few things: Scene The container for all 3D graphical objects and state in a Cesium virtual scene. The Scene is comprised of the couple of component that we need to understand to have a clear picture. Primitives , Camera , ScreenSpaceCameraController and Animations . To manipulate the apperance we need to interact with the Primitives

```javascript
// Heatmap implementation pattern
const heatmapMaterial = new Cesium.Material({
    fabric: {
        // Define your custom shader here
    }
});

const heatmapGeometry = new Cesium.GeometryInstance({
    geometry: new Cesium.PolygonGeometry({
        // Define your heatmap area here
    })
});

const heatmapPrimitive = new Cesium.GroundPrimitive({
    geometryInstances: heatmapGeometry,
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: heatmapMaterial
    })
});

scene.groundPrimitives.add(heatmapPrimitive);
```

### Material System (Fabric)
Cesium uses a system called Fabric to define materials. Fabric is a JSON schema that allows you to describe how a material should look and behave. For simple materials, you might just specify components like diffuse color or specular intensity. But for more complex materials, like our heatmap, we can provide a full GLSL shader implementation.

```javascript
// Custom material example
primitive.appearance.material = new Cesium.Material({
    fabric: {
        materials: {
            alphaMaterial: {
                type: "AlphaMap",
                uniforms: {
                    image: "../images/Cesium_Logo_Color.jpg",
                    channel: "r"
                }
            }
        },
        components: {
            diffuse: "vec3(1.0)",
            alpha: "alphaMaterial.alpha"
        }
    }
});
```

## Time-Dynamic Data Visualization

This tutorial will walk you through how to use Cesium Stories to visualize a drone flight scenario.

For real-time updates:
```javascript
// Dynamic update pattern
function updateHeatmap(newData) {
    heatmapMaterial.uniforms.dataTexture = newData;
    // Update other uniforms as needed
}

// Lifecycle management
function cleanup() {
    scene.groundPrimitives.remove(heatmapPrimitive);
}
```

## Clustering and Data Aggregation

From the clustering examples:
```javascript
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function(movement) {
    var pickedLabel = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedLabel)) {
        var ids = pickedLabel.id;
        if (Cesium.isArray(ids)) {
            for (var i = 0; i < ids.length; ++i) {
                ids[i].label.fillColor = Cesium.Color.RED;
            }
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

## Best Practices for Sandcastle Examples

1. **Keep It Simple**
   - A good example of this is the Box example. I think the other Geometry examples should be simplified to fit this model. For example, the BoxOutline example does both a Box AND an BoxOutline, it should do an outline only.

2. **Self-Contained**
   - The examples in Sandcastle are designed not just as demos but as learning resources. Each example is self-contained and can be used as a starting point for your own applications.

3. **Proper Structure**
   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
       <meta name="description" content="Description of example" />
       <meta name="cesium-sandcastle-labels" content="Category1, Category2" />
       <title>Cesium Demo</title>
       <script type="text/javascript" src="../Sandcastle-header.js"></script>
       <script type="text/javascript" src="../../../Build/CesiumUnminified/Cesium.js" nomodule></script>
       <script type="module" src="../load-cesium-es6.js"></script>
     </head>
     <body class="sandcastle-loading" data-sandcastle-bucket="bucket-requirejs.html">
       <style>
         @import url(../templates/bucket.css);
       </style>
       <div id="cesiumContainer" class="fullSize"></div>
       <div id="loadingOverlay"><h1>Loading...</h1></div>
       <div id="toolbar"></div>
       <script id="cesium_sandcastle_script">
         // Your code here
       </script>
     </body>
   </html>
   ```

## Health Monitoring Specific Patterns

### Real-time Data Streaming
```javascript
// WebSocket connection for real-time health data
const ws = new WebSocket('ws://localhost:8081/health-data');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Update entity position or properties
    const entity = viewer.entities.getById(data.id);
    if (entity) {
        entity.position = Cesium.Cartesian3.fromDegrees(
            data.longitude, 
            data.latitude, 
            data.height
        );
        
        // Update color based on severity
        if (data.severity === 'critical') {
            entity.point.color = Cesium.Color.RED;
        }
    }
};
```

### Heatmap for Health Data
```javascript
// Create heatmap for disease outbreak visualization
function createDiseaseHeatmap(outbreakData) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Generate heatmap using canvas
    // ... heatmap generation logic ...
    
    // Apply as material
    const material = new Cesium.ImageMaterialProperty({
        image: canvas,
        transparent: true
    });
    
    viewer.entities.add({
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(
                west, south, east, north
            ),
            material: material,
            height: 0.0,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    });
}
```

### Time-Series Animation
```javascript
// Animate through time-series health data
viewer.clock.startTime = Cesium.JulianDate.fromDate(startDate);
viewer.clock.stopTime = Cesium.JulianDate.fromDate(endDate);
viewer.clock.currentTime = Cesium.JulianDate.fromDate(startDate);
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 3600; // 1 hour per second

// Update data based on clock
viewer.clock.onTick.addEventListener(function(clock) {
    const currentTime = Cesium.JulianDate.toDate(clock.currentTime);
    updateHealthDataForTime(currentTime);
});
```

## Integration with Global Health Dashboard

### Loading Health Facility Data
```javascript
// Load GeoJSON of health facilities
viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load('/data/health-facilities.geojson', {
        stroke: Cesium.Color.BLUE,
        fill: Cesium.Color.BLUE.withAlpha(0.5),
        strokeWidth: 3,
        markerSymbol: '🏥'
    })
).then(function(dataSource) {
    // Process loaded data
    const entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        // Add custom properties
        entity.description = new Cesium.ConstantProperty(
            `<h3>${entity.properties.name}</h3>
             <p>Capacity: ${entity.properties.capacity}</p>
             <p>Status: ${entity.properties.status}</p>`
        );
    }
});
```

### Crisis Visualization
```javascript
// Visualize crisis zones with dynamic properties
function addCrisisZone(crisisData) {
    const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
            crisisData.longitude,
            crisisData.latitude
        ),
        ellipse: {
            semiMinorAxis: crisisData.radius,
            semiMajorAxis: crisisData.radius,
            height: 0,
            material: Cesium.Color.RED.withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.RED,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        properties: new Cesium.PropertyBag({
            type: crisisData.type,
            severity: crisisData.severity,
            affectedPopulation: crisisData.affectedPopulation
        })
    });
    
    // Pulse animation for attention
    entity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(function(time, result) {
        const baseRadius = crisisData.radius;
        const amplitude = baseRadius * 0.1;
        const frequency = 0.5; // Hz
        const phase = frequency * Cesium.JulianDate.secondsDifference(time, viewer.clock.startTime);
        return baseRadius + amplitude * Math.sin(phase * Math.PI * 2);
    }, false);
    
    entity.ellipse.semiMajorAxis = entity.ellipse.semiMinorAxis;
}
```

## Resources and References

1. **Official Sandcastle**: https://sandcastle.cesium.com/
2. **Example Gallery Source**: https://github.com/CesiumGS/cesium/tree/main/Apps/Sandcastle/gallery
3. **Material Documentation**: https://github.com/CesiumGS/cesium/wiki/Fabric
4. **Architecture Guide**: https://github.com/CesiumGS/cesium/wiki/Architecture

## Tips for Using Sandcastle

1. **Start with existing examples** - Find an example close to what you need and modify it
2. **Use the share feature** - Great for getting help on forums or saving your work
3. **Check the console** - Browser developer console shows detailed error messages
4. **Experiment freely** - Sandcastle resets easily, so try different approaches
5. **Study the patterns** - Notice how examples structure code for reusability

The examples in Sandcastle are designed not just as demos but as learning resources. Each example is self-contained and can be used as a starting point for your own applications.
