# Terrain Configuration Guide

## Setting up Terrain Providers

### 1. Create your `.env` file
```bash
cd src/web
cp .env.example .env
```

### 2. Get your Cesium Ion Token
1. Go to https://cesium.com/ion/tokens
2. Sign up/login for a free account
3. Create a new token with the following permissions:
   - `assets:read`
   - `geocode`
4. Copy the token to your `.env` file:
   ```
   VITE_CESIUM_ION_TOKEN=your_token_here
   ```

### 3. Get your Azure Maps Key (Optional)
1. Go to https://azure.microsoft.com/en-us/services/azure-maps/
2. Create an Azure account if you don't have one
3. Create a new Azure Maps account in the Azure Portal
4. Go to Authentication > Primary Key
5. Copy the key to your `.env` file:
   ```
   VITE_AZURE_MAPS_KEY=your_key_here
   ```

### 4. Available Terrain Options

The application now supports multiple terrain providers:

1. **No Terrain** - Flat earth view
2. **Cesium World Terrain** - High-resolution global terrain (requires Ion token)
3. **Cesium Ion Terrain (Asset 2)** - Alternative Ion terrain dataset
4. **Local Terrain Server (8082)** - Your custom terrain on port 8082
5. **Global Health Model Terrain (8083)** - GHM-specific terrain on port 8083
6. **Azure Maps (Imagery Only)** - Note: Azure Maps provides satellite/aerial imagery, not terrain elevation

### 5. Using Custom Terrain Data

To use your own terrain data:

1. Place your terrain tiles in the appropriate directory:
   ```
   data/terrain/        # For server on port 8082
   data/terrain-ghm/    # For server on port 8083
   ```

2. The terrain should be in Cesium's quantized-mesh format

3. Start the terrain servers (they're already configured in docker-compose.yml)

### 6. Switching Between Terrain Providers

Use the dropdown in the top-right corner of the map to switch between different terrain providers in real-time.

### 7. Azure Maps Integration

Azure Maps provides high-quality satellite and aerial imagery. When you select "Azure Maps (Imagery Only)" from the dropdown:
- The terrain remains unchanged (keeps using whatever terrain was previously selected)
- Azure Maps imagery becomes available in the base layer picker
- You can combine Azure imagery with Cesium World Terrain for best results

### 8. Troubleshooting

- **"Failed to load terrain"** - Check your Cesium Ion token is valid
- **Local terrain not loading** - Ensure terrain servers are running on ports 8082/8083
- **Azure Maps not showing** - Verify your Azure Maps key is correct and the account is active
- **Azure terrain showing flat** - This is expected; Azure Maps only provides imagery, not terrain elevation

## Adding More Terrain Sources

To add additional terrain sources, edit `src/web/src/components/CesiumGlobe.tsx` and add to the `terrainOptions` array:

```typescript
{ 
  id: 'my-terrain', 
  name: 'My Custom Terrain', 
  type: 'custom', 
  url: 'http://my-terrain-server.com/tiles' 
}
```

## Combining Imagery and Terrain

For the best visualization experience:
1. Use Cesium World Terrain for elevation data
2. Select Azure Maps or other imagery providers from the base layer picker
3. This gives you high-resolution terrain with up-to-date satellite imagery
