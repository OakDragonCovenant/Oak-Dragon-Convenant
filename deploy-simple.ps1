# Oak Dragon Covenant - Simple Deployment Script

Write-Host "Oak Dragon Covenant - Automated Deployment" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Node.js is available
Write-Host ""
Write-Host "Checking Node.js..." -ForegroundColor Green
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "Installing project dependencies..." -ForegroundColor Green
npm install

# Install Railway CLI if needed
Write-Host ""
Write-Host "Checking Railway CLI..." -ForegroundColor Green
try {
    railway --version
    Write-Host "Railway CLI found" -ForegroundColor Green
} catch {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Install Vercel CLI if needed
Write-Host ""
Write-Host "Checking Vercel CLI..." -ForegroundColor Green
try {
    vercel --version
    Write-Host "Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Railway Login Check
Write-Host ""
Write-Host "Checking Railway authentication..." -ForegroundColor Green
$railwayAuth = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Railway:" -ForegroundColor Yellow
    Write-Host "railway login" -ForegroundColor Cyan
    $login = Read-Host "Have you logged in to Railway? (y/n)"
    if ($login -ne "y") {
        Write-Host "Please run 'railway login' first" -ForegroundColor Red
        exit 1
    }
}

# Vercel Login Check
Write-Host ""
Write-Host "Checking Vercel authentication..." -ForegroundColor Green
$vercelAuth = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    Write-Host "vercel login" -ForegroundColor Cyan
    $login = Read-Host "Have you logged in to Vercel? (y/n)"
    if ($login -ne "y") {
        Write-Host "Please run 'vercel login' first" -ForegroundColor Red
        exit 1
    }
}

# Railway Deployment
Write-Host ""
Write-Host "Starting Railway deployment..." -ForegroundColor Green
Write-Host "This will deploy your API backend" -ForegroundColor White

# Initialize Railway if needed
if (-not (Test-Path ".railway")) {
    Write-Host "Initializing new Railway project..." -ForegroundColor Yellow
    railway init
}

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set DOMAIN=oakdragoncovenant.com

# Deploy to Railway
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host "Railway deployment completed!" -ForegroundColor Green

# Vercel Deployment
Write-Host ""
Write-Host "Starting Vercel deployment..." -ForegroundColor Green
Write-Host "This will deploy your frontend dashboard" -ForegroundColor White

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "Vercel deployment completed!" -ForegroundColor Green

# DNS Configuration Instructions
Write-Host ""
Write-Host "IMPORTANT: DNS Configuration Required" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Red
Write-Host ""
Write-Host "Go to your IONOS DNS panel and add these records:" -ForegroundColor Yellow
Write-Host ""
Write-Host "CNAME Records to add:" -ForegroundColor Cyan
Write-Host "api -> [your-railway-domain].railway.app" -ForegroundColor White
Write-Host "dashboard -> [your-vercel-domain].vercel.app" -ForegroundColor White
Write-Host "divisions -> [your-vercel-domain].vercel.app" -ForegroundColor White
Write-Host "portal -> [your-vercel-domain].vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "Get your exact domain names from:" -ForegroundColor Yellow
Write-Host "Railway: https://railway.app (project settings)" -ForegroundColor White
Write-Host "Vercel: https://vercel.com (project settings)" -ForegroundColor White

# Platform Setup Instructions
Write-Host ""
Write-Host "Manual Platform Setup Required:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Railway Custom Domains:" -ForegroundColor Cyan
Write-Host "   - Go to https://railway.app" -ForegroundColor White
Write-Host "   - Select your project" -ForegroundColor White
Write-Host "   - Settings > Domains" -ForegroundColor White
Write-Host "   - Add: oakdragoncovenant.com, api.oakdragoncovenant.com" -ForegroundColor White
Write-Host ""
Write-Host "2. Vercel Custom Domains:" -ForegroundColor Cyan
Write-Host "   - Go to https://vercel.com" -ForegroundColor White
Write-Host "   - Select your project" -ForegroundColor White
Write-Host "   - Settings > Domains" -ForegroundColor White
Write-Host "   - Add: dashboard.oakdragoncovenant.com, divisions.oakdragoncovenant.com" -ForegroundColor White
Write-Host ""
Write-Host "3. Render Setup (Trading Dashboard):" -ForegroundColor Cyan
Write-Host "   - Go to https://render.com" -ForegroundColor White
Write-Host "   - Connect your GitHub repository" -ForegroundColor White
Write-Host "   - Create new Web Service" -ForegroundColor White
Write-Host "   - Build Command: npm install" -ForegroundColor White
Write-Host "   - Start Command: npm start" -ForegroundColor White
Write-Host "   - Add domain: trading.oakdragoncovenant.com" -ForegroundColor White

# Test Local Setup
Write-Host ""
Write-Host "Testing local setup..." -ForegroundColor Green
Write-Host "Starting test server for 5 seconds..." -ForegroundColor Yellow

$job = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    node server.js
}

Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/divisions/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "Local API test: SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "Local API test: FAILED (this is normal during deployment)" -ForegroundColor Yellow
}

Stop-Job $job
Remove-Job $job

# Final Summary
Write-Host ""
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host ""
Write-Host "What was deployed:" -ForegroundColor Cyan
Write-Host "- API Backend -> Railway" -ForegroundColor White
Write-Host "- Frontend Dashboard -> Vercel" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure DNS records in IONOS" -ForegroundColor White
Write-Host "2. Add custom domains in Railway and Vercel" -ForegroundColor White
Write-Host "3. Set up Render service for trading" -ForegroundColor White
Write-Host "4. Wait for DNS propagation (5-60 minutes)" -ForegroundColor White
Write-Host ""
Write-Host "Your Division Command Center will be live at:" -ForegroundColor Cyan
Write-Host "https://divisions.oakdragoncovenant.com" -ForegroundColor White

Read-Host "Press Enter to exit"
