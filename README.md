# PDF Takeoff Application

A React application for PDF viewing and annotation.

## Docker Compose Setup

This application can be run using Docker Compose in both development and production environments.

### Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

### Development Environment

To start the application in development mode with hot-reloading:

```bash
# Clone the dev Dockerfile first
mkdir -p docker
curl -o docker/dev.Dockerfile https://raw.githubusercontent.com/username/pdf-takeoff/main/docker/dev.Dockerfile

# Run the development server
docker run -it --rm -v $(pwd):/app -p 5173:5173 -w /app node:20-alpine sh -c "npm install && npm run dev -- --host 0.0.0.0"
```

Access the development application at: http://localhost:5173

### Production Environment

To start the application in production mode:

```bash
docker-compose up
```

This will:
- Build the production Docker image
- Compile and optimize the application
- Serve the static files using Nginx on port 80

Access the production application at: http://localhost:80

### Stopping Containers

```bash
docker-compose down
```

## Deploying on Coolify

This application is configured for easy deployment on Coolify.

### Prerequisites

- A Coolify instance set up and running
- Access to a Git repository with this codebase

### Deployment Steps

1. Log in to your Coolify dashboard
2. Create a new application
3. Select "Docker Compose" as the build pack
4. Connect your Git repository
5. Set the compose file path to `docker-compose.yml`
6. Deploy the application

Coolify will automatically:
- Build the Docker image
- Deploy the application
- Set up a domain with HTTPS
- Configure health checks

### Environment Variables

No additional environment variables are required for basic deployment.

### Customizing the Deployment

You can customize the deployment by modifying the following files:
- `.coolify/coolify.json`: Coolify-specific configuration
- `docker-compose.yml`: Service configuration
- `nginx.conf`: Nginx server configuration

## Manual Setup (without Docker)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```
