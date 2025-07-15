#!/bin/bash
# 🏰 Oak Dragon Covenant - One-Click AWS Deployment
# Deploy to your custom domain: oakdragoncovenant.com

set -e

echo "🏰 Oak Dragon Covenant - AWS Custom Domain Deployment"
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
INSTANCE_TYPE="t3.medium"
REGION="us-east-1"
KEY_NAME="oak-dragon-key"
SECURITY_GROUP="oak-dragon-sg"

# Step 1: Check AWS CLI
log_info "Checking AWS CLI configuration..."
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI not installed. Please install and configure it first."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

log_success "AWS CLI configured"

# Step 2: Create Key Pair (if doesn't exist)
log_info "Creating EC2 key pair..."
if ! aws ec2 describe-key-pairs --key-names "$KEY_NAME" &> /dev/null; then
    aws ec2 create-key-pair --key-name "$KEY_NAME" --query 'KeyMaterial' --output text > "${KEY_NAME}.pem"
    chmod 400 "${KEY_NAME}.pem"
    log_success "Key pair created: ${KEY_NAME}.pem"
else
    log_warning "Key pair already exists"
fi

# Step 3: Create Security Group
log_info "Creating security group..."
if ! aws ec2 describe-security-groups --group-names "$SECURITY_GROUP" &> /dev/null; then
    SECURITY_GROUP_ID=$(aws ec2 create-security-group \
        --group-name "$SECURITY_GROUP" \
        --description "Oak Dragon Covenant Security Group" \
        --query 'GroupId' --output text)
    
    # Add rules
    aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 22 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 443 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 3000 --cidr 0.0.0.0/0
    
    log_success "Security group created: $SECURITY_GROUP_ID"
else
    SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --group-names "$SECURITY_GROUP" --query 'SecurityGroups[0].GroupId' --output text)
    log_warning "Security group already exists: $SECURITY_GROUP_ID"
fi

# Step 4: Create User Data Script
log_info "Creating user data script..."
cat > user-data.sh << 'EOF'
#!/bin/bash
set -e

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install nginx, certbot, git
apt install -y nginx certbot python3-certbot-nginx git htop

# Install PM2
npm install -g pm2

# Clone repository
git clone https://github.com/OakDragonCovenant/Oak-Dragon-Convenant.git /opt/oak-dragon-covenant
cd /opt/oak-dragon-covenant

# Install dependencies
npm install

# Create production environment file
cat > .env << EOL
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
pm2 start server.js --name oak-dragon-covenant
pm2 startup
pm2 save

# Configure nginx for oakdragoncovenant.com
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
ln -s /etc/nginx/sites-available/oakdragoncovenant.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t

# Configure firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Get SSL certificate (non-interactive)
certbot --nginx -d oakdragoncovenant.com -d www.oakdragoncovenant.com \
    --non-interactive --agree-tos -m admin@oakdragoncovenant.com

# Start nginx
systemctl enable nginx
systemctl restart nginx

# Set up auto-renewal for SSL
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

# Install log rotation for PM2
npm install -g pm2-logrotate

echo "✅ Oak Dragon Covenant deployed successfully!"
echo "🌐 Access at: https://oakdragoncovenant.com"
EOF

# Step 5: Launch EC2 Instance
log_info "Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --count 1 \
    --instance-type "$INSTANCE_TYPE" \
    --key-name "$KEY_NAME" \
    --security-groups "$SECURITY_GROUP" \
    --user-data file://user-data.sh \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=OakDragonCovenant}]" \
    --query 'Instances[0].InstanceId' \
    --output text)

log_success "Instance launched: $INSTANCE_ID"

# Step 6: Wait for instance to be running
log_info "Waiting for instance to be running..."
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
log_success "Instance is running"

# Step 7: Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids "$INSTANCE_ID" \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

log_success "Public IP: $PUBLIC_IP"

# Step 8: Display DNS configuration instructions
log_header "DNS Configuration Required"
echo ""
echo "To complete the deployment, update your DNS records:"
echo ""
echo "Record Type: A"
echo "Name: oakdragoncovenant.com"
echo "Value: $PUBLIC_IP"
echo "TTL: 300"
echo ""
echo "Record Type: A"
echo "Name: www"
echo "Value: $PUBLIC_IP"
echo "TTL: 300"
echo ""

# Step 9: Monitor deployment
log_info "Monitoring deployment progress..."
log_warning "This may take 5-10 minutes. You can monitor progress with:"
echo "ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP 'tail -f /var/log/cloud-init-output.log'"

# Step 10: Wait and test
log_info "Waiting 8 minutes for deployment to complete..."
sleep 480

log_info "Testing deployment..."
if curl -f -s "http://$PUBLIC_IP/health" > /dev/null; then
    log_success "Deployment successful! Application is responding"
else
    log_warning "Application might still be starting. Check logs with:"
    echo "ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP 'pm2 logs'"
fi

# Cleanup
rm -f user-data.sh

echo ""
log_header "Deployment Complete!"
echo "=================================================="
log_success "🌐 Your Oak Dragon Covenant is deploying to AWS!"
echo ""
echo "📍 Instance: $INSTANCE_ID"
echo "🌍 Public IP: $PUBLIC_IP"
echo "🔑 SSH: ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP"
echo ""
echo "🎯 Next Steps:"
echo "1. Update DNS records (shown above)"
echo "2. Wait for SSL certificate (automatic)"
echo "3. Update .env with real Coinbase credentials"
echo "4. Access: https://oakdragoncovenant.com"
echo ""
log_success "🏰⚡ The Oak Dragon Covenant will rule the cloud! ⚡🏰"
