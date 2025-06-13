# Azure Maps Integration Notes

## Quick Setup

1. **Get Azure Maps Key**
   - Sign up at: https://azure.microsoft.com/en-us/services/azure-maps/
   - Create Azure Maps account in Azure Portal
   - Navigate to: Authentication → Primary Key
   - Add to `.env` file: `VITE_AZURE_MAPS_KEY=your_key_here`

2. **What Azure Maps Provides**
   - High-resolution satellite imagery
   - Road map layers
   - Hybrid (satellite + labels) views
   - **Note**: Imagery only, no terrain elevation data

3. **Best Practice**
   - Use Cesium World Terrain for elevation
   - Combine with Azure Maps imagery for up-to-date visuals
   - Access imagery through Cesium's base layer picker

## API Usage

Azure Maps tiles are accessed via:
```
https://atlas.microsoft.com/map/tile?api-version=2.0&tilesetId=microsoft.imagery&zoom={z}&x={x}&y={y}&subscription-key={key}
```

## Available Tileset IDs
- `microsoft.imagery` - Satellite imagery
- `microsoft.base.road` - Road map
- `microsoft.base.hybrid` - Satellite + labels
- `microsoft.base.darkgrey` - Dark theme map

## Cost Considerations
- Azure Maps has a free tier (typically 25,000 transactions/month)
- Each tile request counts as a transaction
- Monitor usage in Azure Portal

## Future Enhancements
Consider adding:
- Azure Maps weather tiles
- Traffic data overlay
- Custom Azure Maps styles
