import { useEffect, useState } from 'react'
import { Viewer, Entity, PointGraphics, PolygonGraphics, PolylineGraphics } from 'resium'
import { 
  Cartesian3, 
  Color, 
  Ion, 
  Terrain, 
  createWorldTerrainAsync,
  CesiumTerrainProvider,
  UrlTemplateImageryProvider,
  IonResource,
  ArcGisMapServerImageryProvider
} from 'cesium'
import './CesiumGlobe.css'

// Set your Cesium Ion token from environment variable
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || 'YOUR_CESIUM_ION_TOKEN'

interface CesiumGlobeProps {
  layers: Array<{
    id: string
    name: string
    visible: boolean
    type: string
  }>
}

interface TerrainOption {
  id: string
  name: string
  type: 'ion' | 'custom' | 'azure' | 'none'
  url?: string
  assetId?: number
  key?: string
}

function CesiumGlobe({ layers }: CesiumGlobeProps) {
  const [terrainProvider, setTerrainProvider] = useState<any>(null)
  const [selectedTerrain, setSelectedTerrain] = useState<string>('cesium-world')
  const [azureImageryProvider, setAzureImageryProvider] = useState<any>(null)
  
  // Terrain options
  const terrainOptions: TerrainOption[] = [
    { id: 'none', name: 'No Terrain', type: 'none' },
    { id: 'cesium-world', name: 'Cesium World Terrain', type: 'ion', assetId: 1 },
    { id: 'cesium-ion-2', name: 'Cesium Ion Terrain (Asset 2)', type: 'ion', assetId: 2 },
    { id: 'local-terrain-1', name: 'Local Terrain Server (8082)', type: 'custom', url: 'http://localhost:8082/tilesets/terrain' },
    { id: 'local-terrain-2', name: 'Global Health Model Terrain (8083)', type: 'custom', url: 'http://localhost:8083/tilesets/terrain' },
    { id: 'azure-maps', name: 'Azure Maps (Imagery Only)', type: 'azure', key: import.meta.env.VITE_AZURE_MAPS_KEY }
  ]

  useEffect(() => {
    loadTerrain(selectedTerrain)
    setupAzureImagery()
  }, [selectedTerrain])

  const setupAzureImagery = () => {
    const azureKey = import.meta.env.VITE_AZURE_MAPS_KEY
    if (azureKey) {
      // Azure Maps imagery provider
      const azureProvider = new UrlTemplateImageryProvider({
        url: `https://atlas.microsoft.com/map/tile?api-version=2.0&tilesetId=microsoft.imagery&zoom={z}&x={x}&y={y}&subscription-key=${azureKey}`,
        credit: 'Azure Maps',
        maximumLevel: 19
      })
      setAzureImageryProvider(azureProvider)
    }
  }

  const loadTerrain = async (terrainId: string) => {
    const option = terrainOptions.find(t => t.id === terrainId)
    if (!option) return

    try {
      let provider = null

      switch (option.type) {
        case 'none':
          setTerrainProvider(null)
          break

        case 'ion':
          if (option.assetId === 1) {
            // Use Cesium World Terrain
            provider = await createWorldTerrainAsync({
              requestWaterMask: true,
              requestVertexNormals: true
            })
          } else {
            // Use custom Ion asset
            provider = await CesiumTerrainProvider.fromIonAssetId(option.assetId!, {
              requestWaterMask: true,
              requestVertexNormals: true
            })
          }
          setTerrainProvider(provider)
          break

        case 'custom':
          // Use custom terrain server
          provider = await CesiumTerrainProvider.fromUrl(option.url!, {
            requestWaterMask: true,
            requestVertexNormals: true
          })
          setTerrainProvider(provider)
          break

        case 'azure':
          // Azure Maps doesn't provide terrain, only imagery
          // Keep existing terrain and note this in the UI
          console.info('Azure Maps provides imagery only. Terrain remains unchanged.')
          break
      }
    } catch (error) {
      console.error('Error loading terrain:', error)
      setTerrainProvider(null)
    }
  }

  // Example entities for different layer types (keeping existing code)
  const renderEntities = () => {
    const entities = []

    // Armed Conflict example points
    if (layers.find(l => l.id === 'armed-conflict')?.visible) {
      entities.push(
        <Entity
          key="conflict-1"
          position={Cartesian3.fromDegrees(36.8219, 1.2921)} // Nairobi
          point={{ pixelSize: 10, color: Color.RED, outlineColor: Color.BLACK, outlineWidth: 2 }}
          description="Active conflict zone - High risk area"
        />,
        <Entity
          key="conflict-2"
          position={Cartesian3.fromDegrees(44.0, 33.3)} // Baghdad
          point={{ pixelSize: 12, color: Color.RED, outlineColor: Color.BLACK, outlineWidth: 2 }}
          description="Active conflict zone - Critical"
        />
      )
    }

    // Sea Level Rise example polygon
    if (layers.find(l => l.id === 'sea-level-rise')?.visible) {
      entities.push(
        <Entity
          key="sea-rise-1"
          polygon={{
            hierarchy: Cartesian3.fromDegreesArray([
              103.8, 1.3,
              103.9, 1.3,
              103.9, 1.2,
              103.8, 1.2,
            ]),
            material: Color.BLUE.withAlpha(0.5),
            height: 0,
            outline: true,
            outlineColor: Color.DARKBLUE,
          }}
          description="Projected flooding area by 2050"
        />,
        <Entity
          key="sea-rise-2"
          polygon={{
            hierarchy: Cartesian3.fromDegreesArray([
              -80.1, 25.7, // Miami area
              -80.1, 25.8,
              -80.2, 25.8,
              -80.2, 25.7,
            ]),
            material: Color.CYAN.withAlpha(0.4),
            height: 0,
            outline: true,
            outlineColor: Color.DARKBLUE,
          }}
          description="Miami coastal flooding risk"
        />
      )
    }

    // Hunger Index visualization
    if (layers.find(l => l.id === 'hunger-index')?.visible) {
      entities.push(
        <Entity
          key="hunger-1"
          position={Cartesian3.fromDegrees(9.0820, 8.6753)} // Nigeria
          ellipse={{
            semiMinorAxis: 100000,
            semiMajorAxis: 100000,
            material: Color.ORANGE.withAlpha(0.6),
            outline: true,
            outlineColor: Color.DARKORANGE,
          }}
          description="High hunger index region - Level 4"
        />,
        <Entity
          key="hunger-2"
          position={Cartesian3.fromDegrees(74.3587, 31.5204)} // Pakistan
          ellipse={{
            semiMinorAxis: 80000,
            semiMajorAxis: 80000,
            material: Color.ORANGE.withAlpha(0.5),
            outline: true,
            outlineColor: Color.DARKORANGE,
          }}
          description="Moderate hunger index - Level 3"
        />
      )
    }

    // Seismic Activity example circles
    if (layers.find(l => l.id === 'seismic-activity')?.visible) {
      entities.push(
        <Entity
          key="seismic-1"
          position={Cartesian3.fromDegrees(139.6917, 35.6895)} // Tokyo
          ellipse={{
            semiMinorAxis: 50000,
            semiMajorAxis: 50000,
            material: Color.ORANGE.withAlpha(0.4),
            outline: true,
            outlineColor: Color.DARKORANGE,
          }}
          description="Recent seismic activity - Magnitude 4.5"
        />,
        <Entity
          key="seismic-2"
          position={Cartesian3.fromDegrees(-118.2437, 34.0522)} // Los Angeles
          ellipse={{
            semiMinorAxis: 40000,
            semiMajorAxis: 40000,
            material: Color.YELLOW.withAlpha(0.4),
            outline: true,
            outlineColor: Color.DARKYELLOW,
          }}
          description="Seismic monitoring zone"
        />
      )
    }

    // Volcanic Activity
    if (layers.find(l => l.id === 'volcanic-activity')?.visible) {
      entities.push(
        <Entity
          key="volcano-1"
          position={Cartesian3.fromDegrees(-122.1965, 46.2022)} // Mt St Helens
          point={{ pixelSize: 15, color: Color.DARKRED, outlineColor: Color.RED, outlineWidth: 3 }}
          description="Mt St Helens - Moderate activity"
        />,
        <Entity
          key="volcano-2"
          position={Cartesian3.fromDegrees(14.4269, 40.8218)} // Vesuvius
          point={{ pixelSize: 15, color: Color.DARKRED, outlineColor: Color.ORANGE, outlineWidth: 3 }}
          description="Mount Vesuvius - Monitoring active"
        />
      )
    }

    // Cyclone/Hurricane Paths
    if (layers.find(l => l.id === 'cyclone-paths')?.visible) {
      entities.push(
        <Entity
          key="cyclone-1"
          polyline={{
            positions: Cartesian3.fromDegreesArray([
              -75.0, 25.0,
              -78.0, 28.0,
              -80.0, 31.0,
              -82.0, 34.0,
            ]),
            width: 5,
            material: Color.PURPLE,
          }}
          description="Hurricane path projection"
        />
      )
    }

    // Water Stress
    if (layers.find(l => l.id === 'water-stress')?.visible) {
      entities.push(
        <Entity
          key="water-1"
          position={Cartesian3.fromDegrees(55.2708, 25.2048)} // Dubai
          ellipse={{
            semiMinorAxis: 100000,
            semiMajorAxis: 100000,
            material: Color.BROWN.withAlpha(0.5),
            outline: true,
            outlineColor: Color.DARKRED,
          }}
          description="Extreme water stress region"
        />
      )
    }

    // Air Quality Index
    if (layers.find(l => l.id === 'air-quality')?.visible) {
      entities.push(
        <Entity
          key="air-1"
          position={Cartesian3.fromDegrees(116.4074, 39.9042)} // Beijing
          ellipse={{
            semiMinorAxis: 150000,
            semiMajorAxis: 150000,
            material: Color.GRAY.withAlpha(0.6),
            outline: true,
            outlineColor: Color.DARKGRAY,
          }}
          description="Poor air quality - AQI 180+"
        />,
        <Entity
          key="air-2"
          position={Cartesian3.fromDegrees(77.1025, 28.7041)} // Delhi
          ellipse={{
            semiMinorAxis: 120000,
            semiMajorAxis: 120000,
            material: Color.GRAY.withAlpha(0.7),
            outline: true,
            outlineColor: Color.BLACK,
          }}
          description="Hazardous air quality - AQI 250+"
        />
      )
    }

    // Disease Outbreaks
    if (layers.find(l => l.id === 'disease-outbreaks')?.visible) {
      entities.push(
        <Entity
          key="disease-1"
          position={Cartesian3.fromDegrees(3.3792, 6.5244)} // Lagos
          point={{ pixelSize: 12, color: Color.PURPLE, outlineColor: Color.WHITE, outlineWidth: 2 }}
          description="Disease outbreak monitoring zone"
        />
      )
    }

    // Deforestation
    if (layers.find(l => l.id === 'deforestation')?.visible) {
      entities.push(
        <Entity
          key="deforest-1"
          polygon={{
            hierarchy: Cartesian3.fromDegreesArray([
              -60.0, -3.0, // Amazon region
              -58.0, -3.0,
              -58.0, -5.0,
              -60.0, -5.0,
            ]),
            material: Color.BROWN.withAlpha(0.4),
            outline: true,
            outlineColor: Color.DARKRED,
          }}
          description="High deforestation area - Amazon"
        />
      )
    }

    return entities
  }

  return (
    <div className="cesium-container">
      <div className="terrain-selector">
        <label>Terrain Provider:</label>
        <select 
          value={selectedTerrain} 
          onChange={(e) => setSelectedTerrain(e.target.value)}
        >
          {terrainOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      
      <Viewer
        full
        terrainProvider={terrainProvider}
        baseLayerPicker={true}
        geocoder={true}
        homeButton={true}
        sceneModePicker={true}
        navigationHelpButton={true}
        animation={true}
        timeline={true}
        fullscreenButton={true}
        vrButton={false}
        imageryProvider={false} // Let user choose via baseLayerPicker
      >
        {renderEntities()}
      </Viewer>
    </div>
  )
}

export default CesiumGlobe
