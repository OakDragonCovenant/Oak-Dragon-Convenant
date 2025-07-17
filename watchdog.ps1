# Oak Dragon Covenant Watchdog Script (PowerShell)
# Monitors Node.js, PM2, and NGINX. If any are down, restarts them and triggers security alert.
# If all fail, triggers DNS failover via IONOS API (see dns_failover.ps1)

$SECURITY_WEBHOOK = "https://your-real-webhook-or-api-url"
$FALLBACK_IP = "<Render_or_Railway_IP>"  # Set to backup IP

$fail = $false

# Check NGINX
if (-not (Get-Service nginx -ErrorAction SilentlyContinue | Where-Object {$_.Status -eq 'Running'})) {
    Restart-Service nginx -Force
    $fail = $true
}
# Check PM2
if (-not (Get-Process pm2 -ErrorAction SilentlyContinue)) {
    Start-Process pm2
    $fail = $true
}
# Check Node
if (-not (Get-Process node -ErrorAction SilentlyContinue)) {
    Start-Process pm2
    $fail = $true
}

# Security Alert if any restart
if ($fail) {
    Invoke-RestMethod -Uri $SECURITY_WEBHOOK -Method Post -Body (@{event='service_restart';host=$env:COMPUTERNAME} | ConvertTo-Json) -ContentType 'application/json'
}

# If still down, trigger DNS failover
if ((-not (Get-Service nginx -ErrorAction SilentlyContinue | Where-Object {$_.Status -eq 'Running'})) -or (-not (Get-Process node -ErrorAction SilentlyContinue))) {
    .\dns_failover.ps1
}
