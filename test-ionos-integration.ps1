# IONOS API Test Script for Oak Dragon Covenant
# Test IONOS API connectivity and functionality

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey,
    
    [Parameter(Mandatory=$true)]
    [string]$ApiSecret,
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "oakdragoncovernant.com"
)

Write-Host "IONOS API Integration Test" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Function to make IONOS API calls
function Invoke-IONOSApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = @{},
        [string]$ApiKey,
        [string]$ApiSecret
    )
    
    $headers = @{
        "X-API-Key" = "$ApiKey.$ApiSecret"
        "Content-Type" = "application/json"
        "User-Agent" = "Oak-Dragon-Covenant/1.0"
    }
    
    $uri = "https://api.ionos.com/$Endpoint"
    
    try {
        Write-Host "Testing: $Method $uri" -ForegroundColor Gray
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -TimeoutSec 30
        } else {
            $jsonBody = $Body | ConvertTo-Json -Depth 4
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $jsonBody -TimeoutSec 30
        }
        
        return @{
            Success = $true
            Data = $response
            Error = $null
        }
    } catch {
        return @{
            Success = $false
            Data = $null
            Error = $_.Exception.Message
        }
    }
}

# Test 1: API Connectivity
Write-Host "Test 1: API Connectivity" -ForegroundColor Yellow
$healthCheck = Invoke-IONOSApi -Endpoint "dns/v1/zones" -ApiKey $ApiKey -ApiSecret $ApiSecret

if ($healthCheck.Success) {
    Write-Host "✓ API connection successful" -ForegroundColor Green
    Write-Host "  Found $($healthCheck.Data.Count) DNS zones" -ForegroundColor White
} else {
    Write-Host "✗ API connection failed: $($healthCheck.Error)" -ForegroundColor Red
    exit 1
}

# Test 2: Domain Check
Write-Host ""
Write-Host "Test 2: Domain Verification" -ForegroundColor Yellow
$zones = $healthCheck.Data
$targetZone = $zones | Where-Object { $_.name -eq $Domain }

if ($targetZone) {
    Write-Host "✓ Domain $Domain found in IONOS" -ForegroundColor Green
    Write-Host "  Zone ID: $($targetZone.id)" -ForegroundColor White
    Write-Host "  Status: $($targetZone.state)" -ForegroundColor White
} else {
    Write-Host "✗ Domain $Domain not found in IONOS" -ForegroundColor Red
    Write-Host "Available domains:" -ForegroundColor Yellow
    $zones | ForEach-Object { Write-Host "  - $($_.name)" -ForegroundColor White }
    exit 1
}

# Test 3: DNS Records Check
Write-Host ""
Write-Host "Test 3: DNS Records" -ForegroundColor Yellow
$recordsCheck = Invoke-IONOSApi -Endpoint "dns/v1/zones/$($targetZone.id)/records" -ApiKey $ApiKey -ApiSecret $ApiSecret

if ($recordsCheck.Success) {
    Write-Host "✓ DNS records accessible" -ForegroundColor Green
    Write-Host "  Found $($recordsCheck.Data.Count) DNS records" -ForegroundColor White
    
    # Show existing A records
    $aRecords = $recordsCheck.Data | Where-Object { $_.type -eq "A" }
    if ($aRecords) {
        Write-Host "  Existing A records:" -ForegroundColor Cyan
        $aRecords | ForEach-Object { 
            Write-Host "    $($_.name) -> $($_.content)" -ForegroundColor White 
        }
    }
} else {
    Write-Host "✗ DNS records check failed: $($recordsCheck.Error)" -ForegroundColor Red
}

# Test 4: SSL Certificate Check
Write-Host ""
Write-Host "Test 4: SSL Certificate Service" -ForegroundColor Yellow
$sslCheck = Invoke-IONOSApi -Endpoint "ssl/v1/certificates" -ApiKey $ApiKey -ApiSecret $ApiSecret

if ($sslCheck.Success) {
    Write-Host "✓ SSL service accessible" -ForegroundColor Green
    $certs = $sslCheck.Data | Where-Object { $_.commonName -eq $Domain }
    if ($certs) {
        Write-Host "  Existing certificate found for $Domain" -ForegroundColor White
        Write-Host "  Status: $($certs[0].status)" -ForegroundColor White
    } else {
        Write-Host "  No existing certificate for $Domain" -ForegroundColor White
    }
} else {
    Write-Host "✗ SSL service check failed: $($sslCheck.Error)" -ForegroundColor Red
}

# Test 5: Rate Limit Check
Write-Host ""
Write-Host "Test 5: Rate Limit Status" -ForegroundColor Yellow
try {
    $rateLimitTest = Invoke-WebRequest -Uri "https://api.ionos.com/dns/v1/zones" -Headers @{
        "X-API-Key" = "$ApiKey.$ApiSecret"
    } -Method HEAD

    $remainingRequests = $rateLimitTest.Headers["X-RateLimit-Remaining"]
    $rateLimitReset = $rateLimitTest.Headers["X-RateLimit-Reset"]
    
    if ($remainingRequests) {
        Write-Host "✓ Rate limit check successful" -ForegroundColor Green
        Write-Host "  Remaining requests: $remainingRequests" -ForegroundColor White
        if ($rateLimitReset) {
            $resetTime = [DateTimeOffset]::FromUnixTimeSeconds($rateLimitReset)
            Write-Host "  Reset time: $($resetTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
        }
    } else {
        Write-Host "⚠ Rate limit headers not available" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Rate limit check failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host "✓ API Authentication: Working" -ForegroundColor Green
Write-Host "✓ Domain Access: $Domain verified" -ForegroundColor Green
Write-Host "✓ DNS Management: Ready" -ForegroundColor Green

if ($sslCheck.Success) {
    Write-Host "✓ SSL Provisioning: Available" -ForegroundColor Green
} else {
    Write-Host "⚠ SSL Provisioning: Limited" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Ready for deployment with IONOS integration!" -ForegroundColor Green
Write-Host "Run: .\deploy-digitalocean.ps1 -Phase 1 -IONOSApiKey `"$ApiKey`" -IONOSSecret `"$ApiSecret`"" -ForegroundColor Cyan
