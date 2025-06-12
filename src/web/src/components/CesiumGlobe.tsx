import { useEffect, useState } from 'react'
import { Viewer, Entity, PointGraphics, PolygonGraphics, PolylineGraphics } from 'resium'
import { Cartesian3, Color, Ion, Terrain, createWorldTerrainAsync } from 'cesium'
import './CesiumGlobe.css'

// Set your Cesium Ion token (you'll need to get one from https://cesium.com/ion/)
Ion.defaultAccessToken = 'YOUR_CESIUM_ION_TOKEN'

interface CesiumGlobeProps {
  layers: Array<{
    id: string
    name: string
    visible: boolean
    type: string
  }>
}

function CesiumGlobe({ layers }: CesiumGlobeProps) {
  const [terrainProvider, setTerrainProvider] = useState<Terrain | null>(null)

  useEffect(() => {
    // Load world terrain
    createWorldTerrainAsync().then(terrain => {
      setTerrainProvider(terrain)
    })
  }, [])

  // Example entities for different layer types
  const renderEntities = () => {
    const entities = []

    // Armed Conflict example points
    if (layers.find(l => l.id === 'armed-conflict')?.visible) {
      entities.push(
        <Entity
          key="conflict-1"
          position={Cartesian3.fromDegrees(36.8219, 1.2921)} // Example: Nairobi
          point={{ pixelSize: 10, color: Color.RED, outlineColor: Color.BLACK, outlineWidth: 2 }}
          description="Active conflict zone - High risk area"
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
        />
      )
    }

    // Seismic Activity example circle
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
        />
      )
    }

    return entities
  }

  return (
    <div className="cesium-container">
      <Viewer
        full
        terrainProvider={terrainProvider || undefined}
        baseLayerPicker={false}
        geocoder={true}
        homeButton={true}
        sceneModePicker={true}
        navigationHelpButton={true}
        animation={true}
        timeline={true}
        fullscreenButton={true}
        vrButton={false}
      >
        {renderEntities()}
      </Viewer>
    </div>
  )
}

export default CesiumGlobe
