# JSON Server Docker Setup

This directory contains Docker configuration for running json-server in a containerized environment.

## Files Created

- `Dockerfile` - Multi-stage Docker build for the json-server application
- `docker-compose.yml` - Docker Compose configuration for easy deployment
- `data/db.json` - Sample database file for development
- `.dockerignore` - Optimizes Docker build by excluding unnecessary files

## Quick Start

### Using Docker Compose (Recommended)

1. Build and start the service:
```bash
docker-compose up -d
```

2. The API will be available at: http://localhost:3000

3. Optional web UI at: http://localhost:8080

### Using Docker directly

1. Build the image:
```bash
docker build -t json-server .
```

2. Run the container:
```bash
docker run -p 3000:3000 -v $(pwd)/data:/data json-server
```

## API Endpoints

Based on the sample data, the following endpoints are available:

- `GET /posts` - Get all posts
- `GET /posts/1` - Get post with id 1
- `POST /posts` - Create a new post
- `PUT /posts/1` - Update post with id 1
- `DELETE /posts/1` - Delete post with id 1
- `GET /comments` - Get all comments
- `GET /users` - Get all users
- `GET /profile` - Get profile information

## Configuration

### Environment Variables

- `JSON_SERVER_HOST` - Host to bind to (default: 0.0.0.0)
- `JSON_SERVER_PORT` - Port to listen on (default: 3000)
- `JSON_SERVER_OPTIONS` - Additional options for customisation (eg: `middlewares`)
- `NODE_ENV` - Node environment (default: production)

### Custom Database

Replace the content of `data/db.json` with your own data structure, or use Docker volumes to manage your data:

```bash
# To use a local file, temporarily mount it:
docker-compose run --rm -v $(pwd)/my-db.json:/data/db.json json-server

# Or copy data into the named volume:
docker cp my-db.json json-server:/data/db.json
```

### Custom Routes

Modify `routes.json` to define custom URL patterns:

```json
{
  "/api/": "/",
  "/blog/:resource/:id/show": "/:resource/:id",
  "/blog/:category": "/posts?category=:category"
}
```

## Command Line Options

The container supports all json-server CLI options:

```bash
docker run -p 3000:3000 json-server node ./lib/cli/bin.js /data/db.json --help
```

Common options:
- `--port, -p` - Set port (default: 3000)
- `--host, -H` - Set host (default: localhost)
- `--watch, -w` - Watch file(s)
- `--routes, -r` - Path to routes file
- `--read-only, --ro` - Allow only GET requests
- `--delay, -d` - Add delay to responses (ms)

## Development

For development with auto-reload:

```bash
docker-compose up --build
```

## Health Check

The container includes a health check that verifies the service is responding on port 3000.

## Security

- Runs as non-root user (jsonserver:nodejs)
- Only production dependencies installed
- Minimal Alpine Linux base image

## Volumes

- `/data` - Database and configuration files (stored in named Docker volume)
- Named volume `json-server-data` persists data across container restarts without creating host directories

### Managing Data

```bash
# View data volume contents
docker-compose exec json-server ls -la /data

# Copy data from container
docker cp json-server:/data/db.json ./my-backup.json

# Copy data to container
docker cp ./my-data.json json-server:/data/db.json
```
