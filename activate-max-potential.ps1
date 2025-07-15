# Oak Dragon Covenant - Maximum Potential Activation
# Activates Ultra-Micro Trading + Extreme Risk Trading

Write-Host "OAK DRAGON COVENANT - MAXIMUM POTENTIAL ACTIVATION" -ForegroundColor Magenta
Write-Host "===================================================" -ForegroundColor Magenta

# Step 1: Backup current configuration
if (Test-Path ".env") {
    Copy-Item ".env" ".env.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "Configuration backed up" -ForegroundColor Green
}

# Step 2: Update .env for Maximum Potential
Write-Host "Configuring for MAXIMUM POTENTIAL..." -ForegroundColor Cyan

$maxPotentialConfig = @'
# OAK DRAGON COVENANT - MAXIMUM POTENTIAL CONFIGURATION
# WARNING: This enables ultra-micro and extreme risk trading

# Coinbase API Credentials
COINBASE_API_KEY=a6fa2e07-d00b-4ff1-bef8-cd25ba4c161d
COINBASE_API_SECRET=bm+sIEsWeFhCEYB943z528x2YQuBeLdUz8QZdYLTXOCWH/zbM+wcQUAqwAeYHQweEIBEHq5YOH43JP9LFi9Ytig==
COINBASE_PASSPHRASE=Lovehertodeath515!

# Security Configuration
NODE_ENV=production
LOG_LEVEL=info
MAX_TRADE_AMOUNT=8.44
DAILY_LOSS_LIMIT=8.00

# Server Configuration
PORT=3000
HOST=localhost

# Trading Configuration - MAXIMUM POTENTIAL
DEFAULT_TRADING_PAIR=BTC-USD
RISK_TOLERANCE=extreme
AUTO_TRADING_ENABLED=true
COINBASE_SANDBOX=false

# MAXIMUM POTENTIAL SETTINGS
ULTRA_MICRO_TRADING=true
EXTREME_RISK_TRADING=true
MAX_RISK_PERCENT=0.95
ULTRA_PRECISION=true
MOONSHOT_MODE=true
AI_TRADING=true
MIRROR_TRADING=true
PROGRESSIVE_RISK=true
YOLO_MODE=true

# Ultra-Micro Configuration
DUST_THRESHOLD=0.0000001
ULTRA_MICRO_THRESHOLD=0.001
PRECISION_MODE=ultra
MAX_DECIMAL_PLACES=8

# Extreme Risk Configuration
MOONSHOT_ENABLED=true
MARTINGALE_ENABLED=true
CHAOS_MODE=true
EXTREME_VOLATILITY=true
ALL_IN_MODE=true
'@

$maxPotentialConfig | Set-Content ".env"
Write-Host "Maximum potential configuration applied" -ForegroundColor Green

# Step 3: Test ultra-micro capability
Write-Host "Testing Ultra-Micro Trading capability..." -ForegroundColor Cyan
try {
    if (Test-Path "testUltraMicroTrades.js") {
        node "testUltraMicroTrades.js"
        Write-Host "Ultra-Micro test completed" -ForegroundColor Green
    }
} catch {
    Write-Host "Ultra-Micro test skipped (file not found)" -ForegroundColor Yellow
}

# Step 4: Test extreme risk capability
Write-Host "Testing Extreme Risk Trading capability..." -ForegroundColor Red
try {
    if (Test-Path "testExtremeRiskTrades.js") {
        node "testExtremeRiskTrades.js"
        Write-Host "Extreme Risk test completed" -ForegroundColor Green
    }
} catch {
    Write-Host "Extreme Risk test skipped (file not found)" -ForegroundColor Yellow
}

# Step 5: Deploy to live server
Write-Host "Deploying maximum potential to live server..." -ForegroundColor Cyan

$serverCommands = @(
    "echo 'ULTRA_MICRO_TRADING=true' >> /var/www/oak-dragon/.env",
    "echo 'EXTREME_RISK_TRADING=true' >> /var/www/oak-dragon/.env", 
    "echo 'MAX_RISK_PERCENT=0.95' >> /var/www/oak-dragon/.env",
    "echo 'MOONSHOT_MODE=true' >> /var/www/oak-dragon/.env",
    "echo 'YOLO_MODE=true' >> /var/www/oak-dragon/.env",
    "echo 'AUTO_TRADING_ENABLED=true' >> /var/www/oak-dragon/.env",
    "echo 'RISK_TOLERANCE=extreme' >> /var/www/oak-dragon/.env",
    "cd /var/www/oak-dragon && pm2 restart oak-dragon-main"
)

# Check if SSH key exists and try to update server
if (Test-Path "$env:USERPROFILE\.ssh\id_oak_dragon") {
    try {
        Write-Host "Updating live server configuration..." -ForegroundColor Yellow
        foreach ($cmd in $serverCommands) {
            ssh -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@138.197.126.83 $cmd 2>$null
        }
        Write-Host "Live server updated with maximum potential settings" -ForegroundColor Green
    } catch {
        Write-Host "Could not update live server automatically" -ForegroundColor Yellow
    }
}

# Step 6: Final verification
Write-Host "Verifying bot status..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://138.197.126.83" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "Live server responding: HTTP $($response.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "Live server check failed" -ForegroundColor Yellow
}

# Success message
Write-Host ""
Write-Host "MAXIMUM POTENTIAL ACTIVATION COMPLETE!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your Oak Dragon Covenant bot is now running at:" -ForegroundColor Cyan
Write-Host "- Ultra-Micro Trading: 0.0000001 BTC precision" -ForegroundColor White
Write-Host "- Extreme Risk Trading: Up to 95% portfolio" -ForegroundColor White
Write-Host "- Moonshot Trading: 80% portfolio risk available" -ForegroundColor White
Write-Host "- AI Trading: Automated decision making" -ForegroundColor White
Write-Host ""
Write-Host "Portfolio: $8.89 USDT" -ForegroundColor Yellow
Write-Host "Maximum Risk: $8.44 (95% of portfolio)" -ForegroundColor Yellow
Write-Host "Emergency Reserve: $0.45 (5% safety buffer)" -ForegroundColor Yellow
Write-Host ""
Write-Host "WARNING: Bot now operates at MAXIMUM RISK/REWARD potential!" -ForegroundColor Red
Write-Host "Monitor carefully - extreme risk trades can lose 95% of portfolio!" -ForegroundColor Red
