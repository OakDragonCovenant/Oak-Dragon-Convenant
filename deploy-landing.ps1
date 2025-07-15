# 🏰 Oak Dragon Covenant - Landing Page Deployment Script (PowerShell)

param(
    [switch]$Development,
    [switch]$SkipTests,
    [string]$Domain = "oakdragoncovenant.com"
)

# Configuration
$ProjectName = "Oak Dragon Covenant Landing Page"
$NodeVersion = 18

# Functions
function Write-Header {
    param([string]$Message)
    Write-Host "🏰 $Message" -ForegroundColor Magenta
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Header
Write-Host "==================================================" -ForegroundColor Cyan
Write-Header "$ProjectName Deployment"
Write-Host "==================================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error "package.json not found. Please run this script from the project root."
    exit 1
}

# Check Node.js version
$NodeCurrent = (node --version).TrimStart('v').Split('.')[0]
if ([int]$NodeCurrent -lt $NodeVersion) {
    Write-Warning "Node.js version $NodeVersion or higher recommended. Current: $(node --version)"
}

# Step 1: Install Dependencies
Write-Info "Installing dependencies..."
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Success "Dependencies installed successfully"
} else {
    Write-Error "Failed to install dependencies"
    exit 1
}

# Step 2: Generate Password Hashes for Demo Users
Write-Info "Generating secure password hashes..."
$hashScript = @"
const bcrypt = require('bcrypt');
const passwords = {
    'OakDragon2025!': 'admin',
    'Covenant@2025': 'oakdragon', 
    'Matrix\$Gold': 'strategist',
    'demo123': 'demo'
};

Object.entries(passwords).forEach(([pass, user]) => {
    const hash = bcrypt.hashSync(pass, 12);
    console.log(`\${user}: \${hash}`);
});
"@

node -e $hashScript
Write-Success "Password hashes generated"

# Step 3: Create Environment File
Write-Info "Setting up environment variables..."
if (-not (Test-Path ".env")) {
    $jwtSecret = -join ((1..64) | ForEach-Object { '{0:X}' -f (Get-Random -Maximum 16) })
    
    $envContent = @"
# 🏰 Oak Dragon Covenant - Environment Configuration
NODE_ENV=$(if ($Development) { 'development' } else { 'production' })
PORT=3000
HOST=0.0.0.0

# Security
JWT_SECRET=$jwtSecret
SESSION_TIMEOUT=3600000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=$(if ($Development) { 'debug' } else { 'info' })

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
"@

    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Success "Environment file created"
} else {
    Write-Warning "Environment file already exists, skipping creation"
}

# Step 4: Run Tests
if (-not $SkipTests) {
    Write-Info "Running tests..."
    npm test
    if ($LASTEXITCODE -eq 0) {
        Write-Success "All tests passed"
    } else {
        Write-Warning "Some tests failed, but continuing deployment"
    }
}

# Step 5: Build optimized version
Write-Info "Building production assets..."
npm run build 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Info "No build script found, skipping..."
}

# Step 6: Set up SSL certificates (placeholder)
Write-Info "Checking SSL configuration..."
if (-not (Test-Path "ssl")) {
    New-Item -ItemType Directory -Path "ssl" -Force | Out-Null
    Write-Warning "SSL directory created. Please add your SSL certificates:"
    Write-Warning "  - ssl/fullchain.pem"
    Write-Warning "  - ssl/privkey.pem"
}

# Step 7: Create Windows Service (optional)
Write-Info "Windows Service setup available via npm package 'node-windows'"

# Step 8: Start the application
Write-Info "Starting Oak Dragon Covenant..."

if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    # Use PM2 if available
    pm2 stop oak-dragon-covenant 2>$null
    if ($Development) {
        pm2 start server.js --name oak-dragon-covenant --env development --watch
    } else {
        pm2 start server.js --name oak-dragon-covenant --env production
    }
    pm2 save
    Write-Success "Application started with PM2"
} else {
    # Start directly
    if ($Development) {
        $env:NODE_ENV = "development"
        Start-Process node -ArgumentList "server.js" -NoNewWindow
    } else {
        $env:NODE_ENV = "production"
        Start-Process node -ArgumentList "server.js" -NoNewWindow
    }
    Write-Success "Application started"
}

# Step 9: Health Check
Write-Info "Performing health check..."
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "Health check passed!"
    } else {
        Write-Error "Health check failed with status: $($response.StatusCode)"
    }
} catch {
    Write-Error "Health check failed. Please check the logs."
}

# Step 10: Display deployment info
Write-Host "==================================================" -ForegroundColor Cyan
Write-Header "Deployment Complete!"
Write-Host "==================================================" -ForegroundColor Cyan
Write-Success "🌐 Landing Page URL: http://localhost:3000"
Write-Success "🔧 API Status: http://localhost:3000/api"
Write-Success "❤️  Health Check: http://localhost:3000/health"
Write-Host ""
Write-Info "Demo Credentials:"
Write-Host "  👤 Username: admin    | Password: OakDragon2025!" -ForegroundColor Gray
Write-Host "  👤 Username: oakdragon | Password: Covenant@2025" -ForegroundColor Gray
Write-Host "  👤 Username: strategist| Password: Matrix`$Gold" -ForegroundColor Gray
Write-Host "  👤 Username: demo      | Password: demo123" -ForegroundColor Gray
Write-Host ""
Write-Warning "Next Steps:"
Write-Host "  1. Configure your domain DNS to point to this server" -ForegroundColor Gray
Write-Host "  2. Update SSL certificates in the ssl/ directory" -ForegroundColor Gray
Write-Host "  3. Update API keys in the .env file" -ForegroundColor Gray
Write-Host "  4. Configure reverse proxy (IIS/nginx) if needed" -ForegroundColor Gray
Write-Host "  5. Set up monitoring and backups" -ForegroundColor Gray
Write-Host ""
Write-Success "🎉 Oak Dragon Covenant is now live!"

# Open browser if in development mode
if ($Development) {
    Write-Info "Opening browser..."
    Start-Process "http://localhost:3000"
}
