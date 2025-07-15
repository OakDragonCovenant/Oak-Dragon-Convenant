# Oak Dragon Covenant - Automated Deployment Script
# Clean PowerShell script without Unicode issues

Write-Host "Oak Dragon Covenant - Automated Deployment Starting..." -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan

# Function to test command availability
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Phase 1: Environment Setup
Write-Host ""
Write-Host "Phase 1: Environment Setup" -ForegroundColor Green
Write-Host "Checking required tools..." -ForegroundColor White

$tools = @{
    "node" = "Node.js"
    "npm" = "NPM"
    "git" = "Git"
}

foreach ($tool in $tools.GetEnumerator()) {
    if (Test-Command $tool.Key) {
        Write-Host "✓ $($tool.Value) - Available" -ForegroundColor Green
    } else {
        Write-Host "✗ $($tool.Value) - Not found! Please install." -ForegroundColor Red
        exit 1
    }
}

# Install CLIs if needed
Write-Host ""
Write-Host "Installing cloud platform CLIs..." -ForegroundColor White

if (-not (Test-Command "railway")) {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

if (-not (Test-Command "vercel")) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✓ All tools ready!" -ForegroundColor Green

# Phase 2: Project Preparation
Write-Host ""
Write-Host "Phase 2: Project Preparation" -ForegroundColor Green
Write-Host "Setting up project dependencies..." -ForegroundColor White

# Install dependencies
npm install

# Verify key files exist
$requiredFiles = @(
    "server.js",
    "package.json", 
    "public/divisions.html",
    "OakDragonCovenant/Modules/covenantDivisionRegistry.js",
    "routes/divisions.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file - Found" -ForegroundColor Green
    } else {
        Write-Host "✗ $file - Missing!" -ForegroundColor Red
        exit 1
    }
}

# Phase 3: Railway Deployment
Write-Host ""
Write-Host "Phase 3: Railway Deployment (API Backend)" -ForegroundColor Green
Write-Host "Deploying main API and backend services..." -ForegroundColor White

try {
    # Check if logged in to Railway
    railway status 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Please login to Railway first:" -ForegroundColor Yellow
        Write-Host "railway login" -ForegroundColor Cyan
        Read-Host "Press Enter after logging in to Railway"
    }

    # Initialize Railway project if needed
    if (-not (Test-Path ".railway")) {
        Write-Host "Initializing Railway project..." -ForegroundColor Yellow
        railway init --name "oak-dragon-covenant"
    }

    # Set environment variables
    Write-Host "Setting Railway environment variables..." -ForegroundColor Yellow
    railway variables set NODE_ENV=production
    railway variables set PORT=3000
    railway variables set DOMAIN=oakdragoncovenant.com
    railway variables set CLOUD_PROVIDER=railway

    # Deploy to Railway
    Write-Host "Deploying to Railway..." -ForegroundColor Yellow
    railway up --detach

    Write-Host "✓ Railway deployment initiated!" -ForegroundColor Green
    Write-Host "Configure custom domains at: https://railway.app" -ForegroundColor Cyan
    Write-Host "   Add: oakdragoncovenant.com, api.oakdragoncovenant.com" -ForegroundColor White

} catch {
    Write-Host "✗ Railway deployment failed" -ForegroundColor Red
    Write-Host "Manual steps:" -ForegroundColor Yellow
    Write-Host "1. railway login" -ForegroundColor White
    Write-Host "2. railway init" -ForegroundColor White
    Write-Host "3. railway up" -ForegroundColor White
}

# Phase 4: Vercel Deployment
Write-Host ""
Write-Host "Phase 4: Vercel Deployment (Frontend/Dashboard)" -ForegroundColor Green
Write-Host "Deploying dashboard and frontend services..." -ForegroundColor White

try {
    # Check Vercel login
    vercel whoami 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Please login to Vercel first:" -ForegroundColor Yellow
        Write-Host "vercel login" -ForegroundColor Cyan
        Read-Host "Press Enter after logging in to Vercel"
    }

    # Deploy to Vercel
    Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod --yes

    Write-Host "✓ Vercel deployment completed!" -ForegroundColor Green
    Write-Host "Configure custom domains at: https://vercel.com" -ForegroundColor Cyan
    Write-Host "   Add: dashboard.oakdragoncovenant.com, divisions.oakdragoncovenant.com" -ForegroundColor White

} catch {
    Write-Host "✗ Vercel deployment failed" -ForegroundColor Red
    Write-Host "Manual steps:" -ForegroundColor Yellow
    Write-Host "1. vercel login" -ForegroundColor White
    Write-Host "2. vercel --prod" -ForegroundColor White
}

# Phase 5: DNS Configuration Guide
Write-Host ""
Write-Host "Phase 5: DNS Configuration Required" -ForegroundColor Green
Write-Host "Please configure these DNS records in IONOS:" -ForegroundColor White

Write-Host ""
Write-Host "A Records:" -ForegroundColor Yellow
Write-Host "@                    -> [Railway IP]" -ForegroundColor White
Write-Host "www                  -> [Railway IP]" -ForegroundColor White

Write-Host ""
Write-Host "CNAME Records:" -ForegroundColor Yellow
Write-Host "api                  -> [your-railway-domain].railway.app" -ForegroundColor White
Write-Host "dashboard            -> [your-vercel-project].vercel.app" -ForegroundColor White
Write-Host "divisions            -> [your-vercel-project].vercel.app" -ForegroundColor White
Write-Host "command              -> [your-vercel-project].vercel.app" -ForegroundColor White
Write-Host "portal               -> [your-vercel-project].vercel.app" -ForegroundColor White
Write-Host "monitor              -> [your-railway-domain].railway.app" -ForegroundColor White

Write-Host ""
Write-Host "Get your deployment URLs from:" -ForegroundColor Cyan
Write-Host "Railway: https://railway.app (your project dashboard)" -ForegroundColor White
Write-Host "Vercel: https://vercel.com (your project dashboard)" -ForegroundColor White

# Phase 6: Render Setup Guide
Write-Host ""
Write-Host "Phase 6: Render Setup (Trading Dashboard)" -ForegroundColor Green
Write-Host "Manual Render setup required:" -ForegroundColor White
Write-Host "1. Go to https://render.com" -ForegroundColor Yellow
Write-Host "2. Connect your GitHub repository" -ForegroundColor Yellow
Write-Host "3. Create Web Service with these settings:" -ForegroundColor Yellow
Write-Host "   Name: oak-dragon-covenant-trading" -ForegroundColor White
Write-Host "   Build: npm install" -ForegroundColor White
Write-Host "   Start: npm start" -ForegroundColor White
Write-Host "   Environment: NODE_ENV=production" -ForegroundColor White
Write-Host "4. Add custom domain: trading.oakdragoncovenant.com" -ForegroundColor Yellow

# Phase 7: Verification
Write-Host ""
Write-Host "Phase 7: Deployment Verification" -ForegroundColor Green
Write-Host "Testing local server functionality..." -ForegroundColor White

# Test local server briefly
Write-Host "Starting local test server..." -ForegroundColor Yellow
$process = Start-Process -FilePath "node" -ArgumentList "server.js" -NoNewWindow -PassThru

Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/divisions/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Local API responding correctly" -ForegroundColor Green
    }
} catch {
    Write-Host "! Local API test failed - may need dependencies" -ForegroundColor Yellow
}

# Stop test server
Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue

# Phase 8: Final Instructions
Write-Host ""
Write-Host "Deployment Summary" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Completed:" -ForegroundColor Green
Write-Host "• Railway deployment initiated" -ForegroundColor White
Write-Host "• Vercel deployment completed" -ForegroundColor White
Write-Host "• Project files verified" -ForegroundColor White
Write-Host "• Local functionality tested" -ForegroundColor White

Write-Host ""
Write-Host "Manual Steps Required:" -ForegroundColor Yellow
Write-Host "1. Configure DNS records in IONOS (see above)" -ForegroundColor White
Write-Host "2. Set up Render service for trading dashboard" -ForegroundColor White
Write-Host "3. Add custom domains in Railway and Vercel dashboards" -ForegroundColor White
Write-Host "4. Wait for DNS propagation (5-60 minutes)" -ForegroundColor White

Write-Host ""
Write-Host "Quick Links:" -ForegroundColor Cyan
Write-Host "IONOS DNS: https://ionos.com" -ForegroundColor White
Write-Host "Railway: https://railway.app" -ForegroundColor White  
Write-Host "Vercel: https://vercel.com" -ForegroundColor White
Write-Host "Render: https://render.com" -ForegroundColor White

Write-Host ""
Write-Host "Test URLs (after DNS propagation):" -ForegroundColor Cyan
Write-Host "Main: https://oakdragoncovenant.com" -ForegroundColor White
Write-Host "API: https://api.oakdragoncovenant.com/health" -ForegroundColor White
Write-Host "Divisions: https://divisions.oakdragoncovenant.com" -ForegroundColor White
Write-Host "Dashboard: https://dashboard.oakdragoncovenant.com" -ForegroundColor White

Write-Host ""
Write-Host "Oak Dragon Covenant deployment process complete!" -ForegroundColor Green
Write-Host "Your covenant will be fully operational once DNS propagates!" -ForegroundColor Yellow

Read-Host "Press Enter to exit"
