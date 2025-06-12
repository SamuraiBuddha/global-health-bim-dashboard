# Terrain Data Directory

This directory should contain your terrain tiles in the format expected by Cesium Terrain Server.

## Expected Structure

```
terrain/
├── 0/
│   └── 0/
│       └── 0.terrain
├── 1/
│   ├── 0/
│   │   ├── 0.terrain
│   │   └── 1.terrain
│   └── 1/
│       ├── 0.terrain
│       └── 1.terrain
└── layer.json
```

## Sample layer.json

```json
{
  "tilejson": "2.1.0",
  "format": "heightmap-1.0",
  "version": "1.0.0",
  "scheme": "tms",
  "tiles": ["{z}/{x}/{y}.terrain"]
}
```

## Getting Terrain Data

You can:
1. Use Cesium's sample world terrain
2. Generate your own using tools like `ctb-tile`
3. Download from sources like AWS Terrain Tiles

For testing, you can leave this directory empty and the server will still start.
