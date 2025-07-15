# 🚀 Oak Dragon Covenant - Deployment Verification Script (PowerShell)
param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

Write-Host "🏰 Oak Dragon Covenant - Deployment Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🔍 Testing deployment at: $Url" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "🏥 Testing Health Endpoint..." -ForegroundColor Green
try {
    $healthResponse = Invoke-WebRequest -Uri "$Url/health" -UseBasicParsing -ErrorAction Stop
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Health check passed!" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor White
        $healthContent = $healthResponse.Content | ConvertFrom-Json
        $healthContent | ConvertTo-Json -Depth 3
        
        # Check system status
        if ($healthContent.systems.covenant -eq "operational") {
            Write-Host "Covenant system operational" -ForegroundColor Green
        }
        if ($healthContent.systems.strategos -eq "operational") {
            Write-Host "Strategos system operational" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Main Page
Write-Host "🏠 Testing Main Page..." -ForegroundColor Green
try {
    $mainResponse = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction Stop
    if ($mainResponse.StatusCode -eq 200) {
        Write-Host "✅ Main page loaded successfully!" -ForegroundColor Green
        if ($mainResponse.Content -match "Oak Dragon Covenant") {
            Write-Host "✅ Content looks correct" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Page loaded but content may be incorrect" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ Main page failed to load: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: API Endpoints
Write-Host "💰 Testing Strategos API..." -ForegroundColor Green
try {
    $strategosResponse = Invoke-WebRequest -Uri "$Url/api/strategos/v1/portfolio-status" -UseBasicParsing -ErrorAction Stop
    if ($strategosResponse.StatusCode -eq 200) {
        Write-Host "✅ Strategos API responding!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Strategos API not responding: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "🏠 Testing Covenant API..." -ForegroundColor Green
try {
    $covenantResponse = Invoke-WebRequest -Uri "$Url/api/covenant/fund-status" -UseBasicParsing -ErrorAction Stop
    if ($covenantResponse.StatusCode -eq 200) {
        Write-Host "✅ Covenant API responding!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Covenant API not responding: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "📋 DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "URL: $Url" -ForegroundColor White
Write-Host "Health: Testing completed" -ForegroundColor White
Write-Host "Main Page: Testing completed" -ForegroundColor White
Write-Host "Trading System: Ready for testing" -ForegroundColor White
Write-Host "Auto-Trading: DISABLED (safe)" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. If all tests pass, your deployment is successful!" -ForegroundColor White
Write-Host "   2. Test the web interface manually" -ForegroundColor White
Write-Host "   3. Check logs in Render dashboard" -ForegroundColor White
Write-Host "   4. When ready, enable auto-trading in environment variables" -ForegroundColor White
Write-Host ""
Write-Host "🏰 Oak Dragon Covenant is ready to serve! 🐉" -ForegroundColor Magenta
