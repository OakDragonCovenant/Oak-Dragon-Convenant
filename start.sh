#!/bin/bash

# 🚀 Oak Dragon Covenant - Quick Start Script for Render Deployment

echo "🏰 Oak Dragon Covenant - Render Deployment Quick Start"
echo "================================================="

# Check if we're in production
if [ "$NODE_ENV" = "production" ]; then
    echo "🔥 PRODUCTION MODE DETECTED"
    echo "✅ Environment: $NODE_ENV"
    echo "🌐 Port: $PORT"
    echo "🛡️ Security: Enhanced"
else
    echo "🛠️ Development mode"
fi

# Validate critical environment variables
echo ""
echo "🔍 Validating Environment..."

if [ -z "$COINBASE_API_KEY" ] || [ "$COINBASE_API_KEY" = "your_coinbase_api_key_here" ]; then
    echo "⚠️  WARNING: COINBASE_API_KEY not set or using placeholder"
    echo "   Live trading will be DISABLED for safety"
    export AUTO_TRADING_ENABLED=false
else
    echo "✅ COINBASE_API_KEY configured"
fi

if [ -z "$PORT" ]; then
    echo "🌐 Setting default PORT=3000"
    export PORT=3000
fi

echo "✅ PORT=$PORT"
echo "✅ HOST=$HOST"
echo "✅ NODE_ENV=$NODE_ENV"

# Start the application
echo ""
echo "🚀 Starting Oak Dragon Covenant Server..."
echo "🎯 Health Check: http://localhost:$PORT/health"
echo "📊 API Docs: http://localhost:$PORT/api/strategos/v1/portfolio-status"
echo ""

# Start with proper signal handling
exec node server.js
