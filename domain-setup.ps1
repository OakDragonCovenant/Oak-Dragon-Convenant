# Oak Dragon Covenant Domain Setup Script
# Simple version for oakdragoncovenant.com deployment

param(
    [switch]$ShowDNS,
    [switch]$Deploy,
    [switch]$Test
)

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

# Domain configuration
$Domain = "oakdragoncovenant.com"

$Services = @{
    Main = @{
        URL = "https://$Domain"
        Purpose = "Landing Page & Authentication"
        Provider = "Railway"
    }
    Trading = @{
        URL = "https://trading.$Domain"
        Purpose = "Trading Dashboard"
        Provider = "Render"
    }
    Dashboard = @{
        URL = "https://dashboard.$Domain"
        Purpose = "Command Center"
        Provider = "Vercel"
    }
    API = @{
        URL = "https://api.$Domain"
        Purpose = "REST API Gateway"
        Provider = "Railway"
    }
    Command = @{
        URL = "https://command.$Domain"
        Purpose = "Command Interface"
        Provider = "Vercel"
    }
    Portal = @{
        URL = "https://portal.$Domain"
        Purpose = "Member Portal"
        Provider = "Vercel"
    }
}

if ($ShowDNS) {
    Write-Info "DNS CONFIGURATION FOR IONOS"
    Write-Host "=============================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Login to: https://my.ionos.com/domain-dns-settings/$Domain" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Add these DNS records:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "A Records:" -ForegroundColor Green
    Write-Host "  @     -> [Railway IP Address]"
    Write-Host "  www   -> [Railway IP Address]"
    Write-Host ""
    Write-Host "CNAME Records:" -ForegroundColor Green
    Write-Host "  trading   -> oak-dragon-covenant.onrender.com"
    Write-Host "  dashboard -> oak-dragon-covenant.vercel.app"
    Write-Host "  api       -> oak-dragon-api.up.railway.app"
    Write-Host "  command   -> oak-dragon-command.vercel.app"
    Write-Host "  portal    -> oak-dragon-portal.vercel.app"
    Write-Host ""
    Write-Host "Security Records:" -ForegroundColor Green
    Write-Host "  TXT @      -> v=spf1 include:_spf.ionos.com ~all"
    Write-Host "  TXT _dmarc -> v=DMARC1; p=quarantine; rua=mailto:admin@$Domain"
}

if ($Deploy) {
    Write-Info "DEPLOYING TO CLOUD PROVIDERS"
    Write-Host "=============================" -ForegroundColor Yellow
    
    Write-Info "Deploying to Railway..."
    try {
        railway up
        Write-Success "Railway deployment completed"
    } catch {
        Write-Warning "Railway deployment failed - check CLI installation"
    }
    
    Write-Info "Deploying to Vercel..."
    try {
        vercel --prod --yes
        Write-Success "Vercel deployment completed"
    } catch {
        Write-Warning "Vercel deployment failed - check CLI installation"
    }
    
    Write-Info "Triggering Render deployment..."
    try {
        git add .
        git commit -m "Deploy to Render - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push origin main
        Write-Success "Render deployment triggered via git push"
    } catch {
        Write-Warning "Render deployment failed - check git configuration"
    }
}

if ($Test) {
    Write-Info "TESTING DOMAIN RESOLUTION"
    Write-Host "==========================" -ForegroundColor Yellow
    
    foreach ($service in $Services.GetEnumerator()) {
        $url = $service.Value.URL
        Write-Host "Testing $url..." -NoNewline
        
        try {
            $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing
            Write-Host " OK ($($response.StatusCode))" -ForegroundColor Green
        } catch {
            Write-Host " FAILED" -ForegroundColor Red
        }
    }
}

# Default: Show service map
if (-not ($ShowDNS -or $Deploy -or $Test)) {
    Write-Info "OAK DRAGON COVENANT SERVICE MAP"
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($service in $Services.GetEnumerator()) {
        Write-Host "$($service.Key):" -ForegroundColor Cyan
        Write-Host "  URL:      $($service.Value.URL)" -ForegroundColor Blue
        Write-Host "  Purpose:  $($service.Value.Purpose)" -ForegroundColor Gray
        Write-Host "  Provider: $($service.Value.Provider)" -ForegroundColor Green
        Write-Host ""
    }
    
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\domain-setup.ps1 -ShowDNS    # Show DNS configuration"
    Write-Host "  .\domain-setup.ps1 -Deploy     # Deploy to all providers"
    Write-Host "  .\domain-setup.ps1 -Test       # Test domain endpoints"
}
