# Cesium Terrain Server - Modernized Docker Build

This directory contains a modernized Docker build for the Cesium Terrain Server that addresses the deprecated Schema 1 image issues.

## Key Improvements

- **Ubuntu 22.04** base instead of deprecated Phusion baseimage
- **Go 1.20+** instead of outdated Go version
- **Multi-stage build** for smaller final image (~150MB vs ~500MB)
- **Schema 2 compliant** - no more deprecation warnings
- **Non-root user** execution for better security
- **No unnecessary components** (removed SSH, init systems, etc.)

## Building

From the project root:
```bash
docker-compose build cesium-terrain
```

Or manually:
```bash
docker build -f cesium-terrain-server/docker/Dockerfile -t cesium-terrain-server:modern .
```

## Running

The server is configured in docker-compose.yml to:
- Listen on host port 8082
- Mount terrain tiles from `./data/terrain`
- Run as non-root user `cesium`

## Original Project

This is a modernized build configuration for:
https://github.com/geo-data/cesium-terrain-server

The server functionality remains unchanged - only the Docker packaging has been updated.
