# Quick deployment script - ready to run with your IP
param([string]$IP)

if (-not $IP) {
    Write-Host "Usage: .\quick-deploy.ps1 YOUR_DROPLET_IP" -ForegroundColor Yellow
    Write-Host "Example: .\quick-deploy.ps1 134.122.45.67" -ForegroundColor Cyan
    exit 1
}

Write-Host "🚀 Deploying Oak Dragon Covenant to: $IP" -ForegroundColor Green
Write-Host "This will take about 5-10 minutes..." -ForegroundColor Yellow

# Run Phase 2 (Server Setup)
Write-Host "`n=== PHASE 2: Server Setup ===" -ForegroundColor Cyan
.\deploy-digitalocean.ps1 -Phase 2 -DropletIP $IP

if ($LASTEXITCODE -eq 0) {
    # Run Phase 3 (Application Deployment)
    Write-Host "`n=== PHASE 3: Application Deployment ===" -ForegroundColor Cyan
    .\deploy-digitalocean.ps1 -Phase 3 -DropletIP $IP
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
        Write-Host "Your Oak Dragon Covenant is live at: http://$IP" -ForegroundColor Cyan
        Write-Host "Dashboard: http://$IP/dashboard" -ForegroundColor White
        Write-Host "Trading Budget: $8.88 USDT ready to go!" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Server setup failed. Please check the error above." -ForegroundColor Red
}
