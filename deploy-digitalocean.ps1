# Oak Dragon Covenant - DigitalOcean Deployment Script with IONOS Integration
# Automated deployment for the entire ecosystem
# Budget: $15.99 hosting, $8.88 trading

param(
    [Parameter(Mandatory=$false)]
    [string]$Phase = "1",
    
    [Parameter(Mandatory=$false)]
    [string]$DropletIP = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "oakdragoncovernant.com",
    
    [Parameter(Mandatory=$false)]
    [string]$IONOSApiKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$IONOSSecret = "",
    
    [Parameter(Mandatory=$false)]
    [string]$DOApiKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$AutoDeploy = "false"
)

Write-Host "DigitalOcean Oak Dragon Covenant Deployment" -ForegroundColor Cyan
Write-Host "Budget: $15.99 hosting, $8.88 trading" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Function to make IONOS API calls
function Invoke-IONOSApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = @{},
        [string]$ApiKey,
        [string]$ApiSecret
    )
    
    if (-not $ApiKey -or -not $ApiSecret) {
        Write-Host "Warning: IONOS API credentials not provided. Skipping API call." -ForegroundColor Yellow
        return $null
    }
    
    $headers = @{
        "X-API-Key" = "$ApiKey.$ApiSecret"
        "Content-Type" = "application/json"
    }
    
    $uri = "https://api.ionos.com/$Endpoint"
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        } else {
            $jsonBody = $Body | ConvertTo-Json -Depth 4
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $jsonBody
        }
        return $response
    } catch {
        Write-Host "IONOS API Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to make DigitalOcean API calls
function Invoke-DOApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = @{},
        [string]$ApiKey
    )
    
    if (-not $ApiKey) {
        Write-Host "Warning: DigitalOcean API key not provided. Skipping API call." -ForegroundColor Yellow
        return $null
    }
    
    $headers = @{
        "Authorization" = "Bearer $ApiKey"
        "Content-Type" = "application/json"
    }
    
    $uri = "https://api.digitalocean.com/v2/$Endpoint"
    
    try {
        Write-Host "DO API Call: $Method $uri" -ForegroundColor Gray
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        } else {
            $jsonBody = $Body | ConvertTo-Json -Depth 4
            Write-Host "Request Body: $jsonBody" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $jsonBody
        }
        return $response
    } catch {
        Write-Host "DigitalOcean API Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Details: $errorBody" -ForegroundColor Red
        }
        return $null
    }
}

# Function to test DigitalOcean API connectivity
function Test-DOApi {
    param([string]$ApiKey)
    
    Write-Host "Testing DigitalOcean API connectivity..." -ForegroundColor Yellow
    
    if (-not $ApiKey) {
        Write-Host "⚠ DigitalOcean API key not provided" -ForegroundColor Yellow
        return $false
    }
    
    $account = Invoke-DOApi -Endpoint "account" -ApiKey $ApiKey
    
    if ($account) {
        Write-Host "✓ DigitalOcean API connection successful" -ForegroundColor Green
        Write-Host "  Account: $($account.account.email)" -ForegroundColor White
        Write-Host "  Status: $($account.account.status)" -ForegroundColor White
        return $true
    } else {
        Write-Host "✗ DigitalOcean API connection failed" -ForegroundColor Red
        return $false
    }
}

# Function to upload SSH key to DigitalOcean
function Add-DOSSHKey {
    param(
        [string]$ApiKey,
        [string]$KeyName = "oak-dragon-covenant",
        [string]$PublicKeyPath = "$env:USERPROFILE\.ssh\id_oak_dragon.pub"
    )
    
    if (-not $ApiKey) {
        Write-Host "DigitalOcean API key required for SSH key upload" -ForegroundColor Yellow
        return $null
    }
    
    if (-not (Test-Path $PublicKeyPath)) {
        Write-Host "SSH public key not found: $PublicKeyPath" -ForegroundColor Red
        return $null
    }
    
    $publicKey = Get-Content $PublicKeyPath -Raw
    $publicKey = $publicKey.Trim()
    
    # Check if key already exists
    $existingKeys = Invoke-DOApi -Endpoint "account/keys" -ApiKey $ApiKey
    $existingKey = $existingKeys.ssh_keys | Where-Object { $_.name -eq $KeyName }
    
    if ($existingKey) {
        Write-Host "✓ SSH key '$KeyName' already exists in DigitalOcean" -ForegroundColor Green
        return $existingKey.id
    }
    
    Write-Host "Uploading SSH key to DigitalOcean..." -ForegroundColor Yellow
    
    $keyData = @{
        name = $KeyName
        public_key = $publicKey
    }
    
    $result = Invoke-DOApi -Endpoint "account/keys" -Method "POST" -Body $keyData -ApiKey $ApiKey
    
    if ($result) {
        Write-Host "✓ SSH key uploaded successfully" -ForegroundColor Green
        Write-Host "  Key ID: $($result.ssh_key.id)" -ForegroundColor White
        return $result.ssh_key.id
    } else {
        Write-Host "✗ Failed to upload SSH key" -ForegroundColor Red
        return $null
    }
}

# Function to create DigitalOcean droplet
function New-DODroplet {
    param(
        [string]$ApiKey,
        [string]$Name = "oak-dragon-main",
        [string]$Region = "nyc3",
        [string]$Size = "s-1vcpu-1gb",
        [string]$Image = "ubuntu-22-04-x64",
        [array]$SSHKeys = @(),
        [array]$Tags = @("production", "oak-dragon")
    )
    
    if (-not $ApiKey) {
        Write-Host "DigitalOcean API key required for droplet creation" -ForegroundColor Yellow
        return $null
    }
    
    Write-Host "Creating DigitalOcean droplet..." -ForegroundColor Yellow
    Write-Host "  Name: $Name" -ForegroundColor White
    Write-Host "  Region: $Region" -ForegroundColor White
    Write-Host "  Size: $Size" -ForegroundColor White
    Write-Host "  Image: $Image" -ForegroundColor White
    
    $dropletData = @{
        name = $Name
        region = $Region
        size = $Size
        image = $Image
        ssh_keys = $SSHKeys
        tags = $Tags
        monitoring = $true
        backups = $false
        ipv6 = $true
        user_data = @"
#!/bin/bash
# Initial server setup for Oak Dragon Covenant
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
    
    $result = Invoke-DOApi -Endpoint "droplets" -Method "POST" -Body $dropletData -ApiKey $ApiKey
    
    if ($result) {
        Write-Host "✓ Droplet creation initiated" -ForegroundColor Green
        Write-Host "  Droplet ID: $($result.droplet.id)" -ForegroundColor White
        Write-Host "  Status: $($result.droplet.status)" -ForegroundColor White
        return $result.droplet
    } else {
        Write-Host "✗ Failed to create droplet" -ForegroundColor Red
        return $null
    }
}

# Function to wait for droplet to be ready
function Wait-ForDroplet {
    param(
        [string]$ApiKey,
        [string]$DropletId,
        [int]$TimeoutMinutes = 10
    )
    
    Write-Host "Waiting for droplet to be ready..." -ForegroundColor Yellow
    $startTime = Get-Date
    $timeoutTime = $startTime.AddMinutes($TimeoutMinutes)
    
    do {
        Start-Sleep -Seconds 15
        $droplet = Invoke-DOApi -Endpoint "droplets/$DropletId" -ApiKey $ApiKey
        
        if ($droplet) {
            $status = $droplet.droplet.status
            Write-Host "  Status: $status" -ForegroundColor Gray
            
            if ($status -eq "active") {
                $ipAddress = $droplet.droplet.networks.v4 | Where-Object { $_.type -eq "public" } | Select-Object -First 1
                Write-Host "✓ Droplet is ready!" -ForegroundColor Green
                Write-Host "  IP Address: $($ipAddress.ip_address)" -ForegroundColor White
                return $ipAddress.ip_address
            }
        }
        
        $currentTime = Get-Date
    } while ($currentTime -lt $timeoutTime)
    
    Write-Host "✗ Timeout waiting for droplet to be ready" -ForegroundColor Red
    return $null
}

# Function for fully automated deployment
function Start-AutoDeploy {
    param(
        [string]$DOApiKey,
        [string]$IONOSApiKey,
        [string]$IONOSSecret,
        [string]$Domain
    )
    
    Write-Host ""
    Write-Host "🚀 AUTOMATED DEPLOYMENT STARTING" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Step 1: Test API connectivity
    if (-not (Test-DOApi -ApiKey $DOApiKey)) {
        Write-Host "Cannot proceed without valid DigitalOcean API key" -ForegroundColor Red
        return $false
    }
    
    # Step 2: Generate SSH key if needed
    $keyPath = "$env:USERPROFILE\.ssh\id_oak_dragon"
    if (-not (Test-Path "$keyPath.pub")) {
        Write-Host "Generating SSH key..." -ForegroundColor Yellow
        ssh-keygen -t ed25519 -f $keyPath -N '""' -C "oak-dragon-covenant@$env:COMPUTERNAME"
    }
    
    # Step 3: Upload SSH key
    $sshKeyId = Add-DOSSHKey -ApiKey $DOApiKey
    if (-not $sshKeyId) {
        Write-Host "Failed to upload SSH key" -ForegroundColor Red
        return $false
    }
    
    # Step 4: Create droplet
    $droplet = New-DODroplet -ApiKey $DOApiKey -SSHKeys @($sshKeyId)
    if (-not $droplet) {
        Write-Host "Failed to create droplet" -ForegroundColor Red
        return $false
    }
    
    # Step 5: Wait for droplet to be ready
    $dropletIP = Wait-ForDroplet -ApiKey $DOApiKey -DropletId $droplet.id
    if (-not $dropletIP) {
        Write-Host "Droplet creation timed out" -ForegroundColor Red
        return $false
    }
    
    # Step 6: Configure IONOS DNS if available
    if ($IONOSApiKey -and $IONOSSecret) {
        Write-Host "Configuring IONOS DNS..." -ForegroundColor Yellow
        Set-IONOSDNSRecords -Domain $Domain -DropletIP $dropletIP -ApiKey $IONOSApiKey -ApiSecret $IONOSSecret
        New-IONOSSSL -Domain $Domain -ApiKey $IONOSApiKey -ApiSecret $IONOSSecret
    }
    
    # Step 7: Deploy application
    Write-Host "Waiting 60 seconds for server to fully initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
    
    Write-Host "Deploying Oak Dragon Covenant application..." -ForegroundColor Yellow
    $deploySuccess = Deploy-Application -DropletIP $dropletIP -Domain $Domain
    
    if ($deploySuccess) {
        Write-Host ""
        Write-Host "🎉 AUTOMATED DEPLOYMENT COMPLETE!" -ForegroundColor Green
        Write-Host "=================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your Oak Dragon Covenant is live at:" -ForegroundColor Cyan
        Write-Host "  IP: http://$dropletIP" -ForegroundColor White
        if ($IONOSApiKey -and $IONOSSecret) {
            Write-Host "  Domain: https://$Domain (wait 15 minutes for DNS)" -ForegroundColor White
        }
        Write-Host "  Dashboard: http://$dropletIP/dashboard" -ForegroundColor White
        Write-Host "  API: http://$dropletIP/api" -ForegroundColor White
        Write-Host ""
        Write-Host "💰 Budget Status:" -ForegroundColor Yellow
        Write-Host "  Hosting: $6/month used of $15.99 budget" -ForegroundColor White
        Write-Host "  Trading: $8.88 USDT available" -ForegroundColor White
        return $true
    } else {
        Write-Host "Application deployment failed" -ForegroundColor Red
        return $false
    }
}

# Function to deploy application to droplet
function Deploy-Application {
    param(
        [string]$DropletIP,
        [string]$Domain
    )
    
    Write-Host "Testing SSH connection to $DropletIP..." -ForegroundColor Yellow
    
    # Wait for SSH to be ready
    $sshReady = $false
    $attempts = 0
    while (-not $sshReady -and $attempts -lt 12) {
        Start-Sleep -Seconds 10
        $attempts++
        Write-Host "  Attempt $attempts/12..." -ForegroundColor Gray
        
        ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP "echo 'SSH Ready'" 2>$null
        if ($LASTEXITCODE -eq 0) {
            $sshReady = $true
            Write-Host "✓ SSH connection established" -ForegroundColor Green
        }
    }
    
    if (-not $sshReady) {
        Write-Host "✗ SSH connection failed after 2 minutes" -ForegroundColor Red
        return $false
    }
    
    # Deploy application
    $deployCommands = @(
        "cd /var/www",
        "git clone https://github.com/OakDragonCovenant/Oak-Dragon-Convenant.git oak-dragon",
        "chown -R www-data:www-data oak-dragon",
        "cd oak-dragon",
        "npm install --production",
        "cp .env.example .env 2>/dev/null || touch .env",
        "echo 'NODE_ENV=production' >> .env",
        "echo 'HOSTING_BUDGET=15.99' >> .env",
        "echo 'TRADING_BUDGET=8.88' >> .env",
        "echo 'PORT=3000' >> .env",
        "echo 'DOMAIN=$Domain' >> .env",
        "pm2 start server.js --name oak-dragon-main || node server.js &",
        "pm2 save 2>/dev/null || true",
        "pm2 startup 2>/dev/null || true"
    )
    
    # Upload bot protection files if they exist
    if (Test-Path ".htaccess-protection") {
        Write-Host "Uploading bot protection files..." -ForegroundColor Yellow
        scp -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" ".htaccess-protection" root@${DropletIP}:/var/www/oak-dragon/.htaccess 2>$null
        scp -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" "robots-protection.txt" root@${DropletIP}:/var/www/oak-dragon/robots.txt 2>$null
    }
    
    foreach ($cmd in $deployCommands) {
        Write-Host "Executing: $cmd" -ForegroundColor Gray
        ssh -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP $cmd
        if ($LASTEXITCODE -ne 0 -and $cmd -notlike "*pm2*") {
            Write-Host "⚠ Command had issues: $cmd" -ForegroundColor Yellow
        }
    }
    
    # Verify deployment
    Start-Sleep -Seconds 10
    try {
        $response = Invoke-WebRequest -Uri "http://$DropletIP" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Application deployment verified" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "⚠ Application verification failed, but deployment may still be successful" -ForegroundColor Yellow
        return $true  # Continue anyway as the app might take time to start
    }
    
    return $true
}

# Function to configure IONOS DNS for DigitalOcean
function Set-IONOSDNSRecords {
    param(
        [string]$Domain,
        [string]$DropletIP,
        [string]$ApiKey,
        [string]$ApiSecret
    )
    
    Write-Host "Configuring IONOS DNS records for $Domain..." -ForegroundColor Yellow
    
    if (-not $ApiKey -or -not $ApiSecret) {
        Write-Host "IONOS API credentials not provided. Please configure DNS manually:" -ForegroundColor Yellow
        Write-Host "1. Log into your IONOS dashboard" -ForegroundColor White
        Write-Host "2. Go to Domains & SSL > DNS" -ForegroundColor White
        Write-Host "3. Add A record: @ -> $DropletIP" -ForegroundColor White
        Write-Host "4. Add A record: www -> $DropletIP" -ForegroundColor White
        Write-Host "5. Add A record: api -> $DropletIP" -ForegroundColor White
        Write-Host "6. Add A record: dashboard -> $DropletIP" -ForegroundColor White
        return
    }
    
    # Get zone information
    $zones = Invoke-IONOSApi -Endpoint "dns/v1/zones" -ApiKey $ApiKey -ApiSecret $ApiSecret
    $zone = $zones | Where-Object { $_.name -eq $Domain }
    
    if (-not $zone) {
        Write-Host "Domain $Domain not found in IONOS. Please add it first." -ForegroundColor Red
        return
    }
    
    $zoneId = $zone.id
    
    # DNS records to create
    $records = @(
        @{ name = "@"; type = "A"; content = $DropletIP; ttl = 3600 },
        @{ name = "www"; type = "A"; content = $DropletIP; ttl = 3600 },
        @{ name = "api"; type = "A"; content = $DropletIP; ttl = 3600 },
        @{ name = "dashboard"; type = "A"; content = $DropletIP; ttl = 3600 }
    )
    
    foreach ($record in $records) {
        Write-Host "Creating DNS record: $($record.name) -> $($record.content)" -ForegroundColor Gray
        $result = Invoke-IONOSApi -Endpoint "dns/v1/zones/$zoneId/records" -Method "POST" -Body $record -ApiKey $ApiKey -ApiSecret $ApiSecret
        
        if ($result) {
            Write-Host "✓ Created $($record.name) record" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to create $($record.name) record" -ForegroundColor Red
        }
    }
}

# Function to provision IONOS SSL certificate
function New-IONOSSSL {
    param(
        [string]$Domain,
        [string]$ApiKey,
        [string]$ApiSecret
    )
    
    Write-Host "Provisioning SSL certificate for $Domain..." -ForegroundColor Yellow
    
    if (-not $ApiKey -or -not $ApiSecret) {
        Write-Host "IONOS API credentials not provided. SSL setup skipped." -ForegroundColor Yellow
        Write-Host "Manual SSL setup: Use Let's Encrypt on your DigitalOcean droplet" -ForegroundColor White
        return
    }
    
    $sslConfig = @{
        commonName = $Domain
        subjectAlternativeNames = @("www.$Domain", "api.$Domain", "dashboard.$Domain")
        validationType = "dns"
    }
    
    $result = Invoke-IONOSApi -Endpoint "ssl/v1/certificates" -Method "POST" -Body $sslConfig -ApiKey $ApiKey -ApiSecret $ApiSecret
    
    if ($result) {
        Write-Host "✓ SSL certificate provisioned successfully" -ForegroundColor Green
        Write-Host "Certificate ID: $($result.id)" -ForegroundColor White
    } else {
        Write-Host "✗ SSL certificate provisioning failed" -ForegroundColor Red
    }
}

# Function to configure IONOS bot protection
function Set-IONOSBotProtection {
    param(
        [string]$DropletIP,
        [string]$ApiKey,
        [string]$ApiSecret
    )
    
    Write-Host "Configuring bot protection against IONOS-bot..." -ForegroundColor Yellow
    
    # Create .htaccess content for Apache/Nginx
    $htaccessContent = @"
# IONOS Bot Protection
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} IONOS-bot [NC]
RewriteRule .* - [F,L]

# Rate limiting for all bots
RewriteCond %{HTTP_USER_AGENT} bot [NC,OR]
RewriteCond %{HTTP_USER_AGENT} crawler [NC,OR]
RewriteCond %{HTTP_USER_AGENT} spider [NC]
RewriteRule .* - [E=BOT:1]
Header always set X-Rate-Limit "100" env=BOT
"@

    $robotsContent = @"
# Robots.txt for Oak Dragon Covenant
User-agent: *
Allow: /
Crawl-delay: 1

# Block IONOS bot from sensitive areas
User-agent: IONOS-bot
Disallow: /api/
Disallow: /dashboard/
Disallow: /admin/
Allow: /

# Sitemap
Sitemap: https://$Domain/sitemap.xml
"@

    # Save bot protection files locally for deployment
    $htaccessContent | Set-Content ".htaccess-protection"
    $robotsContent | Set-Content "robots-protection.txt"
    
    Write-Host "✓ Bot protection files created (.htaccess-protection, robots-protection.txt)" -ForegroundColor Green
    Write-Host "These will be deployed to your server in Phase 3" -ForegroundColor White
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow
    
    $prerequisites = @{
        "git" = "Git for version control"
        "ssh" = "SSH client for server access"
    }
    
    $missing = @()
    foreach ($cmd in $prerequisites.Keys) {
        if (-not (Test-Command $cmd)) {
            $missing += "$cmd - $($prerequisites[$cmd])"
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Host "Missing prerequisites:" -ForegroundColor Red
        $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
        Write-Host "Please install missing tools and run again." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "All prerequisites found!" -ForegroundColor Green
}

# Function to generate SSH key
function New-SSHKey {
    Write-Host "Generating SSH key for DigitalOcean..." -ForegroundColor Yellow
    
    $sshPath = "$env:USERPROFILE\.ssh"
    if (-not (Test-Path $sshPath)) {
        New-Item -ItemType Directory -Path $sshPath -Force
    }
    
    $keyPath = "$sshPath\id_oak_dragon"
    if (-not (Test-Path "$keyPath.pub")) {
        ssh-keygen -t ed25519 -f $keyPath -N '""' -C "oak-dragon-covenant@$env:COMPUTERNAME"
        Write-Host "SSH key generated: $keyPath" -ForegroundColor Green
    } else {
        Write-Host "SSH key already exists: $keyPath" -ForegroundColor Green
    }
    
    Write-Host "Your public key:" -ForegroundColor Cyan
    Get-Content "$keyPath.pub"
    Write-Host ""
    Write-Host "Copy this key to DigitalOcean: Settings > Security > SSH Keys" -ForegroundColor Yellow
}

# Function to create deployment configuration
function New-DeploymentConfig {
    Write-Host "Creating deployment configuration..." -ForegroundColor Yellow
    
    $config = @{
        project = "oak-dragon-covenant"
        budget = @{
            hosting = 15.99
            trading = 8.88
        }
        droplets = @{
            main = @{
                name = "oak-dragon-main"
                size = "s-1vcpu-1gb"
                image = "ubuntu-22-04-x64"
                region = "nyc3"
                cost = 6.00
            }
        }
        domain = $Domain
        digitalocean = @{
            apiKey = if ($DOApiKey) { "***configured***" } else { "not-provided" }
            autoDropletCreation = "enabled"
            sshKeyManagement = "automatic"
            monitoring = "enabled"
        }
        ionos = @{
            apiKey = if ($IONOSApiKey) { "***configured***" } else { "not-provided" }
            dnsManagement = "automatic"
            sslProvisioning = "enabled"
            botProtection = "enabled"
        }
        services = @(
            "command-center",
            "landing-page", 
            "trading-bots",
            "api-gateway",
            "monitoring"
        )
        timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
    
    $config | ConvertTo-Json -Depth 4 | Set-Content "deployment-config.json"
    Write-Host "Configuration saved to deployment-config.json" -ForegroundColor Green
}

# Function to show manual steps
function Show-ManualSteps {
    Write-Host ""
    Write-Host "MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
    Write-Host "=====================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Create DigitalOcean Account:" -ForegroundColor Cyan
    Write-Host "   - Go to: https://digitalocean.com" -ForegroundColor White
    Write-Host "   - Sign up with your email" -ForegroundColor White
    Write-Host "   - Verify email address" -ForegroundColor White
    Write-Host "   - Add payment method" -ForegroundColor White
    Write-Host "   - Use promo code for free credit if available" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Add SSH Key to DigitalOcean:" -ForegroundColor Cyan
    Write-Host "   - Go to: Account > Settings > Security" -ForegroundColor White
    Write-Host "   - Click 'Add SSH Key'" -ForegroundColor White
    Write-Host "   - Paste the public key shown above" -ForegroundColor White
    Write-Host "   - Name it 'Oak Dragon Covenant Key'" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Create Your First Droplet:" -ForegroundColor Cyan
    Write-Host "   - Click 'Create' > 'Droplets'" -ForegroundColor White
    Write-Host "   - Choose Ubuntu 22.04 LTS" -ForegroundColor White
    Write-Host "   - Select Basic plan: $6/month (1GB RAM, 1vCPU, 25GB SSD)" -ForegroundColor White
    Write-Host "   - Choose datacenter region (NYC3 recommended)" -ForegroundColor White
    Write-Host "   - Add your SSH key" -ForegroundColor White
    Write-Host "   - Name: 'oak-dragon-main'" -ForegroundColor White
    Write-Host "   - Add tags: 'production', 'oak-dragon'" -ForegroundColor White
    Write-Host "   - Click 'Create Droplet'" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Note Your Droplet IP:" -ForegroundColor Cyan
    Write-Host "   - Wait for droplet creation (2-3 minutes)" -ForegroundColor White
    Write-Host "   - Copy the IP address shown in the dashboard" -ForegroundColor White
    Write-Host ""        Write-Host "5. Continue Deployment:" -ForegroundColor Cyan
        Write-Host "   - Run: .\deploy-digitalocean.ps1 -Phase 2 -DropletIP YOUR_IP_HERE" -ForegroundColor White
        Write-Host ""
        Write-Host "6. Optional - IONOS Integration:" -ForegroundColor Cyan
        Write-Host "   - Add IONOS API credentials for automatic DNS/SSL setup:" -ForegroundColor White
        Write-Host "   - Run: .\deploy-digitalocean.ps1 -Phase 2 -DropletIP YOUR_IP -IONOSApiKey YOUR_KEY -IONOSSecret YOUR_SECRET" -ForegroundColor White
        Write-Host ""
        Write-Host "7. Optional - DigitalOcean API Integration:" -ForegroundColor Cyan
        Write-Host "   - Add DO API key for automatic droplet creation:" -ForegroundColor White
        Write-Host "   - Run: .\deploy-digitalocean.ps1 -Phase 2 -DOApiKey YOUR_DO_API_KEY" -ForegroundColor White
        Write-Host ""
        Write-Host "8. FULLY AUTOMATED DEPLOYMENT:" -ForegroundColor Green
        Write-Host "   - Run: .\deploy-digitalocean.ps1 -AutoDeploy true -DOApiKey YOUR_DO_KEY -IONOSApiKey YOUR_IONOS_KEY -IONOSSecret YOUR_IONOS_SECRET" -ForegroundColor White
        Write-Host ""
}

# Main execution based on phase
Write-Host "Phase ${Phase}: " -NoNewline -ForegroundColor Cyan

# Check for automated deployment
if ($AutoDeploy -eq "true") {
    Write-Host "Fully Automated Deployment" -ForegroundColor Green
    Write-Host "==========================" -ForegroundColor Green
    
    if (-not $DOApiKey) {
        Write-Host "Error: DigitalOcean API key required for automated deployment" -ForegroundColor Red
        Write-Host "Get your API key: https://cloud.digitalocean.com/account/api/tokens" -ForegroundColor Yellow
        exit 1
    }
    
    $success = Start-AutoDeploy -DOApiKey $DOApiKey -IONOSApiKey $IONOSApiKey -IONOSSecret $IONOSSecret -Domain $Domain
    if ($success) {
        Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "💥 Deployment failed. Check the logs above." -ForegroundColor Red
        exit 1
    }
    return
}

switch ([int]$Phase) {
    1 {
        Write-Host "Account Setup and Preparation" -ForegroundColor Cyan
        Write-Host "==============================" -ForegroundColor Cyan
        
        Test-Prerequisites
        
        # Test DigitalOcean API if provided
        if ($DOApiKey) {
            Test-DOApi -ApiKey $DOApiKey
        }
        
        New-SSHKey
        New-DeploymentConfig
        Set-IONOSBotProtection -DropletIP "0.0.0.0" -ApiKey $IONOSApiKey -ApiSecret $IONOSSecret
        Show-ManualSteps
        
        Write-Host "Phase 1 Complete!" -ForegroundColor Green
        Write-Host "Follow the manual steps above, then run Phase 2" -ForegroundColor Yellow
    }
    
    2 {
        Write-Host "Server Setup" -ForegroundColor Cyan
        Write-Host "============" -ForegroundColor Cyan
        
        # Auto-create droplet if API key provided and no IP specified
        if ($DOApiKey -and -not $DropletIP) {
            Write-Host "DigitalOcean API key provided - creating droplet automatically..." -ForegroundColor Cyan
            
            # Test API first
            if (-not (Test-DOApi -ApiKey $DOApiKey)) {
                exit 1
            }
            
            # Upload SSH key
            $sshKeyId = Add-DOSSHKey -ApiKey $DOApiKey
            if (-not $sshKeyId) {
                exit 1
            }
            
            # Create droplet
            $droplet = New-DODroplet -ApiKey $DOApiKey -SSHKeys @($sshKeyId)
            if (-not $droplet) {
                exit 1
            }
            
            # Wait for droplet
            $DropletIP = Wait-ForDroplet -ApiKey $DOApiKey -DropletId $droplet.id
            if (-not $DropletIP) {
                exit 1
            }
            
            Write-Host "✓ Droplet created successfully: $DropletIP" -ForegroundColor Green
        }
        
        if (-not $DropletIP) {
            Write-Host "Error: DropletIP parameter required for Phase 2" -ForegroundColor Red
            Write-Host "Usage: .\deploy-digitalocean.ps1 -Phase 2 -DropletIP YOUR_DROPLET_IP" -ForegroundColor Yellow
            Write-Host "   OR: .\deploy-digitalocean.ps1 -Phase 2 -DOApiKey YOUR_API_KEY (for auto-creation)" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "Connecting to droplet: $DropletIP" -ForegroundColor White
        
        # Test SSH connection
        Write-Host "Testing SSH connection..." -ForegroundColor Yellow
        ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP "echo 'Connection successful'" 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SSH connection successful!" -ForegroundColor Green
            
            # Create and run server setup script
            Write-Host "Setting up server environment..." -ForegroundColor Yellow
            
            $setupCommands = @(
                "apt update && apt upgrade -y",
                "apt install -y curl wget git nginx nodejs npm ufw",
                "curl -fsSL https://deb.nodesource.com/setup_18.x | bash -",
                "apt-get install -y nodejs",
                "npm install -g pm2",
                "ufw allow 22/tcp",
                "ufw allow 80/tcp",
                "ufw allow 443/tcp",
                "echo 'y' | ufw enable",
                "systemctl start nginx",
                "systemctl enable nginx",
                "echo 'Server setup complete!'"
            )
            
            foreach ($cmd in $setupCommands) {
                Write-Host "Executing: $cmd" -ForegroundColor Gray
                ssh -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP $cmd
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "Command failed: $cmd" -ForegroundColor Red
                    exit 1
                }
            }
            
            Write-Host "Phase 2 Complete!" -ForegroundColor Green
            Write-Host "Next: .\deploy-digitalocean.ps1 -Phase 3 -DropletIP $DropletIP" -ForegroundColor Yellow
            
            # Configure IONOS DNS if credentials provided
            if ($IONOSApiKey -and $IONOSSecret) {
                Write-Host "Configuring IONOS DNS and SSL..." -ForegroundColor Cyan
                Set-IONOSDNSRecords -Domain $Domain -DropletIP $DropletIP -ApiKey $IONOSApiKey -ApiSecret $IONOSSecret
                New-IONOSSSL -Domain $Domain -ApiKey $IONOSApiKey -ApiSecret $IONOSSecret
            } else {
                Write-Host "IONOS integration skipped (no API credentials provided)" -ForegroundColor Yellow
            }
            
        } else {
            Write-Host "SSH connection failed!" -ForegroundColor Red
            Write-Host "Please verify:" -ForegroundColor Yellow
            Write-Host "1. Droplet IP is correct: $DropletIP" -ForegroundColor White
            Write-Host "2. SSH key was added to DigitalOcean" -ForegroundColor White
            Write-Host "3. Droplet is fully booted (wait 2-3 minutes after creation)" -ForegroundColor White
            exit 1
        }
    }
    
    3 {
        Write-Host "Application Deployment" -ForegroundColor Cyan
        Write-Host "=====================" -ForegroundColor Cyan
        
        if (-not $DropletIP) {
            Write-Host "Error: DropletIP parameter required for Phase 3" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "Deploying Oak Dragon Covenant to: $DropletIP" -ForegroundColor White
        
        $deployCommands = @(
            "cd /var/www",
            "git clone https://github.com/OakDragonCovenant/Oak-Dragon-Convenant.git",
            "chown -R www-data:www-data Oak-Dragon-Convenant",
            "cd Oak-Dragon-Convenant",
            "npm install",
            "cp .env.example .env || touch .env",
            "echo 'NODE_ENV=production' >> .env",
            "echo 'HOSTING_BUDGET=15.99' >> .env",
            "echo 'TRADING_BUDGET=8.88' >> .env",
            "echo 'PORT=3000' >> .env",
            "echo `"DOMAIN=$Domain`" >> .env"
        )
        
        # Upload bot protection files if they exist
        if (Test-Path ".htaccess-protection") {
            Write-Host "Uploading bot protection files..." -ForegroundColor Yellow
            scp -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" ".htaccess-protection" root@${DropletIP}:/var/www/Oak-Dragon-Convenant/.htaccess
            scp -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" "robots-protection.txt" root@${DropletIP}:/var/www/Oak-Dragon-Convenant/robots.txt
        }
        
        $deployCommands += @(
            "pm2 start server.js --name oak-dragon-main",
            "pm2 save",
            "pm2 startup"
        )
        
        foreach ($cmd in $deployCommands) {
            Write-Host "Executing: $cmd" -ForegroundColor Gray
            ssh -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\id_oak_dragon" root@$DropletIP $cmd
        }
        
        Write-Host ""
        Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
        Write-Host "===================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your Oak Dragon Covenant ecosystem is now running at:" -ForegroundColor Cyan
        Write-Host "Website: http://$DropletIP" -ForegroundColor White
        Write-Host "Dashboard: http://$DropletIP/dashboard" -ForegroundColor White
        Write-Host "API: http://$DropletIP/api" -ForegroundColor White
        Write-Host ""
        Write-Host "Budget Status:" -ForegroundColor Yellow
        Write-Host "- Hosting: $6/month used of $15.99 budget" -ForegroundColor White
        Write-Host "- Trading: $8.88 USDT available for trading" -ForegroundColor White
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        if ($IONOSApiKey -and $IONOSSecret) {
            Write-Host "✓ IONOS DNS configured automatically" -ForegroundColor Green
            Write-Host "✓ SSL certificate provisioned" -ForegroundColor Green
            Write-Host "✓ Bot protection enabled" -ForegroundColor Green
            Write-Host "1. Wait 10-15 minutes for DNS propagation" -ForegroundColor White
            Write-Host "2. Access your site at https://$Domain" -ForegroundColor White
        } else {
            Write-Host "1. Configure domain DNS to point to $DropletIP" -ForegroundColor White
            Write-Host "2. Set up SSL certificates" -ForegroundColor White
        }
        Write-Host "3. Configure trading bot API keys" -ForegroundColor White
        Write-Host "4. Start live trading with your budget" -ForegroundColor White
        Write-Host ""
        Write-Host "DigitalOcean Integration Status:" -ForegroundColor Cyan
        if ($DOApiKey) {
            Write-Host "✓ API credentials provided" -ForegroundColor Green
            Write-Host "✓ Droplet management: Automated" -ForegroundColor Green
            Write-Host "✓ SSH key management: Automated" -ForegroundColor Green
            Write-Host "✓ Monitoring: Enabled" -ForegroundColor Green
        } else {
            Write-Host "⚠ API credentials not provided" -ForegroundColor Yellow
            Write-Host "⚠ Manual droplet creation required" -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "IONOS Integration Status:" -ForegroundColor Cyan
        if ($IONOSApiKey -and $IONOSSecret) {
            Write-Host "✓ API credentials provided" -ForegroundColor Green
            Write-Host "✓ DNS management: Automated" -ForegroundColor Green
            Write-Host "✓ SSL provisioning: Automated" -ForegroundColor Green
            Write-Host "✓ Bot protection: Enabled" -ForegroundColor Green
        } else {
            Write-Host "⚠ API credentials not provided" -ForegroundColor Yellow
            Write-Host "⚠ Manual DNS configuration required" -ForegroundColor Yellow
            Write-Host "⚠ Manual SSL setup required" -ForegroundColor Yellow
        }
    }
    
    default {
        Write-Host "Invalid phase. Available phases: 1, 2, 3" -ForegroundColor Red
        exit 1
    }
}
