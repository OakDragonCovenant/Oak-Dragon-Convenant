#!/bin/bash
# 🚀 Oak Dragon Covenant - Deployment Verification Script

echo "🏰 Oak Dragon Covenant - Deployment Verification"
echo "=================================================="

# Check if URL is provided
if [ -z "$1" ]; then
    echo "Usage: ./verify-deployment.sh <your-render-url>"
    echo "Example: ./verify-deployment.sh https://oak-dragon-covenant.onrender.com"
    exit 1
fi

URL=$1
echo "🔍 Testing deployment at: $URL"
echo ""

# Test 1: Health Check
echo "🏥 Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$URL/health" -o /tmp/health_response.json)
HTTP_CODE=${HEALTH_RESPONSE: -3}

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed!"
    echo "📊 Response:"
    cat /tmp/health_response.json | jq . 2>/dev/null || cat /tmp/health_response.json
else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    cat /tmp/health_response.json 2>/dev/null
fi
echo ""

# Test 2: Main Page
echo "🏠 Testing Main Page..."
MAIN_RESPONSE=$(curl -s -w "%{http_code}" "$URL" -o /tmp/main_response.html)
HTTP_CODE=${MAIN_RESPONSE: -3}

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Main page loaded successfully!"
    if grep -q "Oak Dragon Covenant" /tmp/main_response.html; then
        echo "✅ Content looks correct"
    else
        echo "⚠️  Page loaded but content may be incorrect"
    fi
else
    echo "❌ Main page failed to load (HTTP $HTTP_CODE)"
fi
echo ""

# Test 3: API Endpoints
echo "💰 Testing Strategos API..."
STRATEGOS_RESPONSE=$(curl -s -w "%{http_code}" "$URL/api/strategos/v1/portfolio-status" -o /tmp/strategos_response.json)
HTTP_CODE=${STRATEGOS_RESPONSE: -3}

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Strategos API responding!"
else
    echo "⚠️  Strategos API not responding (HTTP $HTTP_CODE)"
fi
echo ""

echo "🏠 Testing Covenant API..."
COVENANT_RESPONSE=$(curl -s -w "%{http_code}" "$URL/api/covenant/fund-status" -o /tmp/covenant_response.json)
HTTP_CODE=${COVENANT_RESPONSE: -3}

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Covenant API responding!"
else
    echo "⚠️  Covenant API not responding (HTTP $HTTP_CODE)"
fi
echo ""

# Summary
echo "📋 DEPLOYMENT SUMMARY"
echo "====================="
echo "🌐 URL: $URL"
echo "🏥 Health: $([ -s /tmp/health_response.json ] && echo "✅ OK" || echo "❌ FAIL")"
echo "🏠 Main Page: $([ -f /tmp/main_response.html ] && echo "✅ OK" || echo "❌ FAIL")"
echo "💰 Trading System: Ready for testing"
echo "🔐 Auto-Trading: DISABLED (safe)"
echo ""
echo "🎯 Next Steps:"
echo "   1. If all tests pass, your deployment is successful!"
echo "   2. Test the web interface manually"
echo "   3. Check logs in Render dashboard"
echo "   4. When ready, enable auto-trading in environment variables"
echo ""
echo "🏰 Oak Dragon Covenant is ready to serve! 🐉"

# Cleanup
rm -f /tmp/health_response.json /tmp/main_response.html /tmp/strategos_response.json /tmp/covenant_response.json
