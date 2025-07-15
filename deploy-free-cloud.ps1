# ⚡ FREE CLOUD DEPLOYMENT MANAGER
# Automates deployment across Railway, Render, and Vercel free tiers
# Usage: .\deploy-free-cloud.ps1 -Provider railway -Service trading-bot

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("railway", "render", "vercel", "all")]
    [string]$Provider = "railway",
    
    [Parameter(Mandatory=$false)]
    [string]$Service = "oak-dragon-covenant",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "oakdragoncovenant.com",
    
    [Parameter(Mandatory=$false)]
    [switch]$Monitor,
    
    [Parameter(Mandatory=$false)]
    [switch]$Failover,
    
    [Parameter(Mandatory=$false)]
    [string]$FailoverFrom,
    
    [Parameter(Mandatory=$false)]
    [string]$FailoverTo
)

# Configuration
$Config = @{
    Railway = @{
        CLI = "railway"
        LoginCommand = "railway login"
        DeployCommand = "railway up"
        MonitorCommand = "railway status"
        FreeHours = 500
        URL = "https://api.oakdragoncovenant.com"
        Domain = "api.oakdragoncovenant.com"
        Purpose = "API Gateway & Core Services"
    }
    Render = @{
        CLI = "render"
        LoginCommand = "render auth login"
        DeployCommand = "render deploy"
        MonitorCommand = "render services list"
        FreeHours = 750
        URL = "https://trading.oakdragoncovenant.com"
        Domain = "trading.oakdragoncovenant.com"
        Purpose = "Trading Dashboard & Bot Interface"
    }
    Vercel = @{
        CLI = "vercel"
        LoginCommand = "vercel login"
        DeployCommand = "vercel --prod"
        MonitorCommand = "vercel ls"
        FreeHours = 1000
        URL = "https://dashboard.oakdragoncovenant.com"
        Domain = "dashboard.oakdragoncovenant.com"
        Purpose = "Command Center & Dashboard"
    }
}

# Utility Functions
function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    $timestamp = Get-Date -Format "HH:mm:ss"
    switch ($Type) {
        "Success" { Write-Host "[$timestamp] ✅ $Message" -ForegroundColor Green }
        "Error" { Write-Host "[$timestamp] ❌ $Message" -ForegroundColor Red }
        "Warning" { Write-Host "[$timestamp] ⚠️ $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "[$timestamp] ℹ️ $Message" -ForegroundColor Cyan }
        default { Write-Host "[$timestamp] $Message" }
    }
}

function Test-CLIAvailable {
    param([string]$CLI)
    try {
        $null = Get-Command $CLI -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Invoke-DeployToProvider {
    param([string]$ProviderName)
    
    $provider = $Config[$ProviderName]
    if (-not $provider) {
        Write-Status "Unknown provider: $ProviderName" "Error"
        return $false
    }
    
    Write-Status "🚀 Deploying $Service to $ProviderName..." "Info"
    
    # Check CLI availability
    if (-not (Test-CLIAvailable $provider.CLI)) {
        Write-Status "$ProviderName CLI not found. Please install $($provider.CLI)" "Error"
        return $false
    }
    
    try {
        # Provider-specific deployment logic
        switch ($ProviderName) {
            "Railway" {
                Write-Status "Deploying to Railway..." "Info"
                
                # Check if logged in
                $loginCheck = railway whoami 2>$null
                if (-not $loginCheck) {
                    Write-Status "Not logged into Railway. Please run: railway login" "Warning"
                    return $false
                }
                
                # Deploy
                railway up --detach
                if ($LASTEXITCODE -eq 0) {
                    Write-Status "Railway deployment successful! URL: $($provider.URL)" "Success"
                    return $true
                } else {
                    Write-Status "Railway deployment failed" "Error"
                    return $false
                }
            }
            
            "Render" {
                Write-Status "Deploying to Render..." "Info"
                
                # For Render, we'll use git-based deployment
                # Ensure we're in a git repository
                if (-not (Test-Path ".git")) {
                    Write-Status "Not in a git repository. Render requires git-based deployment." "Error"
                    return $false
                }
                
                # Push to trigger Render deployment
                git add .
                git commit -m "Deploy to Render - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
                git push origin main
                
                Write-Status "Code pushed to trigger Render deployment. URL: $($provider.URL)" "Success"
                return $true
            }
            
            "Vercel" {
                Write-Status "Deploying to Vercel..." "Info"
                
                # Check if logged in
                $loginCheck = vercel whoami 2>$null
                if (-not $loginCheck) {
                    Write-Status "Not logged into Vercel. Please run: vercel login" "Warning"
                    return $false
                }
                
                # Deploy
                vercel --prod --yes
                if ($LASTEXITCODE -eq 0) {
                    Write-Status "Vercel deployment successful! URL: $($provider.URL)" "Success"
                    return $true
                } else {
                    Write-Status "Vercel deployment failed" "Error"
                    return $false
                }
            }
        }
    } catch {
        Write-Status "Deployment to $ProviderName failed: $($_.Exception.Message)" "Error"
        return $false
    }
}

function Get-ProviderStatus {
    param([string]$ProviderName)
    
    $provider = $Config[$ProviderName]
    Write-Status "📊 Checking ${ProviderName} status..." "Info"
    
    try {
        switch ($ProviderName) {
            "Railway" {
                railway status 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Status "${ProviderName}: Operational" "Success"
                    return @{ Status = "Operational"; Provider = $ProviderName; URL = $provider.URL }
                } else {
                    Write-Status "${ProviderName}: Issues detected" "Warning"
                    return @{ Status = "Degraded"; Provider = $ProviderName; URL = $provider.URL }
                }
            }
            
            "Render" {
                # For Render, we'll do a simple HTTP check
                try {
                    $response = Invoke-WebRequest -Uri $provider.URL -TimeoutSec 10 -UseBasicParsing
                    if ($response.StatusCode -eq 200) {
                        Write-Status "${ProviderName}: Operational" "Success"
                        return @{ Status = "Operational"; Provider = $ProviderName; URL = $provider.URL }
                    }
                } catch {
                    Write-Status "${ProviderName}: HTTP check failed" "Warning"
                    return @{ Status = "Degraded"; Provider = $ProviderName; URL = $provider.URL }
                }
            }
            
            "Vercel" {
                vercel ls --scope personal 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Status "${ProviderName}: Operational" "Success"
                    return @{ Status = "Operational"; Provider = $ProviderName; URL = $provider.URL }
                } else {
                    Write-Status "${ProviderName}: Issues detected" "Warning"
                    return @{ Status = "Degraded"; Provider = $ProviderName; URL = $provider.URL }
                }
            }
        }
    } catch {
        Write-Status "$ProviderName status check failed: $($_.Exception.Message)" "Error"
        return @{ Status = "Error"; Provider = $ProviderName; URL = $provider.URL }
    }
}

function Invoke-Failover {
    param([string]$From, [string]$To)
    
    Write-Status "🔄 Initiating failover: $From → $To" "Info"
    
    # Check target provider health
    $targetStatus = Get-ProviderStatus $To
    if ($targetStatus.Status -ne "Operational") {
        Write-Status "Target provider $To is not operational. Failover aborted." "Error"
        return $false
    }
    
    # Deploy to target provider
    $deploySuccess = Invoke-DeployToProvider $To
    if (-not $deploySuccess) {
        Write-Status "Failed to deploy to target provider $To" "Error"
        return $false
    }
    
    # Update DNS/routing (simplified - in practice, update Cloudflare or DNS provider)
    Write-Status "Updating DNS routing to point to $To..." "Info"
    Write-Status "⚠️ Manual DNS update required: Point $Domain to $($Config[$To].URL)" "Warning"
    
    Write-Status "Failover completed: $From → $To" "Success"
    return $true
}

function Show-MultiCloudStatus {
    Write-Status "🌐 MULTI-CLOUD STATUS REPORT" "Info"
    Write-Host "=================================" -ForegroundColor Cyan
    
    $allStatuses = @()
    foreach ($providerName in $Config.Keys) {
        $status = Get-ProviderStatus $providerName
        $allStatuses += $status
        
        $statusColor = switch ($status.Status) {
            "Operational" { "Green" }
            "Degraded" { "Yellow" }
            "Error" { "Red" }
            default { "White" }
        }
        
        Write-Host "Provider: $($status.Provider)" -ForegroundColor White
        Write-Host "Status: $($status.Status)" -ForegroundColor $statusColor
        Write-Host "URL: $($status.URL)" -ForegroundColor Gray
        Write-Host "Free Hours: $($Config[$providerName].FreeHours)" -ForegroundColor Gray
        Write-Host "---------------------------------" -ForegroundColor Cyan
    }
    
    $operationalCount = ($allStatuses | Where-Object { $_.Status -eq "Operational" }).Count
    Write-Status "Operational Providers: $operationalCount/$($Config.Keys.Count)" "Info"
    
    if ($operationalCount -eq 0) {
        Write-Status "⚠️ NO OPERATIONAL PROVIDERS! Immediate attention required." "Error"
    } elseif ($operationalCount -eq 1) {
        Write-Status "⚠️ Only 1 operational provider. Consider checking others." "Warning"
    } else {
        Write-Status "✅ Multiple providers operational. System resilient." "Success"
    }
}

# Main execution logic
Write-Status "🚀 FREE CLOUD DEPLOYMENT MANAGER STARTED" "Info"
Write-Status "Service: $Service | Domain: $Domain" "Info"

try {
    if ($Monitor) {
        # Monitor mode
        Show-MultiCloudStatus
    }
    elseif ($Failover) {
        # Failover mode
        if (-not $FailoverFrom -or -not $FailoverTo) {
            Write-Status "Failover requires -FailoverFrom and -FailoverTo parameters" "Error"
            exit 1
        }
        
        $success = Invoke-Failover $FailoverFrom $FailoverTo
        if (-not $success) {
            exit 1
        }
    }
    elseif ($Provider -eq "all") {
        # Deploy to all providers
        Write-Status "Deploying to all providers..." "Info"
        $results = @()
        
        foreach ($providerName in $Config.Keys) {
            $success = Invoke-DeployToProvider $providerName
            $results += @{ Provider = $providerName; Success = $success }
        }
        
        # Summary
        $successCount = ($results | Where-Object { $_.Success }).Count
        Write-Status "Deployment Summary: $successCount/$($results.Count) successful" "Info"
        
        foreach ($result in $results) {
            $status = if ($result.Success) { "✅" } else { "❌" }
            Write-Host "$status $($result.Provider)"
        }
    }
    else {
        # Deploy to specific provider
        $success = Invoke-DeployToProvider $Provider
        if (-not $success) {
            exit 1
        }
    }
    
    Write-Status "🎉 FREE CLOUD DEPLOYMENT MANAGER COMPLETED SUCCESSFULLY" "Success"
    
} catch {
    Write-Status "Deployment manager failed: $($_.Exception.Message)" "Error"
    exit 1
}

# Usage examples
Write-Host ""
Write-Host "🔧 USAGE EXAMPLES:" -ForegroundColor Yellow
Write-Host "Deploy to Railway:        .\deploy-free-cloud.ps1 -Provider railway" -ForegroundColor Gray
Write-Host "Deploy to all providers:  .\deploy-free-cloud.ps1 -Provider all" -ForegroundColor Gray
Write-Host "Monitor all providers:    .\deploy-free-cloud.ps1 -Monitor" -ForegroundColor Gray
Write-Host "Failover Railway→Render:  .\deploy-free-cloud.ps1 -Failover -FailoverFrom railway -FailoverTo render" -ForegroundColor Gray
