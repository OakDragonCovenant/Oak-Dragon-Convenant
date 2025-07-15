# Quick DigitalOcean API Test
param([string]$ApiKey)

$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Content-Type" = "application/json"
}

try {
    Write-Host "Testing DigitalOcean API..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/account" -Headers $headers
    
    Write-Host "Success: API Key Valid!" -ForegroundColor Green
    Write-Host "Account: $($response.account.email)" -ForegroundColor White
    Write-Host "Status: $($response.account.status)" -ForegroundColor White
    Write-Host "Droplet Limit: $($response.account.droplet_limit)" -ForegroundColor White
    
    # Test droplets endpoint
    $droplets = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/droplets" -Headers $headers
    Write-Host "Current Droplets: $($droplets.droplets.Count)" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Ready for automated deployment!" -ForegroundColor Green
    
} catch {
    Write-Host "Error: API Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}
