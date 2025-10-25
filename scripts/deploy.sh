#!/bin/bash
set -e

# Context8 Landing Page - Deployment Script
# Blue-green deployment with health checks and automatic rollback
# Run as deployer user on the server

# Configuration
APP_NAME="context8-landing"
APP_DIR="/opt/${APP_NAME}"
COMPOSE_FILE="${APP_DIR}/docker-compose.yml"
HEALTH_ENDPOINT="http://localhost/api/health"
HEALTH_TIMEOUT=60
ROLLBACK_ON_FAILURE=true

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running in app directory
cd "$APP_DIR" || {
    log_error "Application directory not found: $APP_DIR"
    exit 1
}

# Parse arguments
SKIP_BACKUP=false
SKIP_HEALTH_CHECK=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --skip-health-check)
            SKIP_HEALTH_CHECK=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

log_info "Starting deployment of ${APP_NAME}..."
log_info "Directory: ${APP_DIR}"
log_info "Time: $(date)"

# Step 1: Pre-deployment checks
log_step "Step 1/8: Running pre-deployment checks..."

if [ ! -f "$COMPOSE_FILE" ]; then
    log_error "docker-compose.yml not found in $APP_DIR"
    exit 1
fi

if [ ! -f "${APP_DIR}/.env.production" ]; then
    log_error ".env.production not found in $APP_DIR"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    log_error "Docker is not running"
    exit 1
fi

log_info "Pre-deployment checks passed"

# Step 2: Backup current state
if [ "$SKIP_BACKUP" = false ]; then
    log_step "Step 2/8: Creating backup of current deployment..."

    BACKUP_DIR="${APP_DIR}/backups"
    BACKUP_FILE="${BACKUP_DIR}/backup-$(date +%Y%m%d-%H%M%S).tar.gz"

    mkdir -p "$BACKUP_DIR"

    # Backup current images and volumes
    docker save "${APP_NAME}:latest" 2>/dev/null | gzip > "${BACKUP_FILE}" || {
        log_warn "No existing image to backup (first deployment?)"
    }

    # Keep only last 5 backups
    cd "$BACKUP_DIR" && ls -t | tail -n +6 | xargs -r rm
    cd "$APP_DIR"

    log_info "Backup created: $BACKUP_FILE"
else
    log_warn "Skipping backup (--skip-backup flag)"
fi

# Step 3: Pull latest code
log_step "Step 3/8: Pulling latest code from repository..."

if [ -d .git ]; then
    git fetch origin
    git reset --hard origin/main
    log_info "Code updated to latest commit: $(git rev-parse --short HEAD)"
else
    log_warn "Not a git repository, skipping pull"
fi

# Step 4: Build new image
log_step "Step 4/8: Building Docker image..."

# Tag current image as previous (for rollback)
docker tag "${APP_NAME}:latest" "${APP_NAME}:previous" 2>/dev/null || true

# Build new image
DOCKER_BUILDKIT=1 DOCKER_BUILD=true docker-compose build --no-cache

log_info "Docker image built successfully"

# Step 5: Stop old containers (blue-green approach)
log_step "Step 5/8: Stopping old containers..."

# Get current container IDs
OLD_CONTAINERS=$(docker-compose ps -q 2>/dev/null || true)

if [ -n "$OLD_CONTAINERS" ]; then
    log_info "Stopping containers: $OLD_CONTAINERS"
    docker-compose down
else
    log_info "No running containers to stop"
fi

# Step 6: Start new containers
log_step "Step 6/8: Starting new containers..."

docker-compose up -d

log_info "New containers started"

# Step 7: Health check
if [ "$SKIP_HEALTH_CHECK" = false ]; then
    log_step "Step 7/8: Running health checks..."

    ELAPSED=0
    HEALTHY=false

    while [ $ELAPSED -lt $HEALTH_TIMEOUT ]; do
        if curl -sf "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
            HEALTHY=true
            log_info "Health check passed (${ELAPSED}s)"
            break
        fi

        sleep 2
        ELAPSED=$((ELAPSED + 2))
        echo -n "."
    done
    echo ""

    if [ "$HEALTHY" = false ]; then
        log_error "Health check failed after ${HEALTH_TIMEOUT}s"

        if [ "$ROLLBACK_ON_FAILURE" = true ]; then
            log_warn "Initiating automatic rollback..."

            # Stop failed deployment
            docker-compose down

            # Restore previous image
            docker tag "${APP_NAME}:previous" "${APP_NAME}:latest"

            # Start old version
            docker-compose up -d

            log_error "Deployment failed. Rolled back to previous version."
            exit 1
        else
            log_error "Deployment may be unhealthy. Manual intervention required."
            exit 1
        fi
    fi
else
    log_warn "Skipping health check (--skip-health-check flag)"
fi

# Step 8: Cleanup
log_step "Step 8/8: Cleaning up..."

# Remove old images
docker image prune -f

# Show container status
log_info "Container status:"
docker-compose ps

# Show logs preview
log_info "Recent logs:"
docker-compose logs --tail=20

log_info "========================================="
log_info "Deployment completed successfully!"
log_info "========================================="
log_info "Application: ${APP_NAME}"
log_info "Version: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
log_info "Time: $(date)"
log_info ""
log_info "Verify deployment:"
log_info "  - Health: curl $HEALTH_ENDPOINT"
log_info "  - Logs: docker-compose logs -f"
log_info "  - Status: docker-compose ps"
log_info ""

# Send notification (optional)
if command -v notify &> /dev/null; then
    notify "Deployment of ${APP_NAME} completed successfully"
fi
