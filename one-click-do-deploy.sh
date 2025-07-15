#!/bin/bash
# 🏰 Oak Dragon Covenant - One-Click DigitalOcean Deployment
# Deploy to your custom domain: oakdragoncovenant.com

set -e

echo "🏰 Oak Dragon Covenant - DigitalOcean Custom Domain Deployment"
echo "Target Domain: oakdragoncovenant.com"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_header() { echo -e "${PURPLE}🏰 $1${NC}"; }

# Configuration
DOMAIN="oakdragoncovenant.com"
DROPLET_NAME="oak-dragon-covenant"
DROPLET_SIZE="s-2vcpu-4gb"
DROPLET_REGION="nyc1"
DROPLET_IMAGE="ubuntu-22-04-x64"

# Step 1: Check doctl CLI
log_info "Checking DigitalOcean CLI (doctl)..."
if ! command -v doctl &> /dev/null; then
    log_error "doctl CLI not installed. Installing now..."
    
    # Install doctl
    cd ~
    wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz
    tar xf doctl-*.tar.gz
    sudo mv doctl /usr/local/bin
    rm doctl-*.tar.gz
    
    log_success "doctl CLI installed"
    log_warning "Please run 'doctl auth init' to authenticate with your DigitalOcean token"
    exit 1
fi

if ! doctl account get &> /dev/null; then
    log_error "doctl not authenticated. Please run 'doctl auth init' first."
    exit 1
fi

log_success "DigitalOcean CLI configured"

# Step 2: Check for existing SSH key
log_info "Checking SSH keys..."
SSH_KEY_ID=$(doctl compute ssh-key list --format ID,Name --no-header | grep "oak-dragon" | awk '{print $1}' | head -1)

if [ -z "$SSH_KEY_ID" ]; then
    log_info "Creating SSH key..."
    
    # Generate SSH key if it doesn't exist
    if [ ! -f ~/.ssh/oak_dragon_key ]; then
        ssh-keygen -t rsa -b 4096 -f ~/.ssh/oak_dragon_key -N "" -C "oak-dragon-covenant"
    fi
    
    # Add SSH key to DigitalOcean
    SSH_KEY_ID=$(doctl compute ssh-key import oak-dragon-key --public-key-file ~/.ssh/oak_dragon_key.pub --format ID --no-header)
    log_success "SSH key created: $SSH_KEY_ID"
else
    log_warning "SSH key already exists: $SSH_KEY_ID"
fi

# Step 3: Create cloud-init script
log_info "Creating cloud-init script..."
cat > cloud-init.yml << 'EOF'
#cloud-config
runcmd:
  - apt update && apt upgrade -y
  
  # Install Node.js 18
  - curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  - apt-get install -y nodejs
  
  # Install nginx, certbot, git, htop
  - apt install -y nginx certbot python3-certbot-nginx git htop ufw
  
  # Install PM2
  - npm install -g pm2
  
  # Clone repository
  - git clone https://github.com/OakDragonCovenant/Oak-Dragon-Convenant.git /opt/oak-dragon-covenant
  - cd /opt/oak-dragon-covenant
  
  # Install dependencies
  - npm install
  
  # Create production environment
  - |
    cat > /opt/oak-dragon-covenant/.env << EOL
    NODE_ENV=production
    PORT=3000
    HOST=0.0.0.0
    DOMAIN=oakdragoncovenant.com
    
    # Security
    JWT_SECRET=$(openssl rand -hex 64)
    SESSION_TIMEOUT=3600000
    
    # Rate Limiting
    RATE_LIMIT_WINDOW=900000
    RATE_LIMIT_MAX=100
    
    # Logging
    LOG_LEVEL=info
    
    # Trading Configuration (Update with real credentials)
    COINBASE_API_KEY=your_coinbase_api_key_here
    COINBASE_API_SECRET=your_coinbase_api_secret_here
    COINBASE_PASSPHRASE=your_passphrase_here
    AUTO_TRADING_ENABLED=false
    MAX_TRADE_AMOUNT=10
    DAILY_LOSS_LIMIT=5
    RISK_TOLERANCE=low
    
    # Real Estate
    FUND_SIZE=10000000
    TARGET_IRR=0.15
    MAX_LEVERAGE=0.75
    
    # Database
    DATABASE_URL=sqlite://./oak_dragon_production.db
    EOL
  
  # Start application with PM2
  - cd /opt/oak-dragon-covenant && pm2 start server.js --name oak-dragon-covenant
  - pm2 startup
  - pm2 save
  
  # Configure nginx for oakdragoncovenant.com
  - |
    cat > /etc/nginx/sites-available/oakdragoncovenant.com << 'NGINX_EOF'
    server {
        listen 80;
        server_name oakdragoncovenant.com www.oakdragoncovenant.com;
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name oakdragoncovenant.com www.oakdragoncovenant.com;
    
        # SSL certificates (will be set by certbot)
        ssl_certificate /etc/letsencrypt/live/oakdragoncovenant.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/oakdragoncovenant.com/privkey.pem;
    
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    
        # Static assets with caching
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            root /opt/oak-dragon-covenant/public;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
    NGINX_EOF
  
  # Enable site
  - ln -s /etc/nginx/sites-available/oakdragoncovenant.com /etc/nginx/sites-enabled/
  - rm -f /etc/nginx/sites-enabled/default
  - nginx -t
  
  # Configure firewall
  - ufw allow ssh
  - ufw allow 'Nginx Full'
  - ufw --force enable
  
  # Get SSL certificate (will be done after DNS is configured)
  - sleep 60  # Give DNS time to propagate
  - certbot --nginx -d oakdragoncovenant.com -d www.oakdragoncovenant.com --non-interactive --agree-tos -m admin@oakdragoncovenant.com || true
  
  # Start nginx
  - systemctl enable nginx
  - systemctl restart nginx
  
  # Set up auto-renewal for SSL
  - echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
  
  # Install log rotation for PM2
  - npm install -g pm2-logrotate
  
  # Create deployment complete marker
  - echo "Oak Dragon Covenant deployment completed at $(date)" > /opt/deployment-complete.txt

write_files:
  - path: /opt/oak-dragon-covenant-info.txt
    content: |
      Oak Dragon Covenant Deployment Information
      ==========================================
      Domain: oakdragoncovenant.com
      Deployed: $(date)
      Application Port: 3000
      PM2 Process: oak-dragon-covenant
      
      Next Steps:
      1. Update DNS records to point to this server's IP
      2. Update .env file with real Coinbase credentials
      3. Monitor deployment with: pm2 logs
      4. Access application at: https://oakdragoncovenant.com
EOF

# Step 4: Create Droplet
log_info "Creating DigitalOcean Droplet..."
DROPLET_ID=$(doctl compute droplet create "$DROPLET_NAME" \
    --size "$DROPLET_SIZE" \
    --image "$DROPLET_IMAGE" \
    --region "$DROPLET_REGION" \
    --ssh-keys "$SSH_KEY_ID" \
    --user-data-file cloud-init.yml \
    --tag-names "oak-dragon-covenant,production" \
    --enable-monitoring \
    --enable-ipv6 \
    --format ID \
    --no-header)

log_success "Droplet created: $DROPLET_ID"

# Step 5: Wait for droplet to be active
log_info "Waiting for droplet to be active..."
while [ "$(doctl compute droplet get "$DROPLET_ID" --format Status --no-header)" != "active" ]; do
    echo -n "."
    sleep 5
done
echo ""
log_success "Droplet is active"

# Step 6: Get public IP
PUBLIC_IP=$(doctl compute droplet get "$DROPLET_ID" --format PublicIPv4 --no-header)
log_success "Public IP: $PUBLIC_IP"

# Step 7: Configure DNS automatically if domain is managed by DO
log_info "Checking if domain is managed by DigitalOcean..."
if doctl compute domain list --format Name --no-header | grep -q "^${DOMAIN}$"; then
    log_info "Domain found in DigitalOcean. Configuring DNS records..."
    
    # Delete existing A records for the domain and www
    doctl compute domain records list "$DOMAIN" --format ID,Name,Type --no-header | \
        grep -E "(^[0-9]+ @ A|^[0-9]+ www A)" | \
        awk '{print $1}' | \
        xargs -I {} doctl compute domain records delete "$DOMAIN" {} --force 2>/dev/null || true
    
    # Create new A records
    doctl compute domain records create "$DOMAIN" --record-type A --record-name @ --record-data "$PUBLIC_IP" --record-ttl 300
    doctl compute domain records create "$DOMAIN" --record-type A --record-name www --record-data "$PUBLIC_IP" --record-ttl 300
    
    log_success "DNS records created automatically"
else
    log_warning "Domain not managed by DigitalOcean. Manual DNS configuration required."
fi

# Step 8: Display DNS configuration instructions
log_header "DNS Configuration"
echo ""
if ! doctl compute domain list --format Name --no-header | grep -q "^${DOMAIN}$"; then
    echo "To complete the deployment, update your DNS records:"
    echo ""
    echo "Record Type: A"
    echo "Name: oakdragoncovenant.com (or @)"
    echo "Value: $PUBLIC_IP"
    echo "TTL: 300"
    echo ""
    echo "Record Type: A"
    echo "Name: www"
    echo "Value: $PUBLIC_IP"
    echo "TTL: 300"
    echo ""
fi

# Step 9: Monitor deployment
log_info "Monitoring deployment progress..."
log_warning "This may take 5-10 minutes. You can monitor progress with:"
echo "ssh -i ~/.ssh/oak_dragon_key root@$PUBLIC_IP 'tail -f /var/log/cloud-init-output.log'"
echo ""
echo "Or check PM2 logs:"
echo "ssh -i ~/.ssh/oak_dragon_key root@$PUBLIC_IP 'pm2 logs'"

# Step 10: Wait and test
log_info "Waiting 8 minutes for deployment to complete..."
for i in {1..16}; do
    echo -n "."
    sleep 30
done
echo ""

log_info "Testing deployment..."
if curl -f -s "http://$PUBLIC_IP/health" > /dev/null; then
    log_success "Deployment successful! Application is responding"
else
    log_warning "Application might still be starting. Check logs with:"
    echo "ssh -i ~/.ssh/oak_dragon_key root@$PUBLIC_IP 'pm2 logs'"
fi

# Step 11: Test SSL (if DNS is configured)
if doctl compute domain list --format Name --no-header | grep -q "^${DOMAIN}$"; then
    log_info "Waiting for SSL certificate..."
    sleep 120
    
    if curl -f -s "https://$DOMAIN/health" > /dev/null; then
        log_success "SSL certificate configured successfully!"
    else
        log_warning "SSL might still be configuring. This is normal for new domains."
    fi
fi

# Cleanup
rm -f cloud-init.yml

echo ""
log_header "Deployment Complete!"
echo "=================================================="
log_success "🌐 Your Oak Dragon Covenant is live on DigitalOcean!"
echo ""
echo "📍 Droplet ID: $DROPLET_ID"
echo "🌍 Public IP: $PUBLIC_IP"
echo "🔑 SSH: ssh -i ~/.ssh/oak_dragon_key root@$PUBLIC_IP"
echo "💰 Cost: ~$24/month for this droplet size"
echo ""
echo "🎯 URLs:"
echo "  • Main: https://oakdragoncovenant.com"
echo "  • Dashboard: https://oakdragoncovenant.com/dashboard"
echo "  • Health: https://oakdragoncovenant.com/health"
echo "  • API: https://oakdragoncovenant.com/api"
echo ""
echo "🎯 Next Steps:"
echo "1. Update .env with real Coinbase credentials:"
echo "   ssh -i ~/.ssh/oak_dragon_key root@$PUBLIC_IP 'nano /opt/oak-dragon-covenant/.env'"
echo "2. Monitor with: pm2 logs"
echo "3. Check deployment: curl https://oakdragoncovenant.com/health"
echo ""
log_success "🏰⚡ The Oak Dragon Covenant rules the DigitalOcean! ⚡🏰"
