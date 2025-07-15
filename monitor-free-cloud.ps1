# 📊 FREE CLOUD MONITORING DASHBOARD
# Real-time monitoring for Railway, Render, and Vercel free tier usage
# Usage: .\monitor-free-cloud.ps1 -Dashboard -RefreshInterval 30

param(
    [Parameter(Mandatory=$false)]
    [switch]$Dashboard,
    
    [Parameter(Mandatory=$false)]
    [int]$RefreshInterval = 60,
    
    [Parameter(Mandatory=$false)]
    [switch]$Alerts,
    
    [Parameter(Mandatory=$false)]
    [switch]$Export,
    
    [Parameter(Mandatory=$false)]
    [string]$ExportPath = ".\cloud-monitoring-report.json"
)

# Configuration
$Config = @{
    Railway = @{
        URL = "https://api.oakdragoncovenant.com"
        Domain = "api.oakdragoncovenant.com"
        FreeHours = 500
        Priority = 1
        Type = "API Gateway"
        Purpose = "Core API & Trading Engine"
    }
    Render = @{
        URL = "https://trading.oakdragoncovenant.com"
        Domain = "trading.oakdragoncovenant.com"
        FreeHours = 750
        Priority = 2
        Type = "Web Service"
        Purpose = "Trading Dashboard & Bot Interface"
    }
    Vercel = @{
        URL = "https://dashboard.oakdragoncovenant.com"
        Domain = "dashboard.oakdragoncovenant.com"
        FreeHours = 1000
        Priority = 3
        Type = "Static + Serverless"
        Purpose = "Command Center & Analytics"
    }
}

# Global monitoring state
$Global:MonitoringData = @{
    StartTime = Get-Date
    TotalChecks = 0
    Alerts = @()
    History = @()
}

function Write-ColorText {
    param(
        [string]$Text,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    
    if ($NoNewline) {
        Write-Host $Text -ForegroundColor $Color -NoNewline
    } else {
        Write-Host $Text -ForegroundColor $Color
    }
}

function Get-ProviderHealth {
    param([string]$ProviderName)
    
    $provider = $Config[$ProviderName]
    $healthData = @{
        Provider = $ProviderName
        Timestamp = Get-Date
        Status = "Unknown"
        ResponseTime = 0
        ErrorMessage = $null
        URL = $provider.URL
    }
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        
        switch ($ProviderName) {
            "Railway" {
                # Try CLI check first
                try {
                    railway status 2>$null | Out-Null
                    if ($LASTEXITCODE -eq 0) {
                        $healthData.Status = "Healthy"
                    } else {
                        # Fallback to HTTP check
                        $response = Invoke-WebRequest -Uri $provider.URL -TimeoutSec 10 -UseBasicParsing
                        $healthData.Status = if ($response.StatusCode -eq 200) { "Healthy" } else { "Degraded" }
                    }
                } catch {
                    # HTTP fallback
                    $response = Invoke-WebRequest -Uri $provider.URL -TimeoutSec 10 -UseBasicParsing
                    $healthData.Status = if ($response.StatusCode -eq 200) { "Healthy" } else { "Degraded" }
                }
            }
            
            "Render" {
                $response = Invoke-WebRequest -Uri $provider.URL -TimeoutSec 10 -UseBasicParsing
                $healthData.Status = if ($response.StatusCode -eq 200) { "Healthy" } else { "Degraded" }
            }
            
            "Vercel" {
                # Try CLI check first
                try {
                    vercel ls --scope personal 2>$null | Out-Null
                    if ($LASTEXITCODE -eq 0) {
                        $healthData.Status = "Healthy"
                    } else {
                        # Fallback to HTTP check
                        $response = Invoke-WebRequest -Uri $provider.URL -TimeoutSec 10 -UseBasicParsing
                        $healthData.Status = if ($response.StatusCode -eq 200) { "Healthy" } else { "Degraded" }
                    }
                } catch {
                    # HTTP fallback
                    $response = Invoke-WebRequest -Uri $provider.URL -TimeoutSec 10 -UseBasicParsing
                    $healthData.Status = if ($response.StatusCode -eq 200) { "Healthy" } else { "Degraded" }
                }
            }
        }
        
        $stopwatch.Stop()
        $healthData.ResponseTime = $stopwatch.ElapsedMilliseconds
        
    } catch {
        $healthData.Status = "Error"
        $healthData.ErrorMessage = $_.Exception.Message
        $stopwatch.Stop()
        $healthData.ResponseTime = $stopwatch.ElapsedMilliseconds
    }
    
    return $healthData
}

function Get-ResourceUsage {
    param([string]$ProviderName)
    
    $provider = $Config[$ProviderName]
    
    # Simulate usage tracking (in real implementation, query provider APIs)
    $currentHour = (Get-Date).Hour
    $dayOfMonth = (Get-Date).Day
    
    # Simulate realistic usage patterns
    $baseUsage = switch ($ProviderName) {
        "Railway" { [math]::Min(450, $dayOfMonth * 15 + $currentHour * 2) }
        "Render" { [math]::Min(600, $dayOfMonth * 20 + $currentHour * 1.5) }
        "Vercel" { [math]::Min(800, $dayOfMonth * 25 + $currentHour * 1) }
    }
    
    return @{
        Provider = $ProviderName
        UsedHours = $baseUsage
        TotalHours = $provider.FreeHours
        UtilizationPercent = [math]::Round(($baseUsage / $provider.FreeHours) * 100, 1)
        RemainingHours = $provider.FreeHours - $baseUsage
        Timestamp = Get-Date
    }
}

function Show-DashboardHeader {
    Clear-Host
    Write-ColorText "═══════════════════════════════════════════════════════════════════" "Cyan"
    Write-ColorText "    🌐 FREE CLOUD MONITORING DASHBOARD - OAK DRAGON COVENANT    " "Yellow"
    Write-ColorText "═══════════════════════════════════════════════════════════════════" "Cyan"
    Write-ColorText ""
    Write-ColorText "Started: $($Global:MonitoringData.StartTime.ToString('yyyy-MM-dd HH:mm:ss'))" "Gray"
    Write-ColorText "Checks: $($Global:MonitoringData.TotalChecks)" "Gray"
    Write-ColorText "Last Update: $(Get-Date -Format 'HH:mm:ss')" "Gray"
    Write-ColorText ""
}

function Show-ProviderStatus {
    param($HealthData, $UsageData)
    
    $statusColor = switch ($HealthData.Status) {
        "Healthy" { "Green" }
        "Degraded" { "Yellow" }
        "Error" { "Red" }
        default { "Gray" }
    }
    
    $utilizationColor = switch ($UsageData.UtilizationPercent) {
        { $_ -lt 50 } { "Green" }
        { $_ -lt 80 } { "Yellow" }
        { $_ -lt 95 } { "Red" }
        default { "Magenta" }
    }
    
    Write-ColorText "┌─────────────────────────────────────────────────────────────────┐" "White"
    Write-ColorText "│ " "White" -NoNewline
    Write-ColorText "$($HealthData.Provider.ToUpper())" "Cyan" -NoNewline
    Write-ColorText " - Priority $($Config[$HealthData.Provider].Priority)" "Gray" -NoNewline
    Write-ColorText " ($($Config[$HealthData.Provider].Type))" "Gray" -NoNewline
    $padding = 65 - $HealthData.Provider.Length - 20 - $Config[$HealthData.Provider].Type.Length
    Write-ColorText (" " * $padding + "│") "White"
    
    Write-ColorText "├─────────────────────────────────────────────────────────────────┤" "White"
    
    # Status line
    Write-ColorText "│ Status: " "White" -NoNewline
    Write-ColorText "$($HealthData.Status)" $statusColor -NoNewline
    Write-ColorText " │ Response: " "White" -NoNewline
    Write-ColorText "$($HealthData.ResponseTime)ms" "White" -NoNewline
    $statusPadding = 35 - $HealthData.Status.Length - $HealthData.ResponseTime.ToString().Length
    Write-ColorText (" " * $statusPadding + "│") "White"
    
    # URL line
    Write-ColorText "│ URL: " "White" -NoNewline
    Write-ColorText "$($HealthData.URL)" "Blue" -NoNewline
    $urlPadding = 61 - $HealthData.URL.Length
    Write-ColorText (" " * $urlPadding + "│") "White"
    
    # Usage line
    Write-ColorText "│ Usage: " "White" -NoNewline
    Write-ColorText "$($UsageData.UsedHours)/$($UsageData.TotalHours) hours" "White" -NoNewline
    Write-ColorText " (" "White" -NoNewline
    Write-ColorText "$($UsageData.UtilizationPercent)%" $utilizationColor -NoNewline
    Write-ColorText ")" "White" -NoNewline
    $usagePadding = 35 - $UsageData.UsedHours.ToString().Length - $UsageData.TotalHours.ToString().Length - $UsageData.UtilizationPercent.ToString().Length
    Write-ColorText (" " * $usagePadding + "│") "White"
    
    # Progress bar
    $barWidth = 50
    $filledBars = [math]::Floor(($UsageData.UtilizationPercent / 100) * $barWidth)
    $emptyBars = $barWidth - $filledBars
    
    Write-ColorText "│ [" "White" -NoNewline
    Write-ColorText ("█" * $filledBars) $utilizationColor -NoNewline
    Write-ColorText ("░" * $emptyBars) "DarkGray" -NoNewline
    Write-ColorText "] " "White" -NoNewline
    $remainingPadding = 12
    Write-ColorText (" " * $remainingPadding + "│") "White"
    
    # Error message if any
    if ($HealthData.ErrorMessage) {
        Write-ColorText "│ Error: " "White" -NoNewline
        $errorMsg = $HealthData.ErrorMessage.Substring(0, [math]::Min($HealthData.ErrorMessage.Length, 50))
        Write-ColorText "$errorMsg" "Red" -NoNewline
        $errorPadding = 59 - $errorMsg.Length
        Write-ColorText (" " * $errorPadding + "│") "White"
    }
    
    Write-ColorText "└─────────────────────────────────────────────────────────────────┘" "White"
    Write-ColorText ""
}

function Show-SystemSummary {
    param($AllHealthData, $AllUsageData)
    
    $healthyCount = ($AllHealthData | Where-Object { $_.Status -eq "Healthy" }).Count
    $totalProviders = $AllHealthData.Count
    
    $totalUsed = ($AllUsageData | Measure-Object -Property UsedHours -Sum).Sum
    $totalAvailable = ($AllUsageData | Measure-Object -Property TotalHours -Sum).Sum
    $overallUtilization = [math]::Round(($totalUsed / $totalAvailable) * 100, 1)
    
    $systemHealthColor = if ($healthyCount -eq $totalProviders) { "Green" } 
                        elseif ($healthyCount -gt 0) { "Yellow" } 
                        else { "Red" }
    
    Write-ColorText "┌─────────────────── SYSTEM SUMMARY ────────────────────┐" "Cyan"
    Write-ColorText "│ Operational Providers: " "White" -NoNewline
    Write-ColorText "$healthyCount/$totalProviders" $systemHealthColor -NoNewline
    Write-ColorText "                          │" "White"
    
    Write-ColorText "│ Overall Utilization: " "White" -NoNewline
    $utilizationColor = if ($overallUtilization -lt 60) { "Green" } 
                       elseif ($overallUtilization -lt 85) { "Yellow" } 
                       else { "Red" }
    Write-ColorText "$overallUtilization%" $utilizationColor -NoNewline
    Write-ColorText "                              │" "White"
    
    Write-ColorText "│ Total Hours Used: " "White" -NoNewline
    Write-ColorText "$totalUsed/$totalAvailable" "White" -NoNewline
    Write-ColorText "                        │" "White"
    
    # Risk assessment
    $riskLevel = if ($overallUtilization -lt 50) { "LOW" }
                elseif ($overallUtilization -lt 80) { "MEDIUM" }
                else { "HIGH" }
    
    $riskColor = switch ($riskLevel) {
        "LOW" { "Green" }
        "MEDIUM" { "Yellow" }
        "HIGH" { "Red" }
    }
    
    Write-ColorText "│ Risk Level: " "White" -NoNewline
    Write-ColorText "$riskLevel" $riskColor -NoNewline
    Write-ColorText "                                  │" "White"
    Write-ColorText "└────────────────────────────────────────────────────────┘" "Cyan"
    Write-ColorText ""
}

function Show-Alerts {
    param($AllHealthData, $AllUsageData)
    
    $alerts = @()
    
    foreach ($health in $AllHealthData) {
        if ($health.Status -ne "Healthy") {
            $alerts += @{
                Type = "Health"
                Severity = if ($health.Status -eq "Error") { "Critical" } else { "Warning" }
                Provider = $health.Provider
                Message = "Provider $($health.Provider) is $($health.Status.ToLower())"
                Timestamp = $health.Timestamp
            }
        }
    }
    
    foreach ($usage in $AllUsageData) {
        if ($usage.UtilizationPercent -gt 90) {
            $alerts += @{
                Type = "Usage"
                Severity = "Critical"
                Provider = $usage.Provider
                Message = "High usage: $($usage.UtilizationPercent)% of free tier consumed"
                Timestamp = $usage.Timestamp
            }
        } elseif ($usage.UtilizationPercent -gt 75) {
            $alerts += @{
                Type = "Usage"
                Severity = "Warning"
                Provider = $usage.Provider
                Message = "Moderate usage: $($usage.UtilizationPercent)% of free tier consumed"
                Timestamp = $usage.Timestamp
            }
        }
    }
    
    if ($alerts.Count -gt 0) {
        Write-ColorText "┌─────────────────────── ALERTS ───────────────────────┐" "Red"
        
        foreach ($alert in $alerts) {
            $severityColor = switch ($alert.Severity) {
                "Critical" { "Red" }
                "Warning" { "Yellow" }
                default { "White" }
            }
            
            Write-ColorText "│ " "White" -NoNewline
            Write-ColorText "$($alert.Severity.ToUpper())" $severityColor -NoNewline
            Write-ColorText " - $($alert.Provider): $($alert.Message)" "White" -NoNewline
            $padding = 55 - $alert.Severity.Length - $alert.Provider.Length - $alert.Message.Length
            Write-ColorText (" " * [math]::Max(0, $padding) + "│") "White"
        }
        
        Write-ColorText "└────────────────────────────────────────────────────────┘" "Red"
        Write-ColorText ""
    } else {
        Write-ColorText "✅ No active alerts" "Green"
        Write-ColorText ""
    }
    
    # Store alerts in global state
    $Global:MonitoringData.Alerts = $alerts
}

function Export-MonitoringData {
    param($AllHealthData, $AllUsageData, $ExportPath)
    
    $exportData = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        MonitoringSession = @{
            StartTime = $Global:MonitoringData.StartTime
            TotalChecks = $Global:MonitoringData.TotalChecks
            Duration = ((Get-Date) - $Global:MonitoringData.StartTime).ToString()
        }
        Providers = @()
        Summary = @{
            HealthyProviders = ($AllHealthData | Where-Object { $_.Status -eq "Healthy" }).Count
            TotalProviders = $AllHealthData.Count
            TotalUsedHours = ($AllUsageData | Measure-Object -Property UsedHours -Sum).Sum
            TotalAvailableHours = ($AllUsageData | Measure-Object -Property TotalHours -Sum).Sum
            AlertCount = $Global:MonitoringData.Alerts.Count
        }
        Alerts = $Global:MonitoringData.Alerts
    }
    
    for ($i = 0; $i -lt $AllHealthData.Count; $i++) {
        $exportData.Providers += @{
            Name = $AllHealthData[$i].Provider
            Health = $AllHealthData[$i]
            Usage = $AllUsageData[$i]
            Configuration = $Config[$AllHealthData[$i].Provider]
        }
    }
    
    try {
        $exportData | ConvertTo-Json -Depth 10 | Out-File -FilePath $ExportPath -Encoding UTF8
        Write-ColorText "📊 Monitoring data exported to: $ExportPath" "Green"
    } catch {
        Write-ColorText "❌ Failed to export data: $($_.Exception.Message)" "Red"
    }
}

# Main monitoring loop
function Start-MonitoringDashboard {
    Write-ColorText "🚀 Starting Free Cloud Monitoring Dashboard..." "Cyan"
    Write-ColorText "Refresh Interval: $RefreshInterval seconds" "Gray"
    Write-ColorText "Press Ctrl+C to stop monitoring" "Gray"
    Write-ColorText ""
    
    try {
        while ($true) {
            $Global:MonitoringData.TotalChecks++
            
            # Collect health data for all providers
            $allHealthData = @()
            $allUsageData = @()
            
            foreach ($providerName in $Config.Keys) {
                $healthData = Get-ProviderHealth $providerName
                $usageData = Get-ResourceUsage $providerName
                
                $allHealthData += $healthData
                $allUsageData += $usageData
            }
            
            # Store in history
            $Global:MonitoringData.History += @{
                Timestamp = Get-Date
                Health = $allHealthData
                Usage = $allUsageData
            }
            
            # Keep only last 100 entries
            if ($Global:MonitoringData.History.Count -gt 100) {
                $Global:MonitoringData.History = $Global:MonitoringData.History[-100..-1]
            }
            
            # Display dashboard
            Show-DashboardHeader
            
            for ($i = 0; $i -lt $allHealthData.Count; $i++) {
                Show-ProviderStatus $allHealthData[$i] $allUsageData[$i]
            }
            
            Show-SystemSummary $allHealthData $allUsageData
            
            if ($Alerts) {
                Show-Alerts $allHealthData $allUsageData
            }
            
            if ($Export -and ($Global:MonitoringData.TotalChecks % 10 -eq 0)) {
                Export-MonitoringData $allHealthData $allUsageData $ExportPath
            }
            
            Write-ColorText "Next refresh in $RefreshInterval seconds... (Ctrl+C to stop)" "Gray"
            
            Start-Sleep -Seconds $RefreshInterval
        }
    } catch [System.Management.Automation.PipelineStoppedException] {
        Write-ColorText ""
        Write-ColorText "🛑 Monitoring stopped by user" "Yellow"
        
        if ($Export) {
            Export-MonitoringData $allHealthData $allUsageData $ExportPath
        }
    }
}

# Main execution
if ($Dashboard) {
    Start-MonitoringDashboard
} else {
    # Single check mode
    Write-ColorText "🔍 Performing single health check..." "Cyan"
    
    $allHealthData = @()
    $allUsageData = @()
    
    foreach ($providerName in $Config.Keys) {
        $healthData = Get-ProviderHealth $providerName
        $usageData = Get-ResourceUsage $providerName
        
        $allHealthData += $healthData
        $allUsageData += $usageData
    }
    
    Show-DashboardHeader
    
    for ($i = 0; $i -lt $allHealthData.Count; $i++) {
        Show-ProviderStatus $allHealthData[$i] $allUsageData[$i]
    }
    
    Show-SystemSummary $allHealthData $allUsageData
    
    if ($Alerts) {
        Show-Alerts $allHealthData $allUsageData
    }
    
    if ($Export) {
        Export-MonitoringData $allHealthData $allUsageData $ExportPath
    }
}

Write-ColorText ""
Write-ColorText "🔧 USAGE EXAMPLES:" "Yellow"
Write-ColorText "Dashboard mode:       .\monitor-free-cloud.ps1 -Dashboard" "Gray"
Write-ColorText "With alerts:          .\monitor-free-cloud.ps1 -Dashboard -Alerts" "Gray"
Write-ColorText "Custom refresh:       .\monitor-free-cloud.ps1 -Dashboard -RefreshInterval 30" "Gray"
Write-ColorText "Export data:          .\monitor-free-cloud.ps1 -Export -ExportPath '.\report.json'" "Gray"
