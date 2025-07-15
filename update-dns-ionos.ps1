# IONOS DNS Update Instructions for DigitalOcean
# Your DigitalOcean Droplet IP: 137.184.77.5

Write-Host "🌐 IONOS DNS Configuration for DigitalOcean" -ForegroundColor Cyan
Write-Host "Domain: oakdragoncovenant.com" -ForegroundColor Green
Write-Host "New IP: 137.184.77.5" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "`n📋 DNS Records to Update in IONOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Login to IONOS Control Panel:" -ForegroundColor Cyan
Write-Host "   https://my.ionos.com/domain-dns-settings/oakdragoncovenant.com" -ForegroundColor White
Write-Host ""
Write-Host "2. Update these A Records:" -ForegroundColor Cyan
Write-Host "   @ (root)     ->  137.184.77.5" -ForegroundColor White
Write-Host "   www          ->  137.184.77.5" -ForegroundColor White
Write-Host "   dashboard    ->  137.184.77.5" -ForegroundColor White
Write-Host "   api          ->  137.184.77.5" -ForegroundColor White
Write-Host "   trading      ->  137.184.77.5" -ForegroundColor White
Write-Host "   command      ->  137.184.77.5" -ForegroundColor White
Write-Host ""
Write-Host "3. DNS Propagation:" -ForegroundColor Yellow
Write-Host "   - Changes take 5-30 minutes to propagate" -ForegroundColor White
Write-Host "   - Your site will be live at: https://oakdragoncovenant.com" -ForegroundColor White
Write-Host ""

# Check current DNS
Write-Host "🔍 Current DNS Status:" -ForegroundColor Cyan
Write-Host "Checking current DNS resolution..." -ForegroundColor Gray
nslookup oakdragoncovenant.com

Write-Host "`n⏱️ After updating DNS, test with:" -ForegroundColor Yellow
Write-Host "   nslookup oakdragoncovenant.com" -ForegroundColor White
Write-Host "   Should show: 137.184.77.5" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your sites will be available at:" -ForegroundColor Cyan
Write-Host "   https://oakdragoncovenant.com" -ForegroundColor White
Write-Host "   https://dashboard.oakdragoncovenant.com" -ForegroundColor White
Write-Host "   https://api.oakdragoncovenant.com" -ForegroundColor White
Write-Host "   https://trading.oakdragoncovenant.com" -ForegroundColor White
