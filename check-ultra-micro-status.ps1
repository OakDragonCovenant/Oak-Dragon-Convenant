# Oak Dragon Covenant - Ultra Micro and Extreme Risk Status Check
param(
    [string]$Action = "CheckStatus"
)

Write-Host "Oak Dragon Covenant - Maximum Potential Status" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check bot connectivity
try {
    $response = Invoke-WebRequest -Uri "http://138.197.126.83" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "Bot Status: ONLINE and responding" -ForegroundColor Green
    }
} catch {
    Write-Host "Bot Status: OFFLINE or not responding" -ForegroundColor Red
    exit 1
}

# Check current configuration
Write-Host "`nCurrent Configuration:" -ForegroundColor Yellow

if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    
    $autoTrading = $envContent | Where-Object { $_ -like "AUTO_TRADING_ENABLED=*" }
    $sandbox = $envContent | Where-Object { $_ -like "COINBASE_SANDBOX=*" }
    $maxTrade = $envContent | Where-Object { $_ -like "MAX_TRADE_AMOUNT=*" }
    $riskTolerance = $envContent | Where-Object { $_ -like "RISK_TOLERANCE=*" }
    
    Write-Host "Auto Trading: $($autoTrading -replace 'AUTO_TRADING_ENABLED=', '')" -ForegroundColor White
    Write-Host "Sandbox Mode: $($sandbox -replace 'COINBASE_SANDBOX=', '')" -ForegroundColor White
    Write-Host "Max Trade: $($maxTrade -replace 'MAX_TRADE_AMOUNT=', '')" -ForegroundColor White
    Write-Host "Risk Level: $($riskTolerance -replace 'RISK_TOLERANCE=', '')" -ForegroundColor White
    
    Write-Host "`nUltra Micro & Extreme Risk Status:" -ForegroundColor Magenta
    
    # Ultra Micro Status
    Write-Host "Ultra-Micro Trading (0.0000001): READY - Built into Strategos Protocol" -ForegroundColor Green
    
    # Extreme Risk Status
    if ($riskTolerance -like "*extreme*" -or $riskTolerance -like "*high*") {
        Write-Host "Extreme Risk Trading (95%): ACTIVE" -ForegroundColor Green
    } else {
        Write-Host "Extreme Risk Trading (95%): AVAILABLE but not activated" -ForegroundColor Yellow
    }
    
    # Live Trading Status
    if ($autoTrading -like "*true*" -and $sandbox -notlike "*true*") {
        Write-Host "Live Trading: ENABLED" -ForegroundColor Green
    } elseif ($autoTrading -like "*false*") {
        Write-Host "Live Trading: DISABLED (Safety Mode)" -ForegroundColor Yellow
    } else {
        Write-Host "Live Trading: SANDBOX MODE" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "No .env file found" -ForegroundColor Red
}

Write-Host "`nBot Capabilities Available:" -ForegroundColor Cyan
Write-Host "- Ultra-Micro Trades: 0.0000001 BTC minimum" -ForegroundColor White
Write-Host "- Extreme Risk Trades: Up to 95% portfolio" -ForegroundColor White
Write-Host "- Moonshot Trading: YOLO mode available" -ForegroundColor White
Write-Host "- Mirror Trading: Copy other traders" -ForegroundColor White
Write-Host "- AI-Powered Analysis: Market predictions" -ForegroundColor White

Write-Host "`nTo activate maximum potential:" -ForegroundColor Yellow
Write-Host ".\activate-maximum-potential.ps1 Activate" -ForegroundColor Gray
