#!/bin/bash
# 🏰 Oak Dragon Covenant - Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="oak-dragon-covenant"
COMPOSE_FILE="docker-compose.new.yml"
DEV_COMPOSE_FILE="docker-compose.dev.yml"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Help function
show_help() {
    echo "🏰 Oak Dragon Covenant - Docker Management"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build          Build the Docker image"
    echo "  dev            Start in development mode"
    echo "  prod           Start in production mode"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  logs           Show logs"
    echo "  clean          Clean up containers and images"
    echo "  health         Check health status"
    echo "  shell          Open shell in running container"
    echo "  backup         Backup volumes"
    echo "  help           Show this help message"
    echo ""
}

# Build function
build_image() {
    log_info "Building Oak Dragon Covenant Docker image..."
    docker build -f Dockerfile.new -t ${PROJECT_NAME}:latest .
    log_success "Image built successfully!"
}

# Development mode
start_dev() {
    log_info "Starting Oak Dragon Covenant in development mode..."
    docker-compose -f ${COMPOSE_FILE} -f ${DEV_COMPOSE_FILE} up -d
    log_success "Development environment started!"
    log_info "Application available at: http://localhost:3000"
    log_info "API status: http://localhost:3000/api"
    log_info "Health check: http://localhost:3000/health"
}

# Production mode
start_prod() {
    log_info "Starting Oak Dragon Covenant in production mode..."
    docker-compose -f ${COMPOSE_FILE} up -d
    log_success "Production environment started!"
    log_info "Application available at: http://localhost:3000"
}

# Stop services
stop_services() {
    log_info "Stopping Oak Dragon Covenant services..."
    docker-compose -f ${COMPOSE_FILE} down
    log_success "Services stopped!"
}

# Restart services
restart_services() {
    log_info "Restarting Oak Dragon Covenant services..."
    docker-compose -f ${COMPOSE_FILE} restart
    log_success "Services restarted!"
}

# Show logs
show_logs() {
    log_info "Showing Oak Dragon Covenant logs..."
    docker-compose -f ${COMPOSE_FILE} logs -f --tail=100
}

# Clean up
clean_up() {
    log_warning "This will remove all containers, networks, and unused images!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cleaning up Docker resources..."
        docker-compose -f ${COMPOSE_FILE} down -v --remove-orphans
        docker system prune -f
        docker volume prune -f
        log_success "Cleanup completed!"
    else
        log_info "Cleanup cancelled."
    fi
}

# Health check
check_health() {
    log_info "Checking Oak Dragon Covenant health..."
    
    # Check if containers are running
    if docker-compose -f ${COMPOSE_FILE} ps | grep -q "Up"; then
        log_success "Containers are running"
        
        # Check application health
        if curl -f http://localhost:3000/health &>/dev/null; then
            log_success "Application is healthy"
            curl -s http://localhost:3000/api | jq '.' 2>/dev/null || echo "API response received"
        else
            log_error "Application health check failed"
        fi
    else
        log_error "Containers are not running"
    fi
}

# Open shell
open_shell() {
    log_info "Opening shell in Oak Dragon Covenant container..."
    docker-compose -f ${COMPOSE_FILE} exec oak-dragon-app sh
}

# Backup volumes
backup_volumes() {
    log_info "Creating backup of Oak Dragon Covenant data..."
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "${BACKUP_DIR}"
    
    docker run --rm -v oak-dragon-covenant_oak-dragon-logs:/data -v "$(pwd)/${BACKUP_DIR}:/backup" busybox tar czf /backup/logs.tar.gz -C /data .
    docker run --rm -v oak-dragon-covenant_oak-dragon-data:/data -v "$(pwd)/${BACKUP_DIR}:/backup" busybox tar czf /backup/data.tar.gz -C /data .
    
    log_success "Backup created in ${BACKUP_DIR}"
}

# Main script logic
case "${1:-help}" in
    build)
        build_image
        ;;
    dev)
        build_image
        start_dev
        ;;
    prod)
        build_image
        start_prod
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_up
        ;;
    health)
        check_health
        ;;
    shell)
        open_shell
        ;;
    backup)
        backup_volumes
        ;;
    help|*)
        show_help
        ;;
esac
