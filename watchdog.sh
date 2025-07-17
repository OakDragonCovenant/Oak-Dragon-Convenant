#!/bin/bash
# Oak Dragon Covenant Watchdog Script (Linux)
# Monitors Node.js, PM2, and NGINX. If any are down, restarts them and triggers security alert.
# If all fail, triggers DNS failover via IONOS API (see dns_failover.sh)

# --- Config ---
SECURITY_WEBHOOK="https://your-real-webhook-or-api-url"IONOS_API_USER="your-ionos-user"  # Set in environment or .env
IONOS_API_PASS="your-ionos-pass"  # Set in environment or .env
DOMAIN="oakdragoncovenant.com"
FALLBACK_IP="<Render_or_Railway_IP>"  # Set to backup IP

# --- Check Services ---
fail=0
for svc in nginx pm2; do
  systemctl is-active --quiet $svc || { systemctl restart $svc; fail=1; }
done
pgrep -f 'node' > /dev/null || { systemctl restart pm2; fail=1; }

# --- Security Alert if any restart ---
if [ $fail -eq 1 ]; then
  curl -X POST -H "Content-Type: application/json" -d '{"event":"service_restart","host":"'$(hostname)'"}' "$SECURITY_WEBHOOK"
fi

# --- If still down, trigger DNS failover ---
if ! systemctl is-active --quiet nginx || ! pgrep -f 'node'; then
  bash dns_failover.sh
fi
