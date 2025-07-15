# Oak Dragon Covenant - Automated Deployment
param([string]$DOApiKey)

if (-not $DOApiKey) {
    Write-Host "Usage: .\auto-deploy.ps1 -DOApiKey YOUR_API_KEY" -ForegroundColor Yellow
    exit 1
}

Write-Host "Oak Dragon Covenant - Automated Deployment" -ForegroundColor Cyan
Write-Host "Budget: $15.99 hosting, $8.88 trading" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

# Test API
$headers = @{ "Authorization" = "Bearer $DOApiKey"; "Content-Type" = "application/json" }
try {
    $account = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/account" -Headers $headers
    Write-Host "Connected to: $($account.account.email)" -ForegroundColor Green
} catch {
    Write-Host "API key invalid" -ForegroundColor Red; exit 1
}

# Setup SSH
$keyPath = "$env:USERPROFILE\.ssh\id_oak_dragon"
if (-not (Test-Path "$keyPath.pub")) {
    Write-Host "Generating SSH key..." -ForegroundColor Yellow
    ssh-keygen -t ed25519 -f $keyPath -N '""' -C "oak-dragon"
}

# Upload SSH key
Write-Host "Managing SSH key..." -ForegroundColor Yellow
$publicKey = (Get-Content "$keyPath.pub" -Raw).Trim()
$keys = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/account/keys" -Headers $headers
$existing = $keys.ssh_keys | Where-Object { $_.name -eq "oak-dragon" }

if ($existing) {
    $keyId = $existing.id
} else {
    $keyData = @{ name="oak-dragon"; public_key=$publicKey } | ConvertTo-Json
    $keyResult = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/account/keys" -Headers $headers -Method POST -Body $keyData
    $keyId = $keyResult.ssh_key.id
}

# Create droplet
Write-Host "Creating droplet..." -ForegroundColor Yellow
$dropletData = @{
    name="oak-dragon-main"; region="nyc3"; size="s-1vcpu-1gb"; image="ubuntu-22-04-x64"
    ssh_keys=@($keyId); tags=@("oak-dragon"); monitoring=$true
    user_data=@"
#!/bin/bash
apt update && apt upgrade -y
apt install -y nginx nodejs npm git ufw
npm install -g pm2
ufw allow 22,80,443/tcp && ufw --force enable
systemctl enable nginx && systemctl start nginx
"@
} | ConvertTo-Json

$droplet = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/droplets" -Headers $headers -Method POST -Body $dropletData

# Wait for droplet
Write-Host "Waiting for droplet..." -ForegroundColor Yellow
$dropletId = $droplet.droplet.id
do {
    Start-Sleep 15
    $status = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/droplets/$dropletId" -Headers $headers
    Write-Host "Status: $($status.droplet.status)" -ForegroundColor Gray
} while ($status.droplet.status -ne "active")

$ip = ($status.droplet.networks.v4 | Where-Object {$_.type -eq "public"})[0].ip_address
Write-Host "Droplet ready! IP: $ip" -ForegroundColor Green

# Wait for SSH
Write-Host "Waiting for SSH..." -ForegroundColor Yellow
do {
    Start-Sleep 10
    ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i $keyPath root@$ip "echo ready" 2>$null
} while ($LASTEXITCODE -ne 0)

# Deploy app
Write-Host "Deploying application..." -ForegroundColor Yellow
$commands = @(
    "cd /var/www",
    "git clone https://github.com/OakDragonCovenant/Oak-Dragon-Convenant.git app",
    "cd app && npm install",
    "echo 'NODE_ENV=production' > .env",
    "echo 'PORT=3000' >> .env",
    "pm2 start server.js --name oak-dragon",
    "pm2 startup && pm2 save"
)

foreach ($cmd in $commands) {
    ssh -o StrictHostKeyChecking=no -i $keyPath root@$ip $cmd
}

Write-Host ""
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "Website: http://$ip" -ForegroundColor Cyan
Write-Host "SSH: ssh -i $keyPath root@$ip" -ForegroundColor White
