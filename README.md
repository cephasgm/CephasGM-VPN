# CephasGM-VPN 🌐

A comprehensive, multi-region VPN solution with admin dashboard, PWA client, and automated deployment.

## Features
- Multi-server support across regions (TZ, EU, US, etc.)
- WireGuard-based VPN infrastructure
- Admin dashboard for server management
- PWA, Desktop, and Mobile clients
- Dockerized deployment with SSL
- Automated scaling and monitoring

## Quick Start
```bash
# Clone and deploy
git clone https://github.com/CephasGM/CephasGM-VPN.git
cd CephasGM-VPN

# Start the stack
cd infra
docker-compose up -d
