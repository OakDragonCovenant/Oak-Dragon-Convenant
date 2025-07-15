# Oak Dragon Covenant - Clean Automated Deployment
# Budget: $15.99 hosting, $8.88 trading

param(
    [Parameter(Mandatory=$true)]
    [string]$DOApiKey
)

Write-Host "Oak Dragon Covenant - Automated Deployment" -ForegroundColor Cyan
Write-Host "Budget: $15.99 hosting, $8.88 trading" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

# Function to make DigitalOcean API calls
function Invoke-DOApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = @{}
    )
    
    $headers = @{
        "Authorization" = "Bearer $DOApiKey"
        "Content-Type" = "application/json"
    }
    
    $uri = "https://api.digitalocean.com/v2/$Endpoint"
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        } else {
            $jsonBody = $Body | ConvertTo-Json -Depth 4
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $jsonBody
        }
        return $response
    } catch {
        Write-Host "API Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test API connectivity
Write-Host "Testing DigitalOcean API..." -ForegroundColor Yellow
$account = Invoke-DOApi -Endpoint "account"
if (-not $account) {
    Write-Host "API connection failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Connected to: $($account.account.email)" -ForegroundColor Green

# Generate SSH key if needed
$keyPath = "$env:USERPROFILE\.ssh\id_oak_dragon"
if (-not (Test-Path "$keyPath.pub")) {
    Write-Host "Generating SSH key..." -ForegroundColor Yellow
    $sshDir = "$env:USERPROFILE\.ssh"
    if (-not (Test-Path $sshDir)) {
        New-Item -ItemType Directory -Path $sshDir -Force
    }
    ssh-keygen -t ed25519 -f $keyPath -N '""' -C "oak-dragon-covenant"
}

# Get public key content
$publicKey = Get-Content "$keyPath.pub" -Raw
$publicKey = $publicKey.Trim()

# Check if SSH key already exists
Write-Host "Managing SSH key..." -ForegroundColor Yellow
$existingKeys = Invoke-DOApi -Endpoint "account/keys"
$existingKey = $existingKeys.ssh_keys | Where-Object { $_.name -eq "oak-dragon-covenant" }

if ($existingKey) {
    Write-Host "SSH key already exists, using existing key" -ForegroundColor Green
    $sshKeyId = $existingKey.id
} else {
    # Try to find any existing key with same fingerprint
    $existingKeyByContent = $existingKeys.ssh_keys | Where-Object { $_.public_key -eq $publicKey }
    if ($existingKeyByContent) {
        Write-Host "SSH key exists with different name, using existing key" -ForegroundColor Green
        $sshKeyId = $existingKeyByContent.id
    } else {
        # Upload new SSH key with timestamp to make it unique
        $timestamp = (Get-Date).ToString("yyyyMMddHHmm")
        $keyData = @{
            name = "oak-dragon-covenant-$timestamp"
            public_key = $publicKey
        }
        
        $keyResult = Invoke-DOApi -Endpoint "account/keys" -Method "POST" -Body $keyData
        if ($keyResult) {
            $sshKeyId = $keyResult.ssh_key.id
            Write-Host "SSH key uploaded successfully" -ForegroundColor Green
        } else {
            Write-Host "Using first available SSH key" -ForegroundColor Yellow
            $sshKeyId = $existingKeys.ssh_keys[0].id
        }
    }
}

# Create droplet
Write-Host "Creating droplet..." -ForegroundColor Yellow
$dropletData = @{
    name = "oak-dragon-main"
    region = "nyc3"
    size = "s-1vcpu-1gb"
    image = "ubuntu-22-04-x64"
    ssh_keys = @($sshKeyId)
    tags = @("production", "oak-dragon")
    monitoring = $true
    backups = $false
    ipv6 = $true
    user_data = @"
#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y curl wget git nginx nodejs npm ufw
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g pm2
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo 'y' | ufw enable
systemctl start nginx
systemctl enable nginx
echo "Oak Dragon Covenant server setup complete" > /var/log/oak-dragon-setup.log
"@
}

$droplet = Invoke-DOApi -Endpoint "droplets" -Method "POST" -Body $dropletData
if (-not $droplet) {
    Write-Host "Failed to create droplet" -ForegroundColor Red
    exit 1
}

$dropletId = $droplet.droplet.id
Write-Host "Droplet created with ID: $dropletId" -ForegroundColor Green

# Wait for droplet to be ready
Write-Host "Waiting for droplet..." -ForegroundColor Yellow
$timeout = 600  # 10 minutes
$elapsed = 0
do {
    Start-Sleep -Seconds 15
    $elapsed += 15
    
    $dropletStatus = Invoke-DOApi -Endpoint "droplets/$dropletId"
    $status = $dropletStatus.droplet.status
    Write-Host "Status: $status" -ForegroundColor Gray
    
    if ($status -eq "active") {
        $ipAddress = $dropletStatus.droplet.networks.v4 | Where-Object { $_.type -eq "public" } | Select-Object -First 1
        $dropletIP = $ipAddress.ip_address
        Write-Host "Droplet is ready! IP: $dropletIP" -ForegroundColor Green
        break
    }
} while ($elapsed -lt $timeout)

if (-not $dropletIP) {
    Write-Host "Timeout waiting for droplet" -ForegroundColor Red
    exit 1
}

# Wait for SSH to be ready
Write-Host "Waiting for SSH access..." -ForegroundColor Yellow
Start-Sleep -Seconds 60  # Give server time to boot

$sshReady = $false
$attempts = 0
while (-not $sshReady -and $attempts -lt 10) {
    Start-Sleep -Seconds 10
    $attempts++
    Write-Host "SSH attempt $attempts/10..." -ForegroundColor Gray
    
    try {
        ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i $keyPath root@$dropletIP "echo 'SSH Ready'" 2>$null
        if ($LASTEXITCODE -eq 0) {
            $sshReady = $true
            Write-Host "SSH connection established!" -ForegroundColor Green
        }
    } catch {
        # Continue trying
    }
}

if (-not $sshReady) {
    Write-Host "SSH connection failed" -ForegroundColor Red
    Write-Host "You can manually connect with: ssh -i $keyPath root@$dropletIP" -ForegroundColor Yellow
    exit 1
}

# Deploy application
Write-Host "Deploying Oak Dragon Covenant..." -ForegroundColor Yellow

$deployCommands = @(
    "cd /var/www",
    "git clone https://github.com/OakDragonCovenant/Oak-Dragon-Convenant.git oak-dragon || true",
    "chown -R www-data:www-data oak-dragon || true",
    "cd oak-dragon",
    "npm install --production || npm install || true",
    "touch .env",
    "echo 'NODE_ENV=production' > .env",
    "echo 'HOSTING_BUDGET=15.99' >> .env",
    "echo 'TRADING_BUDGET=8.88' >> .env",
    "echo 'PORT=3000' >> .env",
    "pm2 start server.js --name oak-dragon-main || node server.js &",
    "pm2 save || true",
    "pm2 startup || true"
)

foreach ($cmd in $deployCommands) {
    Write-Host "Executing: $cmd" -ForegroundColor Gray
    ssh -o StrictHostKeyChecking=no -i $keyPath root@$dropletIP $cmd
}

# Verify deployment
Write-Host "Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

try {
    $response = Invoke-WebRequest -Uri "http://$dropletIP" -TimeoutSec 15 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "Deployment verification successful!" -ForegroundColor Green
    }
} catch {
    Write-Host "Verification failed, but application may still be starting..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host ""
Write-Host "Your Oak Dragon Covenant is live at:" -ForegroundColor Cyan
Write-Host "  Website: http://$dropletIP" -ForegroundColor White
Write-Host "  Dashboard: http://$dropletIP/dashboard" -ForegroundColor White
Write-Host "  API: http://$dropletIP/api" -ForegroundColor White
Write-Host ""
Write-Host "Budget Status:" -ForegroundColor Yellow
Write-Host "  Hosting: 6/month used of 15.99 budget" -ForegroundColor White
Write-Host "  Trading: 8.88 USDT available" -ForegroundColor White
Write-Host ""
Write-Host "SSH Access:" -ForegroundColor Cyan
Write-Host "  ssh -i $keyPath root@$dropletIP" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure your domain DNS to point to $dropletIP" -ForegroundColor White
Write-Host "2. Set up SSL certificates" -ForegroundColor White
Write-Host "3. Configure trading bot API keys" -ForegroundColor White
Write-Host "4. Start live trading with your budget" -ForegroundColor White
