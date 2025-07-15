# PuTTY Configuration Guide for Oak Dragon Covenant
# DigitalOcean Deployment Setup

Write-Host "PuTTY Configuration for Oak Dragon Covenant" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. CONVERT SSH KEY FOR PUTTY:" -ForegroundColor Yellow
Write-Host "   - PuTTY uses .ppk format, not OpenSSH format" -ForegroundColor White
Write-Host "   - You need to convert your SSH key using PuTTYgen" -ForegroundColor White
Write-Host ""

Write-Host "2. STEPS TO CONVERT YOUR SSH KEY:" -ForegroundColor Yellow
Write-Host "   a) Open PuTTYgen (should be installed with PuTTY)" -ForegroundColor White
Write-Host "   b) Click 'Load' and browse to: $env:USERPROFILE\.ssh\id_oak_dragon" -ForegroundColor White
Write-Host "   c) Change file type to 'All Files' to see the private key" -ForegroundColor White
Write-Host "   d) Select 'id_oak_dragon' (NOT the .pub file)" -ForegroundColor White
Write-Host "   e) Click 'Save private key' and save as 'oak_dragon_key.ppk'" -ForegroundColor White
Write-Host ""

Write-Host "3. PUTTY SESSION CONFIGURATION:" -ForegroundColor Yellow
Write-Host "   - Host Name: YOUR_DROPLET_IP (get this after creating droplet)" -ForegroundColor White
Write-Host "   - Port: 22" -ForegroundColor White
Write-Host "   - Connection Type: SSH" -ForegroundColor White
Write-Host "   - Go to Connection > SSH > Auth > Credentials" -ForegroundColor White
Write-Host "   - Browse and select your oak_dragon_key.ppk file" -ForegroundColor White
Write-Host "   - Go back to Session and save as 'Oak Dragon Server'" -ForegroundColor White
Write-Host ""

Write-Host "4. YOUR SSH PUBLIC KEY (for DigitalOcean):" -ForegroundColor Yellow
Get-Content "$env:USERPROFILE\.ssh\id_oak_dragon.pub" -Raw
Write-Host ""

Write-Host "5. NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   - Add the SSH key above to DigitalOcean" -ForegroundColor White
Write-Host "   - Create your droplet" -ForegroundColor White
Write-Host "   - Configure PuTTY with the droplet IP" -ForegroundColor White
Write-Host "   - Continue with Phase 2 deployment" -ForegroundColor White
