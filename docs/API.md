# API Documentation

## Base URL

```
https://api.globalhealthbim.org/v1
```

## Authentication

All API requests require authentication using Bearer tokens:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" https://api.globalhealthbim.org/v1/data
```

## Endpoints

### Global Data

#### GET /data/global
Returns aggregated global health metrics.

**Query Parameters:**
- `categories`: Comma-separated list (environmental,geological,health,conflict)
- `resolution`: Data resolution (low,medium,high)
- `timeRange`: ISO 8601 duration (e.g., P1D for 1 day)

**Response:**
```json
{
  "timestamp": "2025-06-12T14:00:00Z",
  "metrics": {
    "environmental": {
      "co2_level": 421.5,
      "temperature_anomaly": 1.2,
      "sea_level_rise": 3.4
    },
    "geological": {
      "earthquakes_24h": 147,
      "active_volcanoes": 45
    }
  }
}
```

### Geospatial Data

#### GET /data/spatial/{bbox}
Returns data within a bounding box.

**Parameters:**
- `bbox`: Bounding box (west,south,east,north)
- `layers`: Data layers to include
- `format`: Response format (geojson,mvt,3dtiles)

### Time Series

#### GET /data/timeseries/{metric}
Returns historical data for a specific metric.

**Parameters:**
- `metric`: Metric identifier
- `start`: Start timestamp (ISO 8601)
- `end`: End timestamp (ISO 8601)
- `interval`: Data interval (1h,1d,1w)

### BIM Integration

#### POST /bim/analyze
Analyzes BIM model against hazard data.

**Request Body:**
```json
{
  "model_url": "https://example.com/model.ifc",
  "location": {
    "lat": 40.7128,
    "lon": -74.0060
  },
  "hazards": ["earthquake", "flood", "wind"]
}
```

**Response:**
```json
{
  "analysis_id": "uuid",
  "vulnerability_score": 7.2,
  "recommendations": [
    {
      "element": "structural_frame",
      "issue": "seismic_resistance",
      "priority": "high"
    }
  ]
}
```

### Real-time Subscriptions

#### WebSocket /ws/subscribe
Subscribe to real-time data updates.

**Message Format:**
```json
{
  "action": "subscribe",
  "channels": ["earthquakes", "alerts"],
  "filters": {
    "magnitude": ">= 4.0",
    "region": "north_america"
  }
}
```

## Rate Limits

- Free tier: 1000 requests/hour
- Professional: 10000 requests/hour
- Enterprise: Unlimited

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded",
    "details": {
      "limit": 1000,
      "reset": "2025-06-12T15:00:00Z"
    }
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## SDKs

### JavaScript/TypeScript
```typescript
import { GlobalHealthAPI } from '@globalhealthbim/sdk';

const api = new GlobalHealthAPI({
  apiKey: 'YOUR_API_KEY'
});

const data = await api.getGlobalMetrics({
  categories: ['environmental', 'geological']
});
```

### Python
```python
from globalhealthbim import Client

client = Client(api_key='YOUR_API_KEY')
data = client.get_global_metrics(
    categories=['environmental', 'geological']
)
```