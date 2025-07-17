#!/bin/bash
# Oak Dragon Covenant: Environment Auto-Check Script
# Checks for all required environment variables and prints status

REQUIRED_VARS=(
  IONOS_API_USER
  IONOS_API_PASS
  DOMAIN
  FALLBACK_IP
  RENDER_API_KEY
  RENDER_SERVICE_ID
  DO_SSH_KEY
  DO_IP
  DO_DEPLOY_CMD
  RAILWAY_API_KEY
  RAILWAY_PROJECT_ID
  VERCEL_TOKEN
  VERCEL_PROJECT_ID
)

MISSING=0

echo "[INFO] Checking required environment variables..."
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "[MISSING] $var is not set."
    MISSING=1
  else
    echo "[OK] $var is set."
  fi
done

if [ $MISSING -eq 1 ]; then
  echo "[FAIL] One or more required environment variables are missing."
  exit 1
else
  echo "[SUCCESS] All required environment variables are set."
  exit 0
fi
