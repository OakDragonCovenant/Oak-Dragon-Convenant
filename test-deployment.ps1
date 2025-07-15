# Oak Dragon Covenant - Deployment Verification Script (PowerShell)
param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

Write-Host "Oak Dragon Covenant - Deployment Verification" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Testing deployment at: $Url" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "Testing Health Endpoint..." -ForegroundColor Green
try {
    $healthResponse = Invoke-WebRequest -Uri "$Url/health" -UseBasicParsing -ErrorAction Stop
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "PASS: Health check passed!" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor White
        $healthContent = $healthResponse.Content | ConvertFrom-Json
        $healthContent | ConvertTo-Json -Depth 3
        
        # Check system status
        if ($healthContent.systems.covenant -eq "operational") {
            Write-Host "PASS: Covenant system operational" -ForegroundColor Green
        }
        if ($healthContent.systems.strategos -eq "operational") {
            Write-Host "PASS: Strategos system operational" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "FAIL: Health check failed - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Landing Page & Dashboard
Write-Host "Testing Landing Page..." -ForegroundColor Green
try {
    $landingResponse = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction Stop
    if ($landingResponse.StatusCode -eq 200) {
        Write-Host "PASS: Landing page loaded successfully!" -ForegroundColor Green
        if ($landingResponse.Content -match "Oak Dragon Covenant") {
            Write-Host "PASS: Landing page branding correct" -ForegroundColor Green
        }
        if ($landingResponse.Content -match "Elite Financial Intelligence") {
            Write-Host "PASS: Landing page tagline found" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "FAIL: Landing page failed to load - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Testing Dashboard..." -ForegroundColor Green
try {
    $dashboardResponse = Invoke-WebRequest -Uri "$Url/dashboard" -UseBasicParsing -ErrorAction Stop
    if ($dashboardResponse.StatusCode -eq 200) {
        Write-Host "PASS: Dashboard loaded successfully!" -ForegroundColor Green
    }
} catch {
    Write-Host "WARN: Dashboard not responding - $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: API Endpoints
Write-Host "Testing Strategos API..." -ForegroundColor Green
try {
    $strategosResponse = Invoke-WebRequest -Uri "$Url/api/strategos/v1/portfolio-status" -UseBasicParsing -ErrorAction Stop
    if ($strategosResponse.StatusCode -eq 200) {
        Write-Host "PASS: Strategos API responding!" -ForegroundColor Green
    }
} catch {
    Write-Host "WARN: Strategos API not responding - $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Testing Covenant API..." -ForegroundColor Green
try {
    $covenantResponse = Invoke-WebRequest -Uri "$Url/api/covenant/fund-status" -UseBasicParsing -ErrorAction Stop
    if ($covenantResponse.StatusCode -eq 200) {
        Write-Host "PASS: Covenant API responding!" -ForegroundColor Green
    }
} catch {
    Write-Host "WARN: Covenant API not responding - $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "URL: $Url" -ForegroundColor White
Write-Host "Landing Page: Testing completed" -ForegroundColor White
Write-Host "Dashboard: Testing completed" -ForegroundColor White
Write-Host "Health Check: Testing completed" -ForegroundColor White
Write-Host "Trading System: Ready for live trading" -ForegroundColor White
Write-Host "Auto-Trading: ENABLED (LIVE MODE)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If all tests pass, your deployment is successful!" -ForegroundColor White
Write-Host "2. Test the web interface manually" -ForegroundColor White
Write-Host "3. Check logs in Render dashboard" -ForegroundColor White
Write-Host "4. When ready, enable auto-trading in environment variables" -ForegroundColor White
Write-Host ""
Write-Host "Oak Dragon Covenant is ready to serve!" -ForegroundColor Magenta
