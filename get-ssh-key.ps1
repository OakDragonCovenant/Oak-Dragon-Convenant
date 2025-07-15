# Get SSH Public Key for DigitalOcean
Write-Host "Your SSH Public Key (copy this entire line):" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
$key = Get-Content "$env:USERPROFILE\.ssh\id_oak_dragon.pub" -Raw
$key = $key.Trim()
Write-Host $key -ForegroundColor Green
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Copy the green text above (the entire line starting with 'ssh-ed25519')" -ForegroundColor White
Write-Host "2. Go to DigitalOcean: Account > Settings > Security" -ForegroundColor White
Write-Host "3. Click 'Add SSH Key'" -ForegroundColor White
Write-Host "4. Paste the key and name it 'Oak Dragon Covenant Key'" -ForegroundColor White
Write-Host "5. Click 'Add SSH Key'" -ForegroundColor White
