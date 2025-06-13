# Global Health BIM Dashboard Documentation

## Quick Links

- [Terrain Setup Guide](./terrain-setup.md) - Configure Cesium Ion, Bing Maps, and custom terrain providers
- [API Documentation](./api-docs.md) - API endpoints and integration guide
- [Data Sources](./data-sources.md) - Information about health, environmental, and infrastructure data sources

## Overview

This dashboard integrates multiple data sources to provide a comprehensive view of global health, environmental, and infrastructure metrics on a 3D globe interface.

## Key Features

- **Real-time Data Visualization**: Display multiple data layers on a 3D Cesium globe
- **Terrain Support**: Multiple terrain providers including Cesium Ion and custom terrain servers
- **Clickable Alerts**: Revenue-generating links to authoritative data sources
- **BIM Integration**: Support for infrastructure and building information modeling
- **Multi-source Data**: Aggregate data from various health, environmental, and conflict monitoring sources

## Getting Started

1. Follow the [Terrain Setup Guide](./terrain-setup.md) to configure your map providers
2. Review the [API Documentation](./api-docs.md) for backend integration
3. Check [Data Sources](./data-sources.md) for available data feeds

## Architecture

The system uses:
- **Frontend**: React + TypeScript + Cesium/Resium
- **Backend**: Node.js microservices
- **Databases**: PostgreSQL (PostGIS), InfluxDB, Neo4j, Redis
- **Message Queue**: Kafka
- **API Gateway**: Kong
- **Terrain Servers**: Custom Cesium terrain servers on ports 8082-8083
