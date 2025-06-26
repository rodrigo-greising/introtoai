# Infrastructure

This directory contains all Docker-related configuration files for the IntroToAI project.

## Files

- `docker-compose.yml` - Development environment with hot reload
- `docker-compose.prod.yml` - Production environment
- `Dockerfile` - Production multi-stage Docker build
- `Dockerfile.dev` - Development Docker build (stops at deps stage)
- `.dockerignore` - Files to exclude from Docker build context

## Usage

### Development
```bash
# From project root
docker-compose -f infrastructure/docker-compose.yml up --build
# or
./scripts/dev.sh
```

### Production
```bash
# From project root
docker-compose -f infrastructure/docker-compose.prod.yml up --build
# or
./scripts/prod.sh
```

## Architecture

- **Development**: Uses volume mounts for hot reload, runs Next.js dev server
- **Production**: Multi-stage build with optimized production image 