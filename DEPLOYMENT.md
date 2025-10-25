# Deployment Guide

This guide covers deploying the Context8 landing page to a self-hosted server using Docker and Caddy.

## Prerequisites

- Ubuntu 22.04 or Debian 11+ server
- Domain name pointing to your server IP (A record for context8.io and www.context8.io)
- SSH access to the server
- At least 2GB RAM and 10GB disk space

## Quick Start

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y
```

### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/your-org/context8-landing.git
cd context8-landing

# Create production environment file
cp .env.production.example .env.production
nano .env.production  # Edit as needed

# Build and start services
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### 3. Verify Deployment

- Visit https://context8.io - should show the landing page
- Check https://context8.io/api/health - should return `{"status":"ok"}`
- Caddy will automatically obtain Let's Encrypt SSL certificates

## Architecture

```
Internet → Caddy (port 80/443) → Next.js App (internal:3000)
```

- **Caddy**: Reverse proxy with automatic HTTPS, HTTP/3, and security headers
- **Next.js App**: Production build in standalone mode, runs as non-root user
- **Docker Network**: Internal bridge network for service communication

## Configuration

### Environment Variables

Edit `.env.production`:

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.context8.io  # Your API URL
DOMAIN=context8.io                            # Your domain
DOCKER_BUILD=true                             # Enable Docker optimizations
```

### Caddy Configuration

The `Caddyfile` includes:
- Automatic HTTPS with Let's Encrypt
- HTTP/3 support
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Health check integration
- www to non-www redirect
- Gzip and Zstandard compression

To modify, edit `Caddyfile` and restart:
```bash
docker-compose restart caddy
```

## Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f caddy
```

### Update Application

```bash
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

### Backup

```bash
# Backup Caddy data (certificates)
docker run --rm -v context8_caddy_data:/data -v $(pwd):/backup alpine tar czf /backup/caddy-data-backup.tar.gz /data

# Restore
docker run --rm -v context8_caddy_data:/data -v $(pwd):/backup alpine tar xzf /backup/caddy-data-backup.tar.gz -C /
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove all data (including certificates)
docker-compose down -v

# Remove images
docker rmi context8-landing
```

## Monitoring

### Health Checks

The app includes built-in health checks:
- Docker: `docker inspect --format='{{.State.Health.Status}}' context8-app`
- HTTP: `curl https://context8.io/api/health`

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## Troubleshooting

### Caddy won't start

Check logs:
```bash
docker-compose logs caddy
```

Common issues:
- Port 80/443 already in use: `sudo lsof -i :80 -i :443`
- DNS not pointing to server: `nslookup context8.io`
- Firewall blocking ports: `sudo ufw status`

### App fails health check

```bash
# Check app logs
docker-compose logs app

# Test health endpoint directly
docker exec context8-app curl http://localhost:3000/api/health
```

### SSL Certificate Issues

```bash
# Check Caddy logs for ACME errors
docker-compose logs caddy | grep -i acme

# Manually test certificate
curl -vI https://context8.io 2>&1 | grep -i "subject\|issuer"
```

## Security

### Firewall Setup

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 443/udp  # HTTP/3
sudo ufw enable
```

### Security Best Practices

1. Keep Docker and system packages updated
2. Use non-root user in containers (already configured)
3. Enable automatic security updates: `sudo apt install unattended-upgrades`
4. Monitor logs for suspicious activity
5. Backup Caddy certificates regularly

## Performance

### Image Optimization

Current image size: ~222MB (optimized with multi-stage builds)

To rebuild with latest optimizations:
```bash
docker-compose build --no-cache
```

### Compression

Caddy automatically compresses responses with:
- Gzip
- Zstandard (more efficient than gzip)

### Caching

- Static assets: Cached by browser and CDN
- API responses: Configurable per endpoint
- Binance price data: 60-second cache

## CI/CD Integration

GitHub Actions workflow (see `.github/workflows/deploy.yml`):

1. Runs tests on push to main
2. Builds Docker image
3. Deploys to server via SSH
4. Performs health check
5. Rolls back on failure

## Cost Estimate

Self-hosted deployment costs:
- **VPS**: €5-10/month (Hetzner, DigitalOcean, Linode)
- **Domain**: €10-15/year
- **Total**: ~€70-130/year

Compare to Vercel Pro: $240/year

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify health: `curl https://context8.io/api/health`
3. Review this guide
4. Open GitHub issue with logs and error details
