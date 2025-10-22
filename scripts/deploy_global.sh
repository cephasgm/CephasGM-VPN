#!/bin/bash

# CephasGM VPN Global Deployment Script
set -e

echo "🚀 Starting Global VPN Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARN: $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

log "✅ Docker and Docker Compose are installed"

# Load environment variables
if [ -f ../.env ]; then
    log "Loading environment variables from .env file..."
    export $(cat ../.env | xargs)
else
    warn ".env file not found. Using default values."
fi

# Deploy services
log "Deploying CephasGM VPN stack..."
cd ../infra

# Build and start services
log "Building and starting Docker containers..."
docker-compose up --build -d

# Wait for services to be healthy
log "Waiting for services to be ready..."
sleep 30

# Check if services are running
log "Checking service status..."
if docker-compose ps | grep -q "Up"; then
    log "✅ All services are running successfully!"
    echo ""
    log "📊 Dashboard: http://localhost:3001"
    log "🔗 API: http://localhost:3000"
    log "🌐 Health Check: http://localhost:3000/health"
    echo ""
    log "💡 To view logs: docker-compose logs -f"
    log "💡 To stop services: docker-compose down"
else
    error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

log "🎉 CephasGM VPN deployment completed successfully!"