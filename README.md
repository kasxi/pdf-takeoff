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
docker-compose up dev
```

This will:
- Build the development Docker image
- Mount your local directory to the container for live code changes
- Start the Vite development server on port 5173
- Enable hot-reloading for real-time updates as you code

Access the development application at: http://localhost:5173

### Production Environment

To start the application in production mode:

```bash
docker-compose up prod
```

This will:
- Build the production Docker image
- Compile and optimize the application
- Serve the static files using Nginx on port 80

Access the production application at: http://localhost:80

### Running in the Background

To run containers in detached mode (background):

```bash
docker-compose up -d dev  # For development
docker-compose up -d prod # For production
```

### Stopping Containers

```bash
docker-compose down
```

### Rebuilding Images

If you make changes to the Dockerfile or dependencies:

```bash
docker-compose build dev  # Rebuild development image
docker-compose build prod # Rebuild production image
```

Or rebuild and start in one command:

```bash
docker-compose up --build dev  # For development
docker-compose up --build prod # For production
```

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
