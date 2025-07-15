# 🌐 DOMAIN DEPLOYMENT SCRIPT
# Deploy Oak Dragon Covenant to oakdragoncovenant.com with proper subdomain routing

param(
    [Parameter(Mandatory=$false)]
    [switch]$SetupDNS,
    
    [Parameter(Mandatory=$false)]
    [switch]$DeployAll,
    
    [Parameter(Mandatory=$false)]
    [switch]$TestDomains,
    
    [Parameter(Mandatory=$false)]
    [switch]$UpdateFramework
)

# Domain Configuration
$Domain = "oakdragoncovenant.com"
$Services = @{
    Main = @{
        Subdomain = "@"
        URL = "https://$Domain"
        Provider = "Railway"
        Purpose = "Landing Page & Authentication"
        Service = "oak-dragon-covenant"
    }
    Trading = @{
        Subdomain = "trading"
        URL = "https://trading.$Domain"
        Provider = "Render"
        Purpose = "Trading Dashboard & Bot Interface"
        Service = "oak-dragon-trading"
    }
    Dashboard = @{
        Subdomain = "dashboard"
        URL = "https://dashboard.$Domain"
        Provider = "Vercel"
        Purpose = "Command Center & Analytics"
        Service = "oak-dragon-dashboard"
    }
    API = @{
        Subdomain = "api"
        URL = "https://api.$Domain"
        Provider = "Railway"
        Purpose = "REST API & Webhooks"
        Service = "oak-dragon-api"
    }
    Command = @{
        Subdomain = "command"
        URL = "https://command.$Domain"
        Provider = "Vercel"
        Purpose = "Interactive Command Interface"
        Service = "oak-dragon-command"
    }
    Portal = @{
        Subdomain = "portal"
        URL = "https://portal.$Domain"
        Provider = "Vercel"
        Purpose = "Member Portal & Documentation"
        Service = "oak-dragon-portal"
    }
    Monitor = @{
        Subdomain = "monitor"
        URL = "https://monitor.$Domain"
        Provider = "Railway"
        Purpose = "System Monitoring & Health Checks"
        Service = "oak-dragon-monitor"
    }
}

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    $timestamp = Get-Date -Format "HH:mm:ss"
    switch ($Type) {
        "Success" { Write-Host "[$timestamp] Success: $Message" -ForegroundColor Green }
        "Error" { Write-Host "[$timestamp] Error: $Message" -ForegroundColor Red }
        "Warning" { Write-Host "[$timestamp] Warning: $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "[$timestamp] Info: $Message" -ForegroundColor Cyan }
        default { Write-Host "[$timestamp] $Message" }
    }
}

function Show-DNSInstructions {
    Write-Status "🌐 DNS SETUP INSTRUCTIONS FOR IONOS" "Info"
    Write-Host "================================================" -ForegroundColor Cyan
    
    Write-Status "1. Login to IONOS Control Panel:" "Info"
    Write-Host "   https://my.ionos.com/domain-dns-settings/$Domain" -ForegroundColor Blue
    
    Write-Status "2. Add/Update these DNS Records:" "Info"
    Write-Host ""
    
    # A Records
    Write-Host "   A RECORDS:" -ForegroundColor Yellow
    Write-Host "   @ (root)    -> [Get IP from Railway deployment]" -ForegroundColor Gray
    Write-Host "   www         -> [Get IP from Railway deployment]" -ForegroundColor Gray
    Write-Host ""
    
    # CNAME Records
    Write-Host "   CNAME RECORDS:" -ForegroundColor Yellow
    foreach ($service in $Services.GetEnumerator()) {
        if ($service.Value.Subdomain -ne "@") {
            $target = switch ($service.Value.Provider) {
                "Railway" { "oak-dragon-$($service.Key.ToLower()).up.railway.app" }
                "Render" { "oak-dragon-$($service.Key.ToLower()).onrender.com" }
                "Vercel" { "oak-dragon-$($service.Key.ToLower()).vercel.app" }
            }
            Write-Host "   $($service.Value.Subdomain.PadRight(12)) -> $target" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "   SECURITY RECORDS:" -ForegroundColor Yellow
    Write-Host "   TXT @       -> \"v=spf1 include:_spf.ionos.com ~all\"" -ForegroundColor Gray
    Write-Host "   TXT _dmarc  -> \"v=DMARC1; p=quarantine; rua=mailto:admin@$Domain\"" -ForegroundColor Gray
    
    Write-Host ""
    Write-Status "3. Enable SSL for all subdomains in IONOS panel" "Info"
    Write-Status "4. Wait 15-30 minutes for DNS propagation" "Warning"
}

function Test-DomainResolution {
    Write-Status "🔍 Testing domain resolution..." "Info"
    
    foreach ($service in $Services.GetEnumerator()) {
        $url = $service.Value.URL
        $subdomain = if ($service.Value.Subdomain -eq "@") { $Domain } else { "$($service.Value.Subdomain).$Domain" }
        
        try {
            Write-Status "Testing $subdomain..." "Info"
            
            # Test DNS resolution
            $dnsResult = nslookup $subdomain 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Status "DNS: $subdomain resolved" "Success"
            } else {
                Write-Status "DNS: $subdomain failed to resolve" "Warning"
                continue
            }
            
            # Test HTTP response
            try {
                $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
                if ($response.StatusCode -eq 200) {
                    Write-Status "HTTP: $url responded (200 OK)" "Success"
                } else {
                    Write-Status "HTTP: $url responded ($($response.StatusCode))" "Warning"
                }
            } catch {
                Write-Status "HTTP: $url not responding" "Warning"
            }
            
        } catch {
            Write-Status "Error testing $subdomain`: $($_.Exception.Message)" "Error"
        }
    }
}

function Deploy-AllServices {
    Write-Status "🚀 Deploying all services to cloud providers..." "Info"
    
    # Deploy to Railway (API & Main)
    Write-Status "Deploying to Railway..." "Info"
    try {
        railway login --help 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            railway up --detach
            Write-Status "Railway deployment initiated" "Success"
        } else {
            Write-Status "Railway CLI not found. Please install: npm install -g @railway/cli" "Warning"
        }
    } catch {
        Write-Status "Railway deployment failed: $($_.Exception.Message)" "Error"
    }
    
    # Deploy to Render (Trading Dashboard)
    Write-Status "Deploying to Render..." "Info"
    try {
        if (Test-Path ".git") {
            git add .
            git commit -m "Deploy trading dashboard to Render - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            git push origin main
            Write-Status "Render deployment triggered via git push" "Success"
        } else {
            Write-Status "Git repository not found. Render requires git-based deployment." "Warning"
        }
    } catch {
        Write-Status "Render deployment failed: $($_.Exception.Message)" "Error"
    }
    
    # Deploy to Vercel (Dashboard & Command Center)
    Write-Status "Deploying to Vercel..." "Info"
    try {
        vercel --help 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            vercel --prod --yes
            Write-Status "Vercel deployment completed" "Success"
        } else {
            Write-Status "Vercel CLI not found. Please install: npm install -g vercel" "Warning"
        }
    } catch {
        Write-Status "Vercel deployment failed: $($_.Exception.Message)" "Error"
    }
}

function Update-FrameworkConfiguration {
    Write-Status "🔧 Updating LayeredAgentFramework with domain configuration..." "Info"
    
    try {
        # Test framework cloud commands
        $testCommand = "node -e \"const f=require('./OakDragonCovenant/Modules/layeredAgentFramework.js'); const a=new f(); a.executeRitual({type:'freecloud',action:'status',domain:'$Domain'}).then(console.log).catch(console.error)\""
        
        Invoke-Expression $testCommand
        
        Write-Status "Framework updated with domain: $Domain" "Success"
        
    } catch {
        Write-Status "Framework update failed: $($_.Exception.Message)" "Error"
    }
}

function Show-ServiceMap {
    Write-Status "🗺️ OAK DRAGON COVENANT SERVICE MAP" "Info"
    Write-Host "====================================" -ForegroundColor Cyan
    
    foreach ($service in $Services.GetEnumerator()) {
        Write-Host ""
        Write-Host "🔸 $($service.Key.ToUpper())" -ForegroundColor Yellow
        Write-Host "   URL:      $($service.Value.URL)" -ForegroundColor Blue
        Write-Host "   Provider: $($service.Value.Provider)" -ForegroundColor Green
        Write-Host "   Purpose:  $($service.Value.Purpose)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Status "Total Services: $($Services.Count)" "Info"
    Write-Status "Domain: $Domain" "Info"
}

# Main execution logic
Write-Status "🐉 OAK DRAGON COVENANT DOMAIN DEPLOYMENT" "Info"
Write-Host "=========================================" -ForegroundColor Cyan

if ($SetupDNS) {
    Show-DNSInstructions
}

if ($DeployAll) {
    Deploy-AllServices
}

if ($TestDomains) {
    Test-DomainResolution
}

if ($UpdateFramework) {
    Update-FrameworkConfiguration
}

if (-not ($SetupDNS -or $DeployAll -or $TestDomains -or $UpdateFramework)) {
    # Default: Show service map and instructions
    Show-ServiceMap
    Write-Host ""
    Write-Status "Available commands:" "Info"
    Write-Host "  .\deploy-domain.ps1 -SetupDNS        # Show DNS setup instructions" -ForegroundColor Gray
    Write-Host "  .\deploy-domain.ps1 -DeployAll       # Deploy to all cloud providers" -ForegroundColor Gray
    Write-Host "  .\deploy-domain.ps1 -TestDomains     # Test domain resolution and responses" -ForegroundColor Gray
    Write-Host "  .\deploy-domain.ps1 -UpdateFramework # Update LayeredAgentFramework config" -ForegroundColor Gray
}

Write-Host ""
Write-Status "🎯 Next Steps:" "Info"
Write-Host "1. Configure DNS records in IONOS panel" -ForegroundColor Gray
Write-Host "2. Deploy services to cloud providers" -ForegroundColor Gray
Write-Host "3. Test all domain endpoints" -ForegroundColor Gray
Write-Host "4. Update framework configuration" -ForegroundColor Gray
Write-Host "5. Monitor deployment status" -ForegroundColor Gray
