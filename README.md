# Global Health BIM Dashboard

An integrated 3D visualization platform combining global health monitoring with Building Information Modeling (BIM) infrastructure analysis on a Google Earth-style interface, now featuring a revolutionary humanitarian robot response system.

## Overview

This project merges real-time global crisis monitoring with Building Information Modeling (BIM) technologies and autonomous humanitarian robots to create a comprehensive platform for understanding and actively responding to humanity's major challenges.

### Key Features

- **Real-time Global Monitoring**: Track environmental, geological, health, and conflict data
- **BIM Integration**: Analyze infrastructure vulnerability and resilience
- **3D Visualization**: Google Earth-style interface with multi-scale rendering
- **Predictive Modeling**: ML-driven projections and anomaly detection
- **Cross-Domain Analysis**: Automatic detection of cascading failures
- **Humanitarian Robot Response**: Deploy AI-controlled cleanup robots funded by user engagement

## 🤖 Humanitarian Response System

### Scroll-to-Donate Model
Inspired by Samsung's Global Goals app (300M+ users, $17M+ raised), users generate donations through:
- Scrolling through crisis updates and educational content
- Watching in-app advertisements
- Playing VR training games that teach robots cleanup strategies
- Direct contributions for immediate deployment

### Bipedal Robot Fleet
- **Primary Model**: Unitree G1 humanoid robots ($16,000 per unit)
  - 127cm tall, 35kg weight, 2m/s walking speed
  - 2-hour battery with quick-swap capability
  - 23-43 degrees of freedom for complex tasks
  - Can handle debris clearing, sorting, and basic construction
- **Alternative Options**: Engine AI PM01 ($13,000), Neura 4NE-1 ($15,000-$45,000)
- **Solar-Powered Charging Stations**: Sustainable field operations

### Gamification & Training System

#### VR Training Games (Unreal Engine)
- **Disaster Response Simulator**: Post-earthquake debris clearing strategies
- **Ocean Cleanup Challenge**: Sorting plastics from organics on beaches
- **Construction Site Tetris**: Optimize material stacking and organization
- **Hazmat Hero**: Navigate chemical spills with proper protocols

Players' successful strategies become robot training data - crowdsourcing AI development through gameplay.

#### Real-Time Strategy (RTS) Elements
- Deploy robot units strategically across disaster zones
- Manage resources (energy, maintenance, supply chains)
- Coordinate multi-zone operations
- Compete in clan-based cleanup efficiency battles
- Speedrun challenges for specific disaster scenarios

#### Junkyard Wars Mode
- Scan debris to identify reusable materials
- Design emergency shelters from found materials
- Create water filtration systems from scrap
- Build tool modifications for specific tasks
- Community-voted designs get implemented by robots

### Monetization & Engagement

#### Skin Economy
- Custom robot appearances (earned or purchased)
- Limited edition disaster response skins
- Brand partnerships (Nike cleanup boots, Patagonia robot gear)
- Achievement-based unlocks (1000kg Master golden chassis)
- Community design competitions

#### Live Earth View Integration
- Click any location on the 3D globe for live robot POV
- Time-lapse progress tracking
- Premium subscriptions for 4K feeds and API access
- "Adopt a View" sponsorships for continuous monitoring
- Data licensing to news outlets and research institutions

### Safety & Deployment

#### No Direct Control Policy
- Users train AI through gameplay, not direct robot control
- Eliminates liability risks from misuse
- Robots operate autonomously using crowdsourced strategies
- Live feeds show YOUR training strategies in action

#### Humanitarian Deployment Loophole
- Robots ship directly to disaster zones as "humanitarian aid equipment"
- Bypass import tariffs through disaster relief classification
- 6-12 month field deployment before availability for purchase
- Creates experienced, field-tested units

## Major Crisis Categories

### Environmental Threats
- Sea level rise and coastal flooding
- Climate change impacts (temperature, precipitation, extreme weather)
- Deforestation and habitat loss
- Ocean acidification and marine ecosystem health
- Air quality and pollution levels
- **NEW**: Active cleanup and remediation via robot deployment

### Geological Hazards
- Earthquake activity and fault line monitoring
- Volcanic eruptions and ash dispersal
- Tsunami risk assessment
- Landslide susceptibility
- Subsidence and ground stability
- **NEW**: Rapid response debris clearing and survivor assistance

### Human Crisis Indicators
- Armed conflicts and war zones
- Refugee movements and displacement
- Food insecurity and famine risk
- Disease outbreaks and pandemic tracking
- Economic instability and poverty indices
- Water scarcity and drought conditions
- **NEW**: Direct intervention through humanitarian robotics

### Infrastructure Vulnerability
- Critical infrastructure failure risk
- Power grid resilience
- Transportation network disruption
- Healthcare system capacity
- Supply chain vulnerabilities
- **NEW**: Preventive maintenance and rapid repair via robot crews

## Technical Architecture

### Core Technology Stack

```
Visualization Layer
├── Cesium.js (Primary geospatial renderer)
├── Three.js (Detail rendering, custom shaders)
├── Deck.gl (Large-scale data visualization)
├── WebGPU/WebGL2 (Performance layer)
└── Unreal Engine 5 (VR training environments)

Backend Services
├── Rust (Core geometry engine, memory safety)
├── Node.js/TypeScript (API services)
├── Python (Data processing, ML pipelines)
├── C++ (Physics simulation, CGAL integration)
└── n8n (Robot task orchestration)

Robot Control Systems
├── WebRTC (Low-latency video streaming)
├── CORTEX (Multi-robot coordination)
├── ROS2 (Robot Operating System)
└── Edge Computing (Local decision making)

Data Infrastructure
├── PostgreSQL + PostGIS (Spatial queries)
├── InfluxDB (Time-series data)
├── Neo4j (Graph relationships)
├── Qdrant (Vector embeddings)
├── Apache Kafka (Real-time streaming)
└── IPFS (Distributed robot training data)
```

## System Requirements

### Hardware
- GPU: NVIDIA RTX 3090 or better (CUDA 11.8+)
- RAM: 64GB minimum, 128GB recommended
- Network: 10GbE for real-time data streaming
- Storage: 500GB SSD + NAS for historical data
- VR: Meta Quest 3 or compatible headset for training games

### Software
- Node.js 20+
- Rust 1.70+
- Docker & Docker Compose
- CUDA Toolkit 11.8+
- PostgreSQL 15+ with PostGIS
- InfluxDB 2.0+
- Unreal Engine 5.3+

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
- VR Training Server: http://localhost:8090
- Robot Control API: http://localhost:8100

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

# VR Training environment
cd src/vr-training
npm run dev
```

See [docs/QUICKSTART.md](docs/QUICKSTART.md) for detailed setup instructions.

## Data Sources

### Environmental & Climate
- NOAA (Weather, climate data)
- NASA Earthdata (Satellite observations)
- Copernicus (European Earth observation)
- USGS (Geological data)
- **NEW**: Live robot sensor networks

### Health & Humanitarian
- WHO (Global health data)
- UNHCR (Refugee statistics)
- FAO (Food security)
- World Bank (Economic indicators)
- **NEW**: On-ground situation reports from robots

### Conflict & Security
- ACLED (Armed conflict data)
- GDELT (Global event database)
- Various humanitarian organizations
- **NEW**: Safe zone verification via robot reconnaissance

### Robot Operations
- Unitree Robotics (Hardware telemetry)
- Community training data (Gameplay strategies)
- Field performance metrics
- Environmental sensor arrays

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Data Sources Integration](docs/DATA_SOURCES.md)
- [API Documentation](docs/API.md)
- [BIM Integration Guide](docs/BIM_INTEGRATION.md)
- [Visualization Techniques](docs/VISUALIZATION.md)
- [Docker Setup Guide](docs/DOCKER_SETUP.md) - **NEW**: Integration with self-hosted-ai-starter-kit
- [Robot System Architecture](docs/ROBOT_SYSTEM.md) - **NEW**
- [VR Training Development](docs/VR_TRAINING.md) - **NEW**
- [Monetization Strategy](docs/MONETIZATION.md) - **NEW**
- [Contributing Guide](CONTRIBUTING.md)

## Project Structure

```
global-health-bim-dashboard/
├── src/
│   ├── core/           # Rust core engine
│   ├── services/       # Microservices
│   ├── web/           # Frontend application
│   ├── workers/       # Background processing
│   ├── robot-control/ # Robot coordination system
│   ├── vr-training/   # Unreal Engine VR games
│   └── ml-pipeline/   # Training data processing
├── data/
│   ├── schemas/       # Database schemas
│   ├── migrations/    # Database migrations
│   ├── seeds/        # Sample data
│   └── training/     # Robot behavior datasets
├── docs/             # Documentation
├── scripts/          # Utility scripts
├── tests/           # Test suites
└── docker/          # Docker configurations
```

## Integration with self-hosted-ai-starter-kit

This project is configured to work seamlessly with your existing self-hosted-ai-starter-kit setup:

- **Shared Database Connections**: Uses the same PostgreSQL instance with compatible settings
- **AI Services Integration**: Leverages Ollama, n8n, and Qdrant from your AI stack
- **Unified Authentication**: Same credentials across both systems
- **CORTEX Integration**: Robot coordination through your AI orchestration platform

See [Docker Setup Guide](docs/DOCKER_SETUP.md) for detailed integration instructions.

## Exit Strategy & Partnerships

### Phase 1: Independent Platform (Current)
- Build user base through engaging gameplay
- Generate valuable training data
- Prove humanitarian impact model

### Phase 2: Strategic Partnerships
- Collaborate with robot manufacturers (Unitree, Tesla, Boston Dynamics)
- License training data and deployment platform
- Co-develop specialized humanitarian robots

### Phase 3: Acquisition Opportunities
- Platform becomes essential infrastructure for humanoid robot industry
- Training data worth more than hardware sales
- Exit to highest bidder or maintain as profitable platform

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of conduct
- Development workflow
- Coding standards
- Testing requirements
- Pull request process

Special areas seeking contributors:
- VR game development (Unreal Engine)
- Robot control systems (ROS2)
- ML training pipelines
- BIM integration specialists
- Humanitarian logistics experts

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

This project builds on the vision of creating next-generation BIM software while actively addressing critical global challenges. Special thanks to:
- The open-source community and data providers making this work possible
- Samsung Global Goals for proving the scroll-to-donate model
- Unitree Robotics for affordable humanoid platforms
- The gaming community for turning training into entertainment
- All future players who will help train our humanitarian robot army

Together, we're not just monitoring crises - we're solving them. 🌍🤖