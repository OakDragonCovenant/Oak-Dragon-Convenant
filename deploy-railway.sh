#!/bin/bash

# Quick Railway Deployment Script
# Run this to deploy your Strategos Protocol to Railway for FREE

echo "🚀 Deploying Strategos Protocol to Railway (FREE)"
echo "================================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔑 Login to Railway..."
railway login

# Initialize project
echo "🎯 Creating Railway project..."
railway init

# Set environment variables
echo "🔧 Setting environment variables..."
railway variables set COINBASE_API_KEY=a539d51e-b569-4852-bc0f-a8cd77b5d0fe
railway variables set COINBASE_API_SECRET=brJ6dqHsLrAkn7zsCobrY6T/TRyr8ebBcAbTd1h0Pq4YEG0AsqpwhmljCI82Kqs5Hqve7UwcWO7LbI3r3poxXg==
railway variables set NODE_ENV=production
railway variables set PORT=3000

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🎉 Your 24/7 trading bot is now running on Railway!"
echo "📊 Monitor at: https://railway.app/dashboard"
echo "🔗 Bot URL: Check Railway dashboard for your app URL"

# Optional: Open dashboard
read -p "Open Railway dashboard? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    railway open
fi
