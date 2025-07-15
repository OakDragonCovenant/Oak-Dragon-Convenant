# Fix SSH Access to DigitalOcean Droplet
# This script helps add SSH key to existing droplet

param(
    [Parameter(Mandatory=$true)]
    [string]$DropletIP = "137.184.77.5"
)

Write-Host "SSH Access Fix for Oak Dragon Covenant Droplet" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "CURRENT SITUATION:" -ForegroundColor Yellow
Write-Host "- Droplet is running and reachable at: $DropletIP" -ForegroundColor Green
Write-Host "- SSH service is active on port 22" -ForegroundColor Green
Write-Host "- SSH key exists but not authorized on droplet" -ForegroundColor Red

Write-Host ""
Write-Host "YOUR SSH PUBLIC KEY:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
$publicKey = Get-Content "$env:USERPROFILE\.ssh\id_oak_dragon.pub"
Write-Host $publicKey -ForegroundColor White

Write-Host ""
Write-Host "SOLUTION OPTIONS:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow

Write-Host ""
Write-Host "OPTION 1: Add SSH Key via DigitalOcean Dashboard (RECOMMENDED)" -ForegroundColor Green
Write-Host "--------------------------------------------------------------" -ForegroundColor Green
Write-Host "1. Go to: https://cloud.digitalocean.com" -ForegroundColor White
Write-Host "2. Navigate to: Account → Settings → Security → SSH Keys" -ForegroundColor White
Write-Host "3. Click 'Add SSH Key'" -ForegroundColor White
Write-Host "4. Paste the key shown above" -ForegroundColor White
Write-Host "5. Name it: 'Oak Dragon Covenant Key'" -ForegroundColor White
Write-Host "6. Click 'Add SSH Key'" -ForegroundColor White
Write-Host "7. Go to your droplet → Settings → Add SSH Keys" -ForegroundColor White
Write-Host "8. Select your new SSH key and add it" -ForegroundColor White

Write-Host ""
Write-Host "OPTION 2: Use DigitalOcean Console (ALTERNATIVE)" -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor Yellow
Write-Host "1. Go to your droplet in DigitalOcean dashboard" -ForegroundColor White
Write-Host "2. Click 'Console' to open web terminal" -ForegroundColor White
Write-Host "3. Login as root (if possible)" -ForegroundColor White
Write-Host "4. Run these commands:" -ForegroundColor White
Write-Host "   mkdir -p ~/.ssh" -ForegroundColor Gray
Write-Host "   echo '$publicKey' >> ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host "   chmod 700 ~/.ssh" -ForegroundColor Gray
Write-Host "   chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Gray

Write-Host ""
Write-Host "OPTION 3: Rebuild Droplet with SSH Key" -ForegroundColor Yellow
Write-Host "-------------------------------------" -ForegroundColor Yellow
Write-Host "1. First add SSH key to your account (Option 1, steps 1-6)" -ForegroundColor White
Write-Host "2. Go to your droplet → More → Rebuild" -ForegroundColor White
Write-Host "3. Choose Ubuntu 22.04 LTS" -ForegroundColor White
Write-Host "4. SELECT your SSH key during rebuild" -ForegroundColor White
Write-Host "5. Confirm rebuild" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  WARNING: Rebuild will erase all data on droplet!" -ForegroundColor Red

Write-Host ""
Write-Host "TEST CONNECTION AFTER FIXING:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "Run this command to test:" -ForegroundColor White
Write-Host "ssh -o StrictHostKeyChecking=no -i `"$env:USERPROFILE\.ssh\id_oak_dragon`" root@$DropletIP `"echo 'SSH access fixed!'`"" -ForegroundColor Gray

Write-Host ""
Write-Host "THEN CONTINUE DEPLOYMENT:" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ".\deploy-digitalocean.ps1 -Phase 2 -DropletIP $DropletIP" -ForegroundColor Gray

Write-Host ""
Write-Host "Need help? The droplet console shows you're definitely connected to the right server!" -ForegroundColor Yellow
