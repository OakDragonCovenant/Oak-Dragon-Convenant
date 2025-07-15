# 🏰 Oak Dragon Covenant - Custom Domain Deployment (Windows)
# Deploy to your domain: oakdragoncovenant.com

param(
    [string]$Provider = "aws",
    [string]$Domain = "oakdragoncovenant.com"
)

Write-Host "🏰 Oak Dragon Covenant - Custom Domain Deployment" -ForegroundColor Magenta
Write-Host "Target Domain: $Domain" -ForegroundColor Cyan
Write-Host "Provider: $Provider" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Gray

function Write-Info($message) { Write-Host "ℹ️  $message" -ForegroundColor Blue }
function Write-Success($message) { Write-Host "✅ $message" -ForegroundColor Green }
function Write-Warning($message) { Write-Host "⚠️  $message" -ForegroundColor Yellow }
function Write-Error($message) { Write-Host "❌ $message" -ForegroundColor Red }
function Write-Header($message) { Write-Host "🏰 $message" -ForegroundColor Magenta }

# Check if running in Windows
if (-not $IsWindows -and -not $env:OS.Contains("Windows")) {
    Write-Error "This script is designed for Windows. Use the .sh scripts on Linux/Mac."
    exit 1
}

switch ($Provider.ToLower()) {
    "aws" {
        Write-Header "AWS Deployment Selected"
        
        # Check AWS CLI
        Write-Info "Checking AWS CLI..."
        if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
            Write-Error "AWS CLI not installed. Please install from: https://aws.amazon.com/cli/"
            Write-Info "After installation, run: aws configure"
            exit 1
        }
        
        # Test AWS credentials
        try {
            aws sts get-caller-identity | Out-Null
            Write-Success "AWS CLI configured"
        } catch {
            Write-Error "AWS CLI not configured. Please run: aws configure"
            exit 1
        }
        
        # Run the bash script via WSL or Git Bash
        if (Get-Command wsl -ErrorAction SilentlyContinue) {
            Write-Info "Running deployment via WSL..."
            wsl bash ./one-click-aws-deploy.sh
        } elseif (Get-Command bash -ErrorAction SilentlyContinue) {
            Write-Info "Running deployment via Git Bash..."
            bash ./one-click-aws-deploy.sh
        } else {
            Write-Error "Please install WSL or Git Bash to run the AWS deployment script."
            Write-Info "Or manually run: ./one-click-aws-deploy.sh"
        }
    }
    
    "digitalocean" {
        Write-Header "DigitalOcean Deployment Selected"
        
        # Check doctl
        Write-Info "Checking DigitalOcean CLI (doctl)..."
        if (-not (Get-Command doctl -ErrorAction SilentlyContinue)) {
            Write-Warning "doctl CLI not installed. Installing now..."
            
            # Download and install doctl
            $downloadUrl = "https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-windows-amd64.zip"
            $zipPath = "$env:TEMP\doctl.zip"
            $extractPath = "$env:TEMP\doctl"
            
            Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
            Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
            
            # Move to Program Files
            $programFiles = "${env:ProgramFiles}\doctl"
            New-Item -ItemType Directory -Path $programFiles -Force | Out-Null
            Copy-Item "$extractPath\doctl.exe" -Destination "$programFiles\doctl.exe" -Force
            
            # Add to PATH
            $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
            if ($currentPath -notlike "*$programFiles*") {
                [Environment]::SetEnvironmentVariable("Path", "$currentPath;$programFiles", "User")
                $env:Path = "$env:Path;$programFiles"
            }
            
            Write-Success "doctl CLI installed"
            Write-Warning "Please restart PowerShell and run: doctl auth init"
            exit 0
        }
        
        # Test DO credentials
        try {
            doctl account get | Out-Null
            Write-Success "DigitalOcean CLI configured"
        } catch {
            Write-Error "doctl not authenticated. Please run: doctl auth init"
            exit 1
        }
        
        # Run the bash script
        if (Get-Command wsl -ErrorAction SilentlyContinue) {
            Write-Info "Running deployment via WSL..."
            wsl bash ./one-click-do-deploy.sh
        } elseif (Get-Command bash -ErrorAction SilentlyContinue) {
            Write-Info "Running deployment via Git Bash..."
            bash ./one-click-do-deploy.sh
        } else {
            Write-Error "Please install WSL or Git Bash to run the DigitalOcean deployment script."
            Write-Info "Or manually run: ./one-click-do-deploy.sh"
        }
    }
    
    "local" {
        Write-Header "Local VPS Deployment Selected"
        Write-Info "This will prepare files for manual VPS deployment"
        
        # Create deployment package
        Write-Info "Creating deployment package..."
        
        $deploymentDir = ".\oak-dragon-deployment"
        New-Item -ItemType Directory -Path $deploymentDir -Force | Out-Null
        
        # Copy essential files
        Copy-Item "package.json" -Destination $deploymentDir
        Copy-Item "server.js" -Destination $deploymentDir
        Copy-Item -Recurse "public" -Destination $deploymentDir -Force
        Copy-Item -Recurse "routes" -Destination $deploymentDir -Force
        Copy-Item -Recurse "RealtyCovenantProtocol" -Destination $deploymentDir -Force
        Copy-Item -Recurse "StrategosProtocol" -Destination $deploymentDir -Force
        Copy-Item -Recurse "OakDragonCovenant" -Destination $deploymentDir -Force
        Copy-Item -Recurse "config" -Destination $deploymentDir -Force
        Copy-Item -Recurse "utils" -Destination $deploymentDir -Force
        
        # Create production environment file
        $envContent = @"
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DOMAIN=$Domain

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
"@
        
        Set-Content -Path "$deploymentDir\.env" -Value $envContent
        
        # Create VPS deployment script
        $vpsScript = @"
#!/bin/bash
# Oak Dragon Covenant - VPS Deployment Script
# Run this on your VPS after uploading the deployment package

set -e

echo "🏰 Oak Dragon Covenant - VPS Deployment"
echo "Domain: $Domain"

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx, certbot, pm2
sudo apt install -y nginx certbot python3-certbot-nginx
sudo npm install -g pm2

# Install dependencies
npm install

# Start application
pm2 start server.js --name oak-dragon-covenant
pm2 startup
pm2 save

# Configure nginx for $Domain
sudo tee /etc/nginx/sites-available/$Domain > /dev/null << 'EOF'
server {
    listen 80;
    server_name $Domain www.$Domain;
    return 301 https://\`$server_name\`$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $Domain www.$Domain;

    ssl_certificate /etc/letsencrypt/live/$Domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$Domain/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \`$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \`$host;
        proxy_set_header X-Real-IP \`$remote_addr;
        proxy_set_header X-Forwarded-For \`$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \`$scheme;
        proxy_cache_bypass \`$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/$Domain /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Get SSL certificate
sudo certbot --nginx -d $Domain -d www.$Domain --non-interactive --agree-tos -m admin@$Domain

# Start nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "✅ Deployment complete!"
echo "🌐 Access at: https://$Domain"
"@
        
        Set-Content -Path "$deploymentDir\deploy-vps.sh" -Value $vpsScript
        
        # Create instructions
        $instructions = @"
Oak Dragon Covenant - VPS Deployment Instructions
================================================

1. Upload this entire folder to your VPS:
   scp -r oak-dragon-deployment user@your-vps-ip:/opt/

2. SSH into your VPS:
   ssh user@your-vps-ip

3. Navigate to the deployment directory:
   cd /opt/oak-dragon-deployment

4. Make the script executable and run it:
   chmod +x deploy-vps.sh
   sudo ./deploy-vps.sh

5. Update your DNS records:
   A Record: $Domain -> YOUR_VPS_IP
   A Record: www -> YOUR_VPS_IP

6. Update .env with real Coinbase credentials:
   nano .env

7. Restart the application:
   pm2 restart oak-dragon-covenant

Your Oak Dragon Covenant will be live at: https://$Domain
"@
        
        Set-Content -Path "$deploymentDir\DEPLOYMENT_INSTRUCTIONS.txt" -Value $instructions
        
        Write-Success "Deployment package created in: $deploymentDir"
        Write-Info "Follow the instructions in DEPLOYMENT_INSTRUCTIONS.txt"
    }
    
    default {
        Write-Error "Unknown provider: $Provider"
        Write-Info "Available providers: aws, digitalocean, local"
        exit 1
    }
}

Write-Header "Deployment process initiated!"
Write-Success "Your Oak Dragon Covenant will be live at: https://$Domain"
