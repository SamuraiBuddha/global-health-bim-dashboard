import { useState, useEffect } from 'react'
import './HealthMetricsPanel.css'

interface Metric {
  name: string
  value: string | number
  trend: 'up' | 'down' | 'stable'
  severity: 'critical' | 'warning' | 'normal'
}

function HealthMetricsPanel() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'Global Hunger Index', value: '18.2', trend: 'down', severity: 'warning' },
    { name: 'Access to Clean Water', value: '71%', trend: 'up', severity: 'warning' },
    { name: 'Air Quality (Global AQI)', value: '83', trend: 'down', severity: 'warning' },
    { name: 'Active Conflicts', value: '32', trend: 'up', severity: 'critical' },
    { name: 'Displaced Persons', value: '108M', trend: 'up', severity: 'critical' },
    { name: 'Sea Level Rise', value: '+3.4mm/yr', trend: 'up', severity: 'warning' },
    { name: 'Forest Coverage', value: '31%', trend: 'down', severity: 'warning' },
    { name: 'Species at Risk', value: '42,100', trend: 'up', severity: 'critical' },
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff4444'
      case 'warning': return '#ffaa00'
      case 'normal': return '#00aa00'
      default: return '#666666'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑'
      case 'down': return '↓'
      case 'stable': return '→'
      default: return ''
    }
  }

  return (
    <div className="health-metrics-panel">
      <h2>Global Health Metrics</h2>
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card" style={{ borderLeftColor: getSeverityColor(metric.severity) }}>
            <h4>{metric.name}</h4>
            <div className="metric-value">
              <span className="value">{metric.value}</span>
              <span className={`trend trend-${metric.trend}`}>
                {getTrendIcon(metric.trend)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="alerts-section">
        <h3>Recent Alerts</h3>
        <div className="alert-item critical">
          <span className="alert-time">10:23</span>
          <span className="alert-text">Earthquake M6.2 detected in Pacific Ring</span>
        </div>
        <div className="alert-item warning">
          <span className="alert-time">09:45</span>
          <span className="alert-text">Water stress levels critical in Sub-Saharan region</span>
        </div>
        <div className="alert-item warning">
          <span className="alert-time">08:30</span>
          <span className="alert-text">Air quality degraded in Southeast Asia - AQI 180+</span>
        </div>
      </div>
    </div>
  )
}

export default HealthMetricsPanel
