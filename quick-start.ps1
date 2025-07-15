# Oak Dragon Covenant - Quick Start Script (PowerShell)
# Runs the landing page immediately for testing

Write-Host "Oak Dragon Covenant - Quick Start" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "package.json not found. Please run from project root." -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Blue
    npm install --silent
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Create minimal .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating environment file..." -ForegroundColor Blue
    $envContent = @"
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-key-not-for-production-use-only
LOG_LEVEL=debug
"@
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "Environment file created" -ForegroundColor Green
}

# Start the server
Write-Host "Starting Oak Dragon Covenant..." -ForegroundColor Blue
Write-Host ""
Write-Host "Landing Page: http://localhost:3000" -ForegroundColor Yellow
Write-Host "API Status:   http://localhost:3000/api" -ForegroundColor Yellow
Write-Host "Health Check: http://localhost:3000/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Cyan
Write-Host "  Username: demo      | Password: demo123" -ForegroundColor Gray
Write-Host "  Username: admin     | Password: OakDragon2025!" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start server in development mode
$env:NODE_ENV = "development"
node server.js
