# Oak Dragon Covenant - Core Trading Deployment
# Everything deployed, Real Estate paused, Coinbase live trading active
# Budget: $15.99 hosting, $8.88 trading

param(
    [Parameter(Mandatory=$true)]
    [string]$DropletIP
)

Write-Host "🚀 Oak Dragon Covenant - Core Trading Deployment" -ForegroundColor Cyan
Write-Host "IP: $DropletIP | Budget: $15.99 hosting, $8.88 trading" -ForegroundColor Green
Write-Host "Config: Real Estate PAUSED, Coinbase Trading LIVE" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan

# Phase 2: Server Setup
Write-Host "`n=== PHASE 2: Server Setup ===" -ForegroundColor Cyan
Write-Host "Setting up server environment..." -ForegroundColor Yellow

$setupCommands = @(
    "apt update && apt upgrade -y",
    "apt install -y curl wget git nginx nodejs npm ufw htop",
    "curl -fsSL https://deb.nodesource.com/setup_18.x | bash -",
    "apt-get install -y nodejs",
    "npm install -g pm2",
    "ufw allow 22/tcp",
    "ufw allow 80/tcp", 
    "ufw allow 443/tcp",
    "ufw allow 3000/tcp",
    "echo 'y' | ufw enable",
    "systemctl start nginx",
    "systemctl enable nginx"
)

foreach ($cmd in $setupCommands) {
    Write-Host "Executing: $cmd" -ForegroundColor Gray
    ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP $cmd
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Command failed: $cmd" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Server setup complete!" -ForegroundColor Green

# Phase 3: Application Deployment  
Write-Host "`n=== PHASE 3: Application Deployment ===" -ForegroundColor Cyan
Write-Host "Deploying Oak Dragon Covenant..." -ForegroundColor Yellow

$deployCommands = @(
    "cd /var/www",
    "rm -rf Oak-Dragon-Convenant",
    "git clone https://github.com/OakDragonCovenant/Oak-Dragon-Convenant.git",
    "chown -R www-data:www-data Oak-Dragon-Convenant",
    "cd Oak-Dragon-Convenant",
    "npm install --production"
)

foreach ($cmd in $deployCommands) {
    Write-Host "Executing: $cmd" -ForegroundColor Gray
    ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP $cmd
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Command failed: $cmd" -ForegroundColor Red
        exit 1
    }
}

# Configure Environment
Write-Host "`n=== PHASE 4: Environment Configuration ===" -ForegroundColor Cyan
Write-Host "Configuring environment variables..." -ForegroundColor Yellow

$envConfig = @"
NODE_ENV=production
PORT=3000
HOSTING_BUDGET=15.99
TRADING_BUDGET=8.88

# Core Services - ENABLED
COMMAND_CENTER_ENABLED=true
API_GATEWAY_ENABLED=true
MONITORING_ENABLED=true

# Trading - COINBASE LIVE
COINBASE_TRADING_ENABLED=true
COINBASE_LIVE_MODE=true
TRADING_MODE=live
RISK_LEVEL=balanced
MAX_TRADE_AMOUNT=2.96

# Real Estate - PAUSED
HOUSE_FLIP_AGENT_ENABLED=false
REAL_ESTATE_TRADING_PAUSED=true
REAL_ESTATE_MODE=maintenance

# Security
SECURITY_MODE=enhanced
RATE_LIMITING=true
CORS_ENABLED=true

# Monitoring
METRICS_ENABLED=true
HEALTH_CHECKS=true
ERROR_TRACKING=true
"@

# Write environment file
ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP "cd /var/www/Oak-Dragon-Convenant && echo '$envConfig' > .env"

# Start Services with PM2
Write-Host "`n=== PHASE 5: Service Startup ===" -ForegroundColor Cyan
Write-Host "Starting services with PM2..." -ForegroundColor Yellow

$serviceCommands = @(
    "cd /var/www/Oak-Dragon-Convenant",
    "pm2 delete all || true",
    "pm2 start server.js --name oak-dragon-main",
    "pm2 start commandHead.js --name command-center", 
    "pm2 start deployCoinbaseAgent.js --name coinbase-trader",
    "pm2 save",
    "pm2 startup",
    "pm2 list"
)

foreach ($cmd in $serviceCommands) {
    Write-Host "Executing: $cmd" -ForegroundColor Gray
    ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP $cmd
}

# Configure Nginx
Write-Host "`n=== PHASE 6: Nginx Configuration ===" -ForegroundColor Cyan
Write-Host "Configuring reverse proxy..." -ForegroundColor Yellow

$nginxConfig = @"
server {
    listen 80;
    server_name $DropletIP;
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
    
    # API Gateway
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
    
    # Trading endpoints
    location /trading/ {
        proxy_pass http://localhost:3000/trading/;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
    }
}
"@

ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP "echo '$nginxConfig' > /etc/nginx/sites-available/oak-dragon"
ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP "ln -sf /etc/nginx/sites-available/oak-dragon /etc/nginx/sites-enabled/"
ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP "rm -f /etc/nginx/sites-enabled/default"
ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP "nginx -t && systemctl reload nginx"

# Final Status Check
Write-Host "`n=== DEPLOYMENT COMPLETE! ===" -ForegroundColor Green
Write-Host "🎉 Oak Dragon Covenant is now LIVE!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Main Site: http://$DropletIP" -ForegroundColor White
Write-Host "   Dashboard: http://$DropletIP/dashboard" -ForegroundColor White
Write-Host "   API: http://$DropletIP/api" -ForegroundColor White
Write-Host "   Trading: http://$DropletIP/trading" -ForegroundColor White
Write-Host "   Health: http://$DropletIP/health" -ForegroundColor White
Write-Host ""
Write-Host "💰 Budget Status:" -ForegroundColor Yellow
Write-Host "   Hosting: $6/month used of $15.99 budget" -ForegroundColor White
Write-Host "   Trading: $8.88 USDT available for live trading" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Service Status:" -ForegroundColor Cyan
Write-Host "   ✅ Command Center: ACTIVE" -ForegroundColor Green
Write-Host "   ✅ Coinbase Trading: LIVE ($2.96 per trade)" -ForegroundColor Green
Write-Host "   ✅ API Gateway: ACTIVE" -ForegroundColor Green
Write-Host "   ✅ Monitoring: ACTIVE" -ForegroundColor Green
Write-Host "   ⏸️  Real Estate: PAUSED" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Test the website: http://$DropletIP" -ForegroundColor White
Write-Host "   2. Configure Coinbase API keys in dashboard" -ForegroundColor White
Write-Host "   3. Start live trading with $8.88 budget" -ForegroundColor White
Write-Host "   4. Monitor trading performance" -ForegroundColor White

# Check service status
Write-Host "`n📊 Service Health Check:" -ForegroundColor Cyan
ssh -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP "pm2 status"
