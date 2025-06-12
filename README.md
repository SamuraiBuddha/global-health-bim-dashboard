# Global Health BIM Dashboard

An integrated 3D visualization platform combining global health monitoring with Building Information Modeling (BIM) infrastructure analysis on a Google Earth-style interface.

## Overview

This project merges real-time global crisis monitoring with Building Information Modeling (BIM) technologies to create a comprehensive platform for understanding and responding to humanity's major challenges.

### Key Features

- **Real-time Global Monitoring**: Track environmental, geological, health, and conflict data
- **BIM Integration**: Analyze infrastructure vulnerability and resilience
- **3D Visualization**: Google Earth-style interface with multi-scale rendering
- **Predictive Modeling**: ML-driven projections and anomaly detection
- **Cross-Domain Analysis**: Automatic detection of cascading failures

## Major Crisis Categories

### Environmental Threats
- Sea level rise and coastal flooding
- Climate change impacts (temperature, precipitation, extreme weather)
- Deforestation and habitat loss
- Ocean acidification and marine ecosystem health
- Air quality and pollution levels

### Geological Hazards
- Earthquake activity and fault line monitoring
- Volcanic eruptions and ash dispersal
- Tsunami risk assessment
- Landslide susceptibility
- Subsidence and ground stability

### Human Crisis Indicators
- Armed conflicts and war zones
- Refugee movements and displacement
- Food insecurity and famine risk
- Disease outbreaks and pandemic tracking
- Economic instability and poverty indices
- Water scarcity and drought conditions

### Infrastructure Vulnerability
- Critical infrastructure failure risk
- Power grid resilience
- Transportation network disruption
- Healthcare system capacity
- Supply chain vulnerabilities

## Technical Architecture

### Core Technology Stack

```
Visualization Layer
├── Cesium.js (Primary geospatial renderer)
├── Three.js (Detail rendering, custom shaders)
├── Deck.gl (Large-scale data visualization)
└── WebGPU/WebGL2 (Performance layer)

Backend Services
├── Rust (Core geometry engine, memory safety)
├── Node.js/TypeScript (API services)
├── Python (Data processing, ML pipelines)
└── C++ (Physics simulation, CGAL integration)

Data Infrastructure
├── PostgreSQL + PostGIS (Spatial queries)
├── InfluxDB (Time-series data)
├── Neo4j (Graph relationships)
├── Qdrant (Vector embeddings)
└── Apache Kafka (Real-time streaming)
```

## System Requirements

### Hardware
- GPU: NVIDIA RTX 3090 or better (CUDA 11.8+)
- RAM: 64GB minimum, 128GB recommended
- Network: 10GbE for real-time data streaming
- Storage: 500GB SSD + NAS for historical data

### Software
- Node.js 20+
- Rust 1.70+
- Docker & Docker Compose
- CUDA Toolkit 11.8+
- PostgreSQL 15+ with PostGIS
- InfluxDB 2.0+

## Quick Start

### Prerequisites

1. **Get a Cesium Ion Access Token** (required for 3D terrain and imagery):
   - Sign up for a free account at [https://cesium.com/ion/tokens](https://cesium.com/ion/tokens)
   - Create a new token
   - Keep it handy for the setup process

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/SamuraiBuddha/global-health-bim-dashboard.git
cd global-health-bim-dashboard

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# IMPORTANT: Add your Cesium Ion token to the frontend environment
cp src/web/.env.example src/web/.env
# Edit src/web/.env and add your VITE_CESIUM_ION_TOKEN

# Start infrastructure services
docker-compose up -d

# Install frontend dependencies
cd src/web
npm install
cd ../..

# Start development servers
docker-compose --profile dev up
```

The application will be available at:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Terrain Server (Main): http://localhost:8000
- Terrain Server (GHM): http://localhost:8083

### Development Mode

To run individual services in development:

```bash
# Frontend only (with hot reload)
cd src/web
npm run dev

# API service
cd src/services/api
npm run dev

# Data workers
cd src/workers
npm run dev
```

See [docs/QUICKSTART.md](docs/QUICKSTART.md) for detailed setup instructions.

## Data Sources

### Environmental & Climate
- NOAA (Weather, climate data)
- NASA Earthdata (Satellite observations)
- Copernicus (European Earth observation)
- USGS (Geological data)

### Health & Humanitarian
- WHO (Global health data)
- UNHCR (Refugee statistics)
- FAO (Food security)
- World Bank (Economic indicators)

### Conflict & Security
- ACLED (Armed conflict data)
- GDELT (Global event database)
- Various humanitarian organizations

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Data Sources Integration](docs/DATA_SOURCES.md)
- [API Documentation](docs/API.md)
- [BIM Integration Guide](docs/BIM_INTEGRATION.md)
- [Visualization Techniques](docs/VISUALIZATION.md)
- [Docker Setup Guide](docs/DOCKER_SETUP.md) - **NEW**: Integration with self-hosted-ai-starter-kit
- [Contributing Guide](CONTRIBUTING.md)

## Project Structure

```
global-health-bim-dashboard/
├── src/
│   ├── core/          # Rust core engine
│   ├── services/      # Microservices
│   ├── web/          # Frontend application
│   └── workers/      # Background processing
├── data/
│   ├── schemas/      # Database schemas
│   ├── migrations/   # Database migrations
│   └── seeds/        # Sample data
├── docs/             # Documentation
├── scripts/          # Utility scripts
├── tests/            # Test suites
└── docker/           # Docker configurations
```

## Integration with self-hosted-ai-starter-kit

This project is configured to work seamlessly with your existing self-hosted-ai-starter-kit setup:

- **Shared Database Connections**: Uses the same PostgreSQL instance with compatible settings
- **AI Services Integration**: Leverages Ollama, n8n, and Qdrant from your AI stack
- **Unified Authentication**: Same credentials across both systems

See [Docker Setup Guide](docs/DOCKER_SETUP.md) for detailed integration instructions.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of conduct
- Development workflow
- Coding standards
- Testing requirements
- Pull request process

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

This project builds on the vision of creating next-generation BIM software while addressing critical global challenges. Special thanks to the open-source community and data providers making this work possible.
