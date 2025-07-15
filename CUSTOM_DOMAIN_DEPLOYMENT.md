# 🐉 Oak Dragon Covenant - Custom Domain Deployment Guide

## 🎯 Custom Domain Cloud Service Setup

This guide will help you deploy Oak Dragon Covenant to your own domain with full cloud service capabilities.

## 🏗️ Infrastructure Options

### Option 1: AWS with Your Domain
```yaml
# aws-deploy-config.yml
domain: your-domain.com
subdomain: covenant.your-domain.com
services:
  - ec2: t3.medium (auto-scaling)
  - rds: PostgreSQL 
  - cloudfront: CDN
  - route53: DNS management
  - acm: SSL certificates
```

### Option 2: DigitalOcean App Platform
```yaml
# do-app-config.yml
name: oak-dragon-covenant
region: nyc3
domain: your-domain.com
services:
  - name: web
    source_dir: /
    github:
      repo: OakDragonCovenant/Oak-Dragon-Convenant
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 2
    instance_size_slug: professional-xs
```

### Option 3: Self-Hosted VPS
```yaml
# vps-config.yml
provider: any-vps-provider
specs:
  - cpu: 4 cores
  - ram: 8GB
  - storage: 160GB SSD
  - bandwidth: unlimited
services:
  - nginx: reverse proxy
  - pm2: process manager
  - certbot: SSL certificates
```

## 🚀 Quick Deploy Scripts

### AWS Deployment Script
```bash
#!/bin/bash
# deploy-aws.sh

DOMAIN="your-domain.com"
SUBDOMAIN="covenant.$DOMAIN"

echo "🐉 Deploying Oak Dragon Covenant to AWS..."

# Install AWS CLI and configure
aws configure

# Create S3 bucket for static assets
aws s3 mb s3://oak-dragon-covenant-assets

# Deploy to EC2 with auto-scaling
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --count 1 \
  --instance-type t3.medium \
  --key-name oak-dragon-key \
  --security-group-ids sg-903004f8 \
  --subnet-id subnet-6e7f829e \
  --user-data file://user-data.sh

# Setup Route53 for custom domain
aws route53 create-hosted-zone --name $DOMAIN

# Request SSL certificate
aws acm request-certificate --domain-name $SUBDOMAIN

echo "✅ AWS deployment initiated for $SUBDOMAIN"
```

### DigitalOcean Deployment Script
```bash
#!/bin/bash
# deploy-digitalocean.sh

DOMAIN="your-domain.com"

echo "🐉 Deploying Oak Dragon Covenant to DigitalOcean..."

# Install doctl CLI
snap install doctl

# Authenticate
doctl auth init

# Create app
doctl apps create do-app-config.yml

# Setup custom domain
doctl apps update-domain $APP_ID --domain $DOMAIN

echo "✅ DigitalOcean deployment initiated for $DOMAIN"
```

## 📋 Domain Configuration Templates

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/oak-dragon-covenant
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

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

    # Trading API endpoints
    location /api/trading/ {
        proxy_pass http://localhost:3000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for real-time trading
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Docker Compose for Production
```yaml
# docker-compose.production.yml
version: '3.8'

services:
  oak-dragon-covenant:
    build: .
    container_name: oak_dragon_web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DOMAIN=your-domain.com
      - SSL_ENABLED=true
    volumes:
      - ./logs:/app/logs
      - ./data:/app/data
    networks:
      - oak-dragon-network

  nginx:
    image: nginx:alpine
    container_name: oak_dragon_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - oak-dragon-covenant
    networks:
      - oak-dragon-network

  postgres:
    image: postgres:13
    container_name: oak_dragon_db
    restart: unless-stopped
    environment:
      - POSTGRES_DB=oak_dragon
      - POSTGRES_USER=covenant_user
      - POSTGRES_PASSWORD=secure_dragon_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - oak-dragon-network

networks:
  oak-dragon-network:
    driver: bridge

volumes:
  postgres_data:
```

## 🔐 SSL Certificate Setup

### Let's Encrypt with Certbot
```bash
#!/bin/bash
# setup-ssl.sh

DOMAIN="your-domain.com"

# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare SSL (Alternative)
```javascript
// cloudflare-ssl-config.js
const cloudflare = require('cloudflare');

const cf = cloudflare({
  token: 'your-cloudflare-api-token'
});

async function setupSSL() {
  const zone = await cf.zones.browse();
  
  await cf.zones.settings.edit(zone.result[0].id, 'ssl', {
    value: 'full'
  });
  
  console.log('✅ Cloudflare SSL configured');
}

setupSSL();
```

## 🌐 DNS Configuration

### DNS Records for Your Domain
```bash
# Add these DNS records to your domain registrar:

# A Record
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 300

# CNAME Record
Type: CNAME  
Name: www
Value: your-domain.com
TTL: 300

# CNAME for API subdomain
Type: CNAME
Name: api
Value: your-domain.com
TTL: 300

# MX Record (if using email)
Type: MX
Name: @
Value: mail.your-domain.com
Priority: 10
TTL: 300
```

## 🚀 One-Click Deployment Scripts

### Complete AWS Deployment
```bash
#!/bin/bash
# one-click-aws-deploy.sh

DOMAIN=$1
if [ -z "$DOMAIN" ]; then
  echo "Usage: ./one-click-aws-deploy.sh your-domain.com"
  exit 1
fi

echo "🐉 Starting Oak Dragon Covenant deployment to $DOMAIN"

# 1. Setup AWS infrastructure
aws cloudformation create-stack \
  --stack-name oak-dragon-covenant \
  --template-body file://aws-infrastructure.yml \
  --parameters ParameterKey=DomainName,ParameterValue=$DOMAIN

# 2. Deploy application
aws s3 sync . s3://oak-dragon-covenant-deploy/

# 3. Configure Route53
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456789 \
  --change-batch file://dns-changes.json

# 4. Setup SSL
aws acm request-certificate \
  --domain-name $DOMAIN \
  --validation-method DNS

echo "✅ Deployment complete! Visit https://$DOMAIN"
```

### Complete DigitalOcean Deployment
```bash
#!/bin/bash
# one-click-do-deploy.sh

DOMAIN=$1
if [ -z "$DOMAIN" ]; then
  echo "Usage: ./one-click-do-deploy.sh your-domain.com"
  exit 1
fi

echo "🐉 Starting Oak Dragon Covenant deployment to $DOMAIN"

# 1. Create droplet
doctl compute droplet create oak-dragon-covenant \
  --size s-2vcpu-4gb \
  --image ubuntu-20-04-x64 \
  --region nyc3 \
  --ssh-keys $SSH_KEY_ID

# 2. Setup domain
doctl compute domain create $DOMAIN --ip-address $DROPLET_IP

# 3. Deploy application
ssh root@$DROPLET_IP < deploy-commands.sh

echo "✅ Deployment complete! Visit https://$DOMAIN"
```

## 📊 Monitoring & Analytics

### Custom Analytics Dashboard
```javascript
// analytics-config.js
const analytics = {
  domain: 'your-domain.com',
  tracking: {
    visitors: true,
    trading_events: true,
    performance: true,
    errors: true
  },
  integrations: {
    google_analytics: 'GA_TRACKING_ID',
    custom_dashboard: '/analytics',
    alerts: {
      email: 'admin@your-domain.com',
      slack: 'SLACK_WEBHOOK_URL'
    }
  }
};

module.exports = analytics;
```

## 🔒 Security Configuration

### Firewall Rules
```bash
# ufw-rules.sh
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000 # Application port
sudo ufw --force enable
```

### Rate Limiting
```nginx
# Rate limiting in nginx
http {
    limit_req_zone $binary_remote_addr zone=trading:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
}

server {
    location /api/trading/ {
        limit_req zone=trading burst=20 nodelay;
    }
    
    location /api/ {
        limit_req zone=api burst=50 nodelay;
    }
}
```

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] Domain registered and accessible
- [ ] DNS records configured
- [ ] Server/hosting service selected
- [ ] SSL certificate ready
- [ ] Environment variables configured

### Deployment
- [ ] Application deployed
- [ ] Database connected
- [ ] SSL certificate installed
- [ ] Domain pointing to server
- [ ] Trading APIs configured

### Post-Deployment
- [ ] Health checks passing
- [ ] Analytics tracking active
- [ ] Backup system configured
- [ ] Monitoring alerts setup
- [ ] Performance optimization complete

## 🚀 Launch Your Oak Dragon Covenant

Choose your preferred deployment method and run:

```bash
# For AWS
./one-click-aws-deploy.sh your-domain.com

# For DigitalOcean  
./one-click-do-deploy.sh your-domain.com

# For VPS
./deploy-vps.sh your-domain.com
```

Your Oak Dragon Covenant will be live at `https://your-domain.com` with full trading capabilities and custom branding!

---
*🐉 Oak Dragon Covenant - Sovereign Cloud Infrastructure*
