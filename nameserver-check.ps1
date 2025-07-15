# IONOS Nameserver Configuration Guide
# Domain: oakdragoncovenant.com

Write-Host "🌐 IONOS Nameserver Configuration" -ForegroundColor Cyan
Write-Host "Domain: oakdragoncovenant.com" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

# Check current nameservers
Write-Host "`n🔍 Current Nameservers:" -ForegroundColor Yellow
Write-Host "Checking current nameserver configuration..." -ForegroundColor Gray
nslookup -type=NS oakdragoncovenant.com

Write-Host "`n📋 IONOS Nameservers (if using IONOS DNS):" -ForegroundColor Cyan
Write-Host "Primary DNS:   ns1.ionos.com" -ForegroundColor White
Write-Host "Secondary DNS: ns2.ionos.com" -ForegroundColor White
Write-Host "Alternative:   ns1081.ui-dns.com" -ForegroundColor White
Write-Host "Alternative:   ns1081.ui-dns.de" -ForegroundColor White
Write-Host "Alternative:   ns1081.ui-dns.biz" -ForegroundColor White
Write-Host "Alternative:   ns1081.ui-dns.org" -ForegroundColor White

Write-Host "`n⚠️  Current Status Analysis:" -ForegroundColor Yellow
Write-Host "Your domain is using NSOne nameservers (dns1-4.p08.nsone.net)" -ForegroundColor Red
Write-Host "This means DNS is NOT managed by IONOS!" -ForegroundColor Red

Write-Host "`n🔧 Two Options to Fix DNS:" -ForegroundColor Cyan

Write-Host "`nOption 1: Switch to IONOS Nameservers" -ForegroundColor Yellow
Write-Host "1. Login to your domain registrar" -ForegroundColor White
Write-Host "2. Change nameservers to:" -ForegroundColor White
Write-Host "   - ns1.ionos.com" -ForegroundColor Green
Write-Host "   - ns2.ionos.com" -ForegroundColor Green
Write-Host "3. Then manage DNS records in IONOS panel" -ForegroundColor White

Write-Host "`nOption 2: Update NSOne DNS Records" -ForegroundColor Yellow
Write-Host "1. Login to NSOne DNS management" -ForegroundColor White
Write-Host "2. Update A records to point to: 137.184.77.5" -ForegroundColor Green
Write-Host "3. Keep current nameserver setup" -ForegroundColor White

Write-Host "`n🎯 Recommended Action:" -ForegroundColor Cyan
Write-Host "Since you have IONOS hosting, use Option 1:" -ForegroundColor White
Write-Host "1. Change nameservers to IONOS" -ForegroundColor Green
Write-Host "2. Manage all DNS in IONOS panel" -ForegroundColor Green
Write-Host "3. Point A records to: 137.184.77.5" -ForegroundColor Green

Write-Host "`n📞 Where to make changes:" -ForegroundColor Yellow
Write-Host "- Domain registrar: Change nameservers" -ForegroundColor White
Write-Host "- IONOS panel: Manage DNS records" -ForegroundColor White
Write-Host "- URL: https://my.ionos.com" -ForegroundColor White
