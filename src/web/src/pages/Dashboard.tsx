import { useState } from 'react'
import CesiumGlobe from '../components/CesiumGlobe'
import HealthMetricsPanel from '../components/HealthMetricsPanel'
import LayerControls from '../components/LayerControls'
import './Dashboard.css'

interface Layer {
  id: string
  name: string
  visible: boolean
  type: 'health' | 'infrastructure' | 'environmental' | 'conflict'
}

function Dashboard() {
  const [layers, setLayers] = useState<Layer[]>([
    { id: 'armed-conflict', name: 'Armed Conflicts', visible: false, type: 'conflict' },
    { id: 'sea-level-rise', name: 'Sea Level Rise', visible: false, type: 'environmental' },
    { id: 'hunger-index', name: 'Hunger Index', visible: false, type: 'health' },
    { id: 'poverty-rate', name: 'Poverty Rate', visible: false, type: 'health' },
    { id: 'seismic-activity', name: 'Seismic Activity', visible: false, type: 'environmental' },
    { id: 'volcanic-activity', name: 'Volcanic Activity', visible: false, type: 'environmental' },
    { id: 'cyclone-paths', name: 'Cyclone/Hurricane Paths', visible: false, type: 'environmental' },
    { id: 'water-stress', name: 'Water Stress', visible: false, type: 'environmental' },
    { id: 'air-quality', name: 'Air Quality Index', visible: false, type: 'environmental' },
    { id: 'disease-outbreaks', name: 'Disease Outbreaks', visible: false, type: 'health' },
    { id: 'refugee-camps', name: 'Refugee Camps', visible: false, type: 'conflict' },
    { id: 'deforestation', name: 'Deforestation Rate', visible: false, type: 'environmental' },
    { id: 'biodiversity-loss', name: 'Biodiversity Loss', visible: false, type: 'environmental' },
    { id: 'infrastructure-risk', name: 'Infrastructure Risk', visible: false, type: 'infrastructure' },
  ])

  const toggleLayer = (layerId: string) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    )
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Global Health & Infrastructure Monitoring Dashboard</h1>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Active Alerts</span>
            <span className="stat-value alert">47</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Data Sources</span>
            <span className="stat-value">23</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last Update</span>
            <span className="stat-value">2 min ago</span>
          </div>
        </div>
      </header>
      
      <div className="dashboard-content">
        <aside className="sidebar-left">
          <LayerControls layers={layers} onToggle={toggleLayer} />
        </aside>
        
        <main className="globe-container">
          <CesiumGlobe layers={layers} />
        </main>
        
        <aside className="sidebar-right">
          <HealthMetricsPanel />
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
