#!/bin/bash
set -e

# Context8 Landing Page - Rollback Script
# Quickly rollback to previous deployment
# Run as deployer user on the server

# Configuration
APP_NAME="context8-landing"
APP_DIR="/opt/${APP_NAME}"
BACKUP_DIR="${APP_DIR}/backups"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running in app directory
cd "$APP_DIR" || {
    log_error "Application directory not found: $APP_DIR"
    exit 1
}

log_warn "========================================="
log_warn "ROLLBACK INITIATED"
log_warn "========================================="
log_warn "This will restore the previous deployment"
log_warn "Time: $(date)"
log_warn ""

# Parse arguments
BACKUP_FILE=""
USE_PREVIOUS_TAG=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --backup)
            BACKUP_FILE="$2"
            USE_PREVIOUS_TAG=false
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Usage: $0 [--backup BACKUP_FILE]"
            exit 1
            ;;
    esac
done

# Method 1: Rollback using previous tag (fastest)
if [ "$USE_PREVIOUS_TAG" = true ]; then
    log_info "Rolling back using previous image tag..."

    # Check if previous tag exists
    if ! docker image inspect "${APP_NAME}:previous" > /dev/null 2>&1; then
        log_error "Previous image not found. Try using --backup option."
        exit 1
    fi

    # Stop current deployment
    log_info "Stopping current deployment..."
    docker-compose down

    # Restore previous image
    log_info "Restoring previous image..."
    docker tag "${APP_NAME}:previous" "${APP_NAME}:latest"

    # Start previous version
    log_info "Starting previous version..."
    docker-compose up -d

    # Wait for health check
    log_info "Waiting for health check..."
    sleep 5

    if curl -sf "http://localhost/api/health" > /dev/null 2>&1; then
        log_info "Rollback successful! Application is healthy."
    else
        log_warn "Application started but health check failed. Check logs with: docker-compose logs -f"
    fi
fi

# Method 2: Rollback from backup file
if [ "$USE_PREVIOUS_TAG" = false ]; then
    log_info "Rolling back from backup file: $BACKUP_FILE"

    if [ ! -f "$BACKUP_FILE" ]; then
        log_error "Backup file not found: $BACKUP_FILE"
        log_info "Available backups:"
        ls -lh "$BACKUP_DIR"
        exit 1
    fi

    # Stop current deployment
    log_info "Stopping current deployment..."
    docker-compose down

    # Load backup image
    log_info "Loading backup image..."
    gunzip -c "$BACKUP_FILE" | docker load

    # Tag as latest
    docker tag "${APP_NAME}:latest" "${APP_NAME}:latest"

    # Start restored version
    log_info "Starting restored version..."
    docker-compose up -d

    # Wait for health check
    log_info "Waiting for health check..."
    sleep 5

    if curl -sf "http://localhost/api/health" > /dev/null 2>&1; then
        log_info "Rollback successful! Application is healthy."
    else
        log_warn "Application started but health check failed. Check logs with: docker-compose logs -f"
    fi
fi

# Show status
log_info ""
log_info "Container status:"
docker-compose ps

log_info ""
log_info "Recent logs:"
docker-compose logs --tail=20

log_info ""
log_info "========================================="
log_info "Rollback completed"
log_info "========================================="
log_info "Time: $(date)"
log_info ""
log_info "Verify rollback:"
log_info "  - Health: curl http://localhost/api/health"
log_info "  - Logs: docker-compose logs -f"
log_info "  - Status: docker-compose ps"
log_info ""

# List available backups
if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR)" ]; then
    log_info "Available backups for future rollbacks:"
    ls -lht "$BACKUP_DIR" | head -6
fi
