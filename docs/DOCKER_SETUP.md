# Docker Setup Guide

This guide explains how the Docker configuration integrates with your existing self-hosted-ai-starter-kit setup.

## Configuration Overview

The Docker setup has been configured to match your self-hosted-ai-starter-kit connections:

### Database Connections
- **PostgreSQL**: 
  - Host: `postgres`
  - Port: `5432`
  - User: `postgres`
  - Password: `Sup3rBIMgod!`
  - Databases: `global_health_dashboard`, `n8n`, `kong`

- **Neo4j**:
  - Host: `neo4j`
  - Port: `7687` (Bolt), `7474` (HTTP)
  - Auth: `neo4j/password123`

- **Redis**:
  - Host: `redis`
  - Port: `6379`
  - No password required

- **InfluxDB**:
  - Host: `influxdb`
  - Port: `8086`
  - Admin: `admin/admin123`

### AI Services Integration
- **Qdrant** (Vector DB): Port `6333`
- **n8n** (Workflow Automation): Port `5678`
- **Ollama** (Local LLM): Port `11434`

## Quick Start

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Start with specific profiles**:
   ```bash
   # Core services only
   docker-compose up -d

   # With AI services
   docker-compose --profile ai up -d

   # With monitoring
   docker-compose --profile monitoring up -d

   # Development mode (includes frontend/api)
   docker-compose --profile dev up -d

   # Everything
   docker-compose --profile dev --profile ai --profile monitoring up -d
   ```

## Service URLs

Once running, services are available at:

- **Frontend**: http://localhost:3000
- **API Gateway (Kong)**: http://localhost:8080
- **n8n Workflows**: http://localhost:5678
- **Neo4j Browser**: http://localhost:7474
- **InfluxDB UI**: http://localhost:8086
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/Sup3rBIMgod!)
- **Cesium Terrain**: http://localhost:8000

## Integration with self-hosted-ai-starter-kit

This dashboard can work alongside your existing self-hosted-ai-starter-kit services:

1. **Shared PostgreSQL**: Both projects can use the same PostgreSQL instance with different databases
2. **Shared Neo4j**: Graph data can be shared between projects
3. **Shared Qdrant**: Vector embeddings accessible to both systems
4. **n8n Workflows**: Automate data flows between both systems

## Development Workflow

1. **Check service health**:
   ```bash
   docker-compose ps
   docker-compose logs -f [service-name]
   ```

2. **Initialize databases**:
   ```bash
   # Run after services are up
   npm run db:migrate
   npm run db:seed
   npm run graph:init
   ```

3. **Access service shells**:
   ```bash
   # PostgreSQL
   docker-compose exec postgres psql -U postgres

   # Neo4j
   docker-compose exec neo4j cypher-shell -u neo4j -p password123

   # Redis
   docker-compose exec redis redis-cli
   ```

## Troubleshooting

### Port Conflicts
If you're already running services from self-hosted-ai-starter-kit:
- PostgreSQL: Change `5432:5432` to `5433:5432` in docker-compose.yml
- Neo4j: Change `7474:7474` to `7475:7474` and `7687:7687` to `7688:7687`
- Update the corresponding environment variables

### GPU Support
For GPU acceleration (RTX 3090/A5000):
1. Ensure NVIDIA Docker runtime is installed
2. Uncomment GPU sections in docker-compose.override.yml
3. Set `CUDA_VISIBLE_DEVICES` in .env

### Memory Issues
With 128GB RAM, you can increase service memory:
```yaml
services:
  neo4j:
    environment:
      - NEO4J_dbms_memory_heap_max__size=8G
```

## Data Persistence

All data is persisted in named volumes:
- `postgres_storage`: PostgreSQL databases
- `neo4j_data`: Graph database
- `influxdb-data`: Time-series data
- `qdrant_storage`: Vector embeddings
- `n8n_storage`: Workflow configurations

To backup:
```bash
docker run --rm -v global-health-bim-dashboard_postgres_storage:/data -v $(pwd)/backups:/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .
```

## Next Steps

1. Create the source code directories:
   ```bash
   mkdir -p src/{core,services/api,web,workers}
   ```

2. Initialize the frontend and API projects
3. Configure data ingestion pipelines in n8n
4. Set up monitoring dashboards in Grafana