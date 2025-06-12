const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8082

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Example data endpoints
app.get('/api/metrics', async (req, res) => {
  // Placeholder for real metrics from databases
  res.json({
    metrics: [
      { id: 'hunger-index', value: 18.2, unit: 'index', trend: 'decreasing' },
      { id: 'water-access', value: 71, unit: 'percent', trend: 'increasing' },
      { id: 'air-quality', value: 83, unit: 'AQI', trend: 'worsening' },
    ]
  })
})

app.get('/api/layers/:layerId/data', async (req, res) => {
  const { layerId } = req.params
  
  // Placeholder for real geospatial data
  const mockData = {
    'armed-conflict': {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [36.8219, 1.2921] },
          properties: { severity: 'high', description: 'Active conflict zone' }
        }
      ]
    },
    'seismic-activity': {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [139.6917, 35.6895] },
          properties: { magnitude: 4.5, depth: 10, time: '2025-06-12T10:23:00Z' }
        }
      ]
    }
  }
  
  res.json(mockData[layerId] || { type: 'FeatureCollection', features: [] })
})

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})
