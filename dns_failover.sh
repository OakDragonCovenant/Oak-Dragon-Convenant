# --- LOGGING ---
LOG_FILE="/var/log/oakdragon_failover.log"
touch "$LOG_FILE"

# --- HEALTH CHECK FUNCTION ---
health_check() {
  local url=$1
  local label=$2
  for i in {1..5}; do
    if curl -fsS --max-time 5 "$url" >/dev/null; then
      echo "[INFO] Health check passed for $label ($url)" | tee -a "$LOG_FILE"
      return 0
    fi
    sleep 5
  done
  echo "[ERROR] Health check failed for $label ($url)" | tee -a "$LOG_FILE"
  return 1
}

# --- RETRY FUNCTION ---
retry() {
  local n=0
  local max=${2:-3}
  local delay=${3:-5}
  until [ $n -ge $max ]; do
    "$@" && return 0
    n=$((n+1))
    sleep $delay
  done
  return 1
}

#!/bin/bash
# Oak Dragon Covenant DNS Failover Script (Linux)
# Switches A record for @ and www to fallback IP using IONOS API

# --- REQUIRED ENVIRONMENT VARIABLES ---
# export IONOS_API_USER="your_ionos_api_user"
# export IONOS_API_PASS="your_ionos_api_pass"
# export DOMAIN="oakdragoncovenant.com"
# export FALLBACK_IP="your_backup_ip_for_dns"
# export RENDER_API_KEY="your_render_api_key"
# export RENDER_SERVICE_ID="your_render_service_id"
# export DO_SSH_KEY="your_digitalocean_private_ssh_key"
# export DO_IP="your_digitalocean_server_ip"
# export DO_DEPLOY_CMD="cd /var/www/Oak-Dragon-Convenant && git pull && pm2 restart oak-dragon-main || pm2 start server.js --name oak-dragon-main"
# export RAILWAY_API_KEY="your_railway_api_key"
# export RAILWAY_PROJECT_ID="your_railway_project_id"
# export VERCEL_TOKEN="your_vercel_token"
# export VERCEL_PROJECT_ID="your_vercel_project_id"

# Example: source .env or set these in your shell before running

VERCEL_TOKEN="${VERCEL_TOKEN:?Set VERCEL_TOKEN env variable}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:?Set VERCEL_PROJECT_ID env variable}"

IONOS_API_USER="${IONOS_API_USER:?Set IONOS_API_USER env variable}"
IONOS_API_PASS="${IONOS_API_PASS:?Set IONOS_API_PASS env variable}"
DOMAIN="oakdragoncovenant.com"

# Render integration
RENDER_API_KEY="${RENDER_API_KEY:?Set RENDER_API_KEY env variable}"
RENDER_SERVICE_ID="${RENDER_SERVICE_ID:?Set RENDER_SERVICE_ID env variable}"

# DigitalOcean integration
DO_SSH_KEY="${DO_SSH_KEY:?Set DO_SSH_KEY env variable}"
DO_IP="${DO_IP:?Set DO_IP env variable}"
DO_DEPLOY_CMD="${DO_DEPLOY_CMD:?Set DO_DEPLOY_CMD env variable}"
# Railway integration
RAILWAY_API_KEY="${RAILWAY_API_KEY:?Set RAILWAY_API_KEY env variable}"
RAILWAY_PROJECT_ID="${RAILWAY_PROJECT_ID:?Set RAILWAY_PROJECT_ID env variable}"
FALLBACK_IP="${FALLBACK_IP:?Set FALLBACK_IP env variable}"

# Get Auth Token
TOKEN=$(curl -s -u "$IONOS_API_USER:$IONOS_API_PASS" -X POST "https://api.ionos.com/auth/v1/tokens" | jq -r .token)

# Get Zone ID for the domain
ZONE_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.ionos.com/dns/v1/zones" | jq -r --arg DOMAIN "$DOMAIN" '.items[] | select(.name==$DOMAIN) | .id')
if [ -z "$ZONE_ID" ]; then
  echo "[ERROR] Could not find zone ID for domain $DOMAIN. Exiting."
  exit 1
fi

# Update A records for @ and www (with retry and logging)
for name in "@" "www"; do
  RECORD_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.ionos.com/dns/v1/zones/$ZONE_ID/records?name=$name&type=A" | jq -r '.items[0].id')
  if [ -z "$RECORD_ID" ] || [ "$RECORD_ID" == "null" ]; then
    echo "[ERROR] Could not find A record for $name in zone $ZONE_ID. Skipping." | tee -a "$LOG_FILE"
    continue
  fi
  retry curl -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"content":"'$FALLBACK_IP'","ttl":3600}' \
    "https://api.ionos.com/dns/v1/zones/$ZONE_ID/records/$RECORD_ID" 2 | tee -a "$LOG_FILE"
done


# --- ALERT WEBHOOK (optional) ---
# export ALERT_WEBHOOK="https://your-alert-endpoint"
ALERT_WEBHOOK="${ALERT_WEBHOOK:-}" # Optional

# --- PARALLEL DEPLOYS ---
declare -A DEPLOY_STATUS
declare -A DEPLOY_MSG

# Render Deploy (with health check, retry, and logging)
(
  if [ -n "$RENDER_API_KEY" ] && [ -n "$RENDER_SERVICE_ID" ]; then
    echo "[INFO] Triggering Render deploy for failover..." | tee -a "$LOG_FILE"
    health_check "https://$DOMAIN/health" "Pre-Render" || echo "[WARN] Pre-Render health check failed, proceeding with deploy." | tee -a "$LOG_FILE"
    RENDER_DEPLOY_RESPONSE=$(curl -s -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
      -H "Authorization: Bearer $RENDER_API_KEY" \
      -H "Accept: application/json")
    RENDER_DEPLOY_ID=$(echo "$RENDER_DEPLOY_RESPONSE" | jq -r '.id')
    if [ -z "$RENDER_DEPLOY_ID" ] || [ "$RENDER_DEPLOY_ID" == "null" ]; then
      DEPLOY_STATUS[render]=1
      DEPLOY_MSG[render]="[ERROR] Render deploy did not return a deployment ID. Response: $RENDER_DEPLOY_RESPONSE"
    else
      for i in {1..10}; do
        STATUS_RESPONSE=$(curl -s -X GET "https://api.render.com/v1/deploys/$RENDER_DEPLOY_ID" \
          -H "Authorization: Bearer $RENDER_API_KEY" \
          -H "Accept: application/json")
        STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status')
        if [ "$STATUS" == "live" ]; then
          DEPLOY_STATUS[render]=0
          DEPLOY_MSG[render]="[INFO] Render deployment succeeded."
          health_check "https://$DOMAIN/health" "Post-Render" || DEPLOY_MSG[render]+=" [ERROR] Post-Render health check failed!"
          break
        elif [ "$STATUS" == "failed" ]; then
          DEPLOY_STATUS[render]=2
          DEPLOY_MSG[render]="[ERROR] Render deployment failed!"
          break
        fi
        sleep 10
      done
    fi
  fi
) &

# DigitalOcean Deploy (with health check, retry, and logging)
(
  if [ -n "$DO_SSH_KEY" ] && [ -n "$DO_IP" ] && [ -n "$DO_DEPLOY_CMD" ]; then
    echo "[INFO] Triggering DigitalOcean deploy for failover..." | tee -a "$LOG_FILE"
    health_check "https://$DOMAIN/health" "Pre-DO" || echo "[WARN] Pre-DO health check failed, proceeding with deploy." | tee -a "$LOG_FILE"
    SSH_KEY_FILE=$(mktemp)
    echo "$DO_SSH_KEY" > "$SSH_KEY_FILE"
    chmod 600 "$SSH_KEY_FILE"
    retry ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_FILE" root@$DO_IP "$DO_DEPLOY_CMD" 2
    SSH_STATUS=$?
    rm -f "$SSH_KEY_FILE"
    if [ $SSH_STATUS -eq 0 ]; then
      DEPLOY_STATUS[digitalocean]=0
      DEPLOY_MSG[digitalocean]="[INFO] DigitalOcean deploy succeeded."
      health_check "https://$DOMAIN/health" "Post-DO" || DEPLOY_MSG[digitalocean]+=" [ERROR] Post-DO health check failed!"
    else
      DEPLOY_STATUS[digitalocean]=2
      DEPLOY_MSG[digitalocean]="[ERROR] DigitalOcean deploy failed with status $SSH_STATUS."
    fi
  fi
) &

# Railway Deploy (with health check, retry, and logging)
(
  if [ -n "$RAILWAY_API_KEY" ] && [ -n "$RAILWAY_PROJECT_ID" ]; then
    echo "[INFO] Triggering Railway deploy for failover..." | tee -a "$LOG_FILE"
    health_check "https://$DOMAIN/health" "Pre-Railway" || echo "[WARN] Pre-Railway health check failed, proceeding with deploy." | tee -a "$LOG_FILE"
    DEPLOY_RESPONSE=$(curl -s -X POST https://backboard.railway.app/graphql/v2 \
      -H "Authorization: Bearer $RAILWAY_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"query":"mutation { deploymentCreate(input: { projectId: \"'$RAILWAY_PROJECT_ID'\" }) { id status } }"}')
    DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | jq -r '.data.deploymentCreate.id')
    if [ -z "$DEPLOY_ID" ] || [ "$DEPLOY_ID" == "null" ]; then
      DEPLOY_STATUS[railway]=1
      DEPLOY_MSG[railway]="[ERROR] Railway deploy did not return a deployment ID. Response: $DEPLOY_RESPONSE"
    else
      for i in {1..10}; do
        STATUS_RESPONSE=$(curl -s -X POST https://backboard.railway.app/graphql/v2 \
          -H "Authorization: Bearer $RAILWAY_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"query":"query { deployment(id: \"'$DEPLOY_ID'\") { status } }"}')
        STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.data.deployment.status')
        if [ "$STATUS" == "SUCCESS" ]; then
          DEPLOY_STATUS[railway]=0
          DEPLOY_MSG[railway]="[INFO] Railway deployment succeeded."
          health_check "https://$DOMAIN/health" "Post-Railway" || DEPLOY_MSG[railway]+=" [ERROR] Post-Railway health check failed!"
          break
        elif [ "$STATUS" == "FAILED" ]; then
          DEPLOY_STATUS[railway]=2
          DEPLOY_MSG[railway]="[ERROR] Railway deployment failed!"
          break
        fi
        sleep 10
      done
    fi
  fi
) &

# Vercel Deploy (with health check, retry, and logging)
(
  if [ -n "$VERCEL_TOKEN" ] && [ -n "$VERCEL_PROJECT_ID" ]; then
    echo "[INFO] Triggering Vercel deploy for failover..." | tee -a "$LOG_FILE"
    health_check "https://$DOMAIN/health" "Pre-Vercel" || echo "[WARN] Pre-Vercel health check failed, proceeding with deploy." | tee -a "$LOG_FILE"
    VERCEL_DEPLOY_RESPONSE=$(curl -s -X POST "https://api.vercel.com/v13/deployments" \
      -H "Authorization: Bearer $VERCEL_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"project":"'$VERCEL_PROJECT_ID'"}')
    VERCEL_DEPLOY_ID=$(echo "$VERCEL_DEPLOY_RESPONSE" | jq -r '.id')
    if [ -z "$VERCEL_DEPLOY_ID" ] || [ "$VERCEL_DEPLOY_ID" == "null" ]; then
      DEPLOY_STATUS[vercel]=1
      DEPLOY_MSG[vercel]="[ERROR] Vercel deploy did not return a deployment ID. Response: $VERCEL_DEPLOY_RESPONSE"
    else
      for i in {1..10}; do
        STATUS_RESPONSE=$(curl -s -X GET "https://api.vercel.com/v13/deployments/$VERCEL_DEPLOY_ID" \
          -H "Authorization: Bearer $VERCEL_TOKEN")
        STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.readyState')
        if [ "$STATUS" == "READY" ]; then
          DEPLOY_STATUS[vercel]=0
          DEPLOY_MSG[vercel]="[INFO] Vercel deployment succeeded."
          health_check "https://$DOMAIN/health" "Post-Vercel" || DEPLOY_MSG[vercel]+=" [ERROR] Post-Vercel health check failed!"
          break
        elif [ "$STATUS" == "ERROR" ]; then
          DEPLOY_STATUS[vercel]=2
          DEPLOY_MSG[vercel]="[ERROR] Vercel deployment failed!"
          break
        fi
        sleep 10
      done
    fi
  fi
) &

# Wait for all background jobs
wait

# --- SUMMARY AND ALERTS ---
echo "[SUMMARY] DNS failover and all cloud deploys attempted (IONOS, Render, DigitalOcean, Railway, Vercel)." | tee -a "$LOG_FILE"
for svc in render digitalocean railway vercel; do
  if [ -n "${DEPLOY_MSG[$svc]}" ]; then
    echo "${DEPLOY_MSG[$svc]}" | tee -a "$LOG_FILE"
    if [ -n "$ALERT_WEBHOOK" ] && [[ "${DEPLOY_MSG[$svc]}" == *ERROR* ]]; then
      curl -s -X POST -H "Content-Type: application/json" -d '{"service":"'$svc'","message":"'${DEPLOY_MSG[$svc]//"/\"}'"}' "$ALERT_WEBHOOK" >/dev/null
    fi
  fi
done
