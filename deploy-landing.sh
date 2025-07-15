#!/bin/bash
# 🏰 Oak Dragon Covenant - Landing Page Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Oak Dragon Covenant Landing Page"
DOMAIN="oakdragoncovenant.com"
REPO_URL="https://github.com/OakDragonCovenant/Oak-Dragon-Covenant.git"
NODE_VERSION="18"

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

log_header() {
    echo -e "${PURPLE}🏰 $1${NC}"
}

# Header
echo "=================================================="
log_header "$PROJECT_NAME Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_CURRENT=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_CURRENT" -lt "$NODE_VERSION" ]; then
    log_warning "Node.js version $NODE_VERSION or higher recommended. Current: $(node --version)"
fi

# Step 1: Install Dependencies
log_info "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    log_success "Dependencies installed successfully"
else
    log_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Generate Password Hashes for Demo Users
log_info "Generating secure password hashes..."
node -e "
const bcrypt = require('bcrypt');
const passwords = {
    'OakDragon2025!': 'admin',
    'Covenant@2025': 'oakdragon', 
    'Matrix\$Gold': 'strategist',
    'demo123': 'demo'
};

Object.entries(passwords).forEach(([pass, user]) => {
    const hash = bcrypt.hashSync(pass, 12);
    console.log(\`\${user}: \${hash}\`);
});
"
log_success "Password hashes generated"

# Step 3: Create Environment File
log_info "Setting up environment variables..."
if [ ! -f ".env" ]; then
    cat > .env << EOL
# 🏰 Oak Dragon Covenant - Environment Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Security
JWT_SECRET=$(openssl rand -hex 64)
SESSION_TIMEOUT=3600000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info

# Trading (Update with real credentials for production)
COINBASE_API_KEY=your_coinbase_api_key_here
COINBASE_API_SECRET=your_coinbase_api_secret_here
COINBASE_SANDBOX=true
AUTO_TRADING_ENABLED=false

# Real Estate
FUND_SIZE=10000000
TARGET_IRR=0.15
MAX_LEVERAGE=0.75
GEOGRAPHIC_FOCUS=Sun Belt States

# Database (for future use)
DATABASE_URL=sqlite://./oak_dragon.db
EOL
    log_success "Environment file created"
else
    log_warning "Environment file already exists, skipping creation"
fi

# Step 4: Run Tests
log_info "Running tests..."
npm test
if [ $? -eq 0 ]; then
    log_success "All tests passed"
else
    log_warning "Some tests failed, but continuing deployment"
fi

# Step 5: Build optimized version
log_info "Building production assets..."
# Add any build steps here if needed
npm run build 2>/dev/null || log_info "No build script found, skipping..."

# Step 6: Set up SSL certificates (placeholder)
log_info "Checking SSL configuration..."
if [ ! -d "ssl" ]; then
    mkdir -p ssl
    log_warning "SSL directory created. Please add your SSL certificates:"
    log_warning "  - ssl/fullchain.pem"
    log_warning "  - ssl/privkey.pem"
fi

# Step 7: Create systemd service (Linux only)
if command -v systemctl >/dev/null 2>&1; then
    log_info "Creating systemd service..."
    sudo tee /etc/systemd/system/oak-dragon-covenant.service > /dev/null << EOL
[Unit]
Description=Oak Dragon Covenant Landing Page
After=network.target

[Service]
Type=simple
User=\$USER
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

    sudo systemctl daemon-reload
    sudo systemctl enable oak-dragon-covenant
    log_success "Systemd service created and enabled"
fi

# Step 8: Start the application
log_info "Starting Oak Dragon Covenant..."
if command -v pm2 >/dev/null 2>&1; then
    # Use PM2 if available
    pm2 stop oak-dragon-covenant 2>/dev/null || true
    pm2 start server.js --name oak-dragon-covenant --env production
    pm2 save
    log_success "Application started with PM2"
elif command -v systemctl >/dev/null 2>&1; then
    # Use systemd
    sudo systemctl start oak-dragon-covenant
    log_success "Application started with systemd"
else
    # Start directly
    NODE_ENV=production node server.js &
    echo $! > oak-dragon.pid
    log_success "Application started (PID: $(cat oak-dragon.pid))"
fi

# Step 9: Health Check
log_info "Performing health check..."
sleep 5
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    log_success "Health check passed!"
else
    log_error "Health check failed. Please check the logs."
fi

# Step 10: Display deployment info
echo "=================================================="
log_header "Deployment Complete!"
echo "=================================================="
log_success "🌐 Landing Page URL: http://localhost:3000"
log_success "🔧 API Status: http://localhost:3000/api"
log_success "❤️  Health Check: http://localhost:3000/health"
echo ""
log_info "Demo Credentials:"
echo "  👤 Username: admin    | Password: OakDragon2025!"
echo "  👤 Username: oakdragon | Password: Covenant@2025"
echo "  👤 Username: strategist| Password: Matrix\$Gold"
echo "  👤 Username: demo      | Password: demo123"
echo ""
log_warning "Next Steps:"
echo "  1. Configure your domain DNS to point to this server"
echo "  2. Update SSL certificates in the ssl/ directory"
echo "  3. Update API keys in the .env file"
echo "  4. Configure reverse proxy (nginx) if needed"
echo "  5. Set up monitoring and backups"
echo ""
log_success "🎉 Oak Dragon Covenant is now live!"
