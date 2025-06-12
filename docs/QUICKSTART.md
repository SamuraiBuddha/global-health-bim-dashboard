# Quick Start Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 20.x or higher
- **Docker** and **Docker Compose**
- **Git**
- **NVIDIA GPU** with CUDA 11.8+ (for full performance)
- **PostgreSQL** 15+ (or use Docker)
- **10GB+ free disk space**

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/SamuraiBuddha/global-health-bim-dashboard.git
cd global-health-bim-dashboard
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Core Configuration
NODE_ENV=development
PORT=3000
API_PORT=8080

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=global_health_dashboard
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# Time Series Database
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your_influxdb_token
INFLUXDB_ORG=global_health
INFLUXDB_BUCKET=metrics

# Graph Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password

# External APIs
CESIUM_ION_TOKEN=your_cesium_token
MAPBOX_TOKEN=your_mapbox_token

# Data Source APIs
USGS_API_KEY=your_usgs_key
NOAA_API_KEY=your_noaa_key
WHO_API_KEY=your_who_key

# GPU Configuration
CUDA_VISIBLE_DEVICES=0
ENABLE_GPU_ACCELERATION=true
```

### 3. Start Infrastructure Services

Start all required services using Docker Compose:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL with PostGIS
- InfluxDB for time-series data
- Neo4j for graph data
- Redis for caching
- Kafka for real-time streaming

Wait for all services to be healthy:

```bash
docker-compose ps
```

### 4. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Rust dependencies (for core engine)
cd src/core
cargo build --release
cd ../..

# Install Python dependencies (for data processing)
pip install -r requirements.txt
```

### 5. Initialize Databases

Run the database setup scripts:

```bash
# PostgreSQL schemas and PostGIS extensions
npm run db:migrate

# Create initial database structure
npm run db:seed

# Initialize Neo4j graph database
npm run graph:init

# Set up InfluxDB buckets
npm run timeseries:init
```

### 6. Build the Application

```bash
# Build frontend assets
npm run build:frontend

# Build backend services
npm run build:backend

# Build Rust core engine
npm run build:core
```

### 7. Start Development Server

```bash
# Start all services in development mode
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:8080
- GraphQL: http://localhost:8080/graphql

## Quick Verification

### 1. Check System Health

```bash
# Run health checks
npm run health:check

# Expected output:
# ✓ PostgreSQL: Connected
# ✓ InfluxDB: Connected
# ✓ Neo4j: Connected
# ✓ Redis: Connected
# ✓ Kafka: Connected
# ✓ GPU: Available (CUDA 12.0)
```

### 2. Load Sample Data

```bash
# Load sample earthquake data
npm run data:load:earthquakes

# Load sample weather data
npm run data:load:weather

# Load sample BIM model
npm run data:load:bim-sample
```

### 3. Access the Dashboard

1. Open http://localhost:3000 in your browser
2. You should see the 3D globe with initial data layers
3. Use the layer controls to toggle different visualizations

## Docker-Only Setup

If you prefer to run everything in Docker:

```bash
# Build and start all services
docker-compose -f docker-compose.full.yml up --build

# The application will be available at http://localhost:3000
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Starting Individual Services

```bash
# Start only the frontend
npm run dev:frontend

# Start only the API
npm run dev:api

# Start only data processors
npm run dev:workers
```

### Monitoring Performance

```bash
# Start performance monitoring
npm run monitor

# View GPU utilization
nvidia-smi -l 1

# Check memory usage
npm run memory:check
```

## Common Issues

### GPU Not Detected

If GPU acceleration isn't working:

```bash
# Check CUDA installation
nvidia-smi

# Verify CUDA version
nvcc --version

# Set CUDA path if needed
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```

### Database Connection Issues

```bash
# Check PostgreSQL
docker-compose logs postgres

# Reset database if needed
npm run db:reset

# Check connections
npm run db:check-connections
```

### Port Conflicts

If ports are already in use:

```bash
# Find process using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or use different ports in .env
PORT=3001
API_PORT=8081
```

### Memory Issues

For large datasets:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Run with increased memory
npm run dev
```

## Next Steps

1. **Configure Data Sources**: See [Data Sources Guide](DATA_SOURCES.md)
2. **Import BIM Models**: See [BIM Integration Guide](BIM_INTEGRATION.md)
3. **Customize Visualizations**: See [Visualization Guide](VISUALIZATION.md)
4. **Deploy to Production**: See [Deployment Guide](DEPLOYMENT.md)

## Getting Help

- Check the [FAQ](FAQ.md)
- Join our [Discord Community](https://discord.gg/global-health-dashboard)
- Report issues on [GitHub](https://github.com/SamuraiBuddha/global-health-bim-dashboard/issues)
- Email support: support@globalhealthdashboard.org