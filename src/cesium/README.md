# Cesium Integration for Global Health BIM Dashboard

This directory contains the Cesium-based 3D globe visualization for the Global Health BIM Dashboard.

## Features

- **3D Globe Visualization**: Interactive Earth globe using CesiumJS
- **Multiple Terrain Options**: 
  - Cesium World Terrain
  - World Bathymetry (Ocean floor visualization)
  - Moon Terrain
  - Flat (Ellipsoid)
- **Various Imagery Layers**:
  - Bing Aerial
  - Bing Aerial with Labels
  - Bing Roads
  - Sentinel-2 satellite imagery
  - Earth at Night
- **3D Building Layers**:
  - OpenStreetMap Buildings (worldwide coverage)
  - Google Photorealistic 3D Tiles
- **Health Crisis Visualization**: Markers for various global health issues
- **Real-time Data Integration**: Ready for live data feeds

## Setup

1. **Get a Cesium Ion Access Token**:
   - Sign up at [https://cesium.com/ion/](https://cesium.com/ion/)
   - Create a new token or use your default token
   - Add the token to your `.env` file:
     ```
     CESIUM_ION_TOKEN=your_token_here
     ```

2. **Start the Services**:
   ```bash
   docker-compose up cesium-viewer
   ```

3. **Access the Viewer**:
   - Open http://localhost:8084 in your browser

## Your Cesium Ion Assets

Based on your Ion account, these assets are available:

| Asset Name | Asset ID | Type | Description |
|------------|----------|------|-------------|
| Cesium Moon Terrain | 2684829 | 3D Tiles | Lunar surface terrain data |
| Cesium OSM Buildings | 2521176 | 3D Tiles | Worldwide building footprints from OpenStreetMap |
| Cesium World Bathymetry | 2426648 | Terrain | Ocean floor elevation data |
| Google Photorealistic 3D Tiles | 2275207 | 3D Tiles | High-quality photogrammetry from Google |
| Sentinel-2 | 3954 | Imagery | ESA satellite imagery |
| Earth at Night | 3812 | Imagery | NASA night lights |
| Bing Maps Road | 4 | Imagery | Road map layer |
| Bing Maps Aerial with Labels | 3 | Imagery | Satellite with street labels |
| Bing Maps Aerial | 2 | Imagery | Satellite imagery |
| Cesium World Terrain | 1 | Terrain | Global elevation data |

## File Structure

```
src/cesium/
├── index.html              # Main Cesium viewer HTML
├── cesium-assets-config.js # Asset configuration and helper functions
└── README.md              # This file

config/cesium/
└── nginx.conf             # Nginx configuration for the viewer service
```

## Usage Examples

### Switching Terrain Providers

The viewer includes a dropdown to switch between different terrain providers. You can also do this programmatically:

```javascript
// Switch to ocean bathymetry
switchTerrain('bathymetry');

// Switch to moon terrain
switchTerrain('moon');
```

### Adding Custom Data Layers

You can add your own data layers for health monitoring:

```javascript
// Add a custom data source
viewer.dataSources.add(Cesium.GeoJsonDataSource.load('/data/health-facilities.geojson', {
  stroke: Cesium.Color.BLUE,
  fill: Cesium.Color.BLUE.withAlpha(0.5),
  strokeWidth: 3
}));

// Add real-time data points
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2
  },
  label: {
    text: 'Health Crisis Location',
    font: '14pt sans-serif',
    style: Cesium.LabelStyle.FILL_AND_OUTLINE
  }
});
```

### Integrating with Real-Time Data

The viewer is designed to work with the dashboard's real-time data streams:

```javascript
// Connect to WebSocket for real-time updates
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
  }
};
```

## API Integration

The Cesium viewer integrates with the main API through Kong:

- Terrain data: `http://localhost:8084/terrain/`
- Global Health Model terrain: `http://localhost:8084/terrain-ghm/`
- API endpoints: `http://localhost:8084/api/`

## Performance Optimization

The viewer includes several performance optimizations:

- Request render mode for better performance
- Level of Detail (LOD) settings for 3D tiles
- Fog and atmosphere effects
- Intelligent tile loading with skip levels

## Customization

You can customize the viewer by modifying:

1. **Layer Controls**: Add new buttons or dropdowns in the HTML
2. **Health Indicators**: Update the panel with real-time data
3. **Camera Views**: Add preset camera positions for specific regions
4. **Styling**: Modify the CSS for different themes

## Troubleshooting

1. **"Invalid token" error**: Make sure your Cesium Ion token is correctly set in the .env file
2. **Terrain not loading**: Check that the terrain server containers are running
3. **Performance issues**: Try disabling Google Photorealistic 3D tiles first
4. **CORS errors**: The nginx configuration includes CORS headers, but check browser console for specific domains

## Future Enhancements

- Integration with BIM models (IFC files converted to 3D Tiles)
- Real-time weather data overlay
- Population density heatmaps
- Disease outbreak tracking
- Infrastructure vulnerability assessment
- Climate change impact visualization
