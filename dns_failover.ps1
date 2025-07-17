# Oak Dragon Covenant DNS Failover Script (PowerShell)
# Switches A record for @ and www to fallback IP using IONOS API

$IONOS_API_USER = $env:IONOS_API_USER
$IONOS_API_PASS = $env:IONOS_API_PASS
$DOMAIN = "oakdragoncovenant.com"
$FALLBACK_IP = "<Render_or_Railway_IP>"  # Set to backup IP

# Get Auth Token (pseudo-code, adjust for real IONOS API)
$tokenResponse = Invoke-RestMethod -Uri "https://api.ionos.com/auth/v1/tokens" -Method Post -Credential (New-Object System.Management.Automation.PSCredential($IONOS_API_USER,(ConvertTo-SecureString $IONOS_API_PASS -AsPlainText -Force)))
$token = $tokenResponse.token

foreach ($name in '@','www') {
    # Find record ID (pseudo-code, adjust for real IONOS API)
    $record = Invoke-RestMethod -Uri "https://api.ionos.com/dns/v1/zones/$DOMAIN/records?name=$name&type=A" -Headers @{Authorization = "Bearer $token"}
    $recordId = $record.items[0].id
    # Update record
    Invoke-RestMethod -Uri "https://api.ionos.com/dns/v1/zones/$DOMAIN/records/$recordId" -Method Put -Headers @{Authorization = "Bearer $token"} -ContentType 'application/json' -Body (@{content=$FALLBACK_IP;ttl=3600} | ConvertTo-Json)
}
