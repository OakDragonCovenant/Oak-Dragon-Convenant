# 🚀 QUICK REDEPLOY GUIDE - Fix Oak Dragon Covenant

## 🎯 IMMEDIATE ACTION NEEDED

Your site is currently deployed as **static files only**. We need to redeploy it as a **Node.js web service**.

## 🔧 Step 1: Check Your Current Render Configuration

1. Go to your **Render Dashboard**: https://dashboard.render.com
2. Find your "oak-dragon-covenant" service
3. Check if it says **"Static Site"** or **"Web Service"**

**If it says "Static Site" - THIS IS THE PROBLEM!**

## ⚡ Step 2: Create New Web Service (Recommended)

### Option A: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo: `OakDragonCovenant/Oak-Dragon-Convenant`
3. Configure as follows:

**Basic Settings:**
- **Name**: `oak-dragon-covenant-v2`
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: (leave empty)

**Instance Type:**
- **Plan**: `Starter ($7/month)` or `Free (0.1 CPU, 512 MB RAM)`

### Option B: Convert Existing Service
1. Go to your existing service settings
2. If it's a Static Site, you'll need to delete it and create a new Web Service
3. Static Sites cannot be converted to Web Services

## 🔑 Step 3: Add Environment Variables

In your **Web Service** settings, add these environment variables:

```
NODE_ENV=production
PORT=10000
HOST=0.0.0.0
LOG_LEVEL=info
AUTO_TRADING_ENABLED=false
MAX_TRADE_AMOUNT=10
DAILY_LOSS_LIMIT=5
RISK_TOLERANCE=low
DEFAULT_TRADING_PAIR=BTC-USD
COINBASE_API_KEY=a6fa2e07-d00b-4ff1-bef8-cd25ba4c161d
COINBASE_API_SECRET=bm+sIEsWeFhCEYB943z528x2YQuBeLdUz8QZdYLTXOCWH/zbM+wcQUAqwAeYHQweEIBEHq5YOH43JP9LFi9Ytig==
COINBASE_PASSPHRASE=Lovehertodeath515!
```

## 🎯 Step 4: Deploy & Test

1. **Deploy** the service
2. **Wait** for deployment to complete (5-10 minutes)
3. **Test** your endpoints:
   - Main site: `https://your-new-service.onrender.com`
   - Health check: `https://your-new-service.onrender.com/health`
   - API test: `https://your-new-service.onrender.com/api/covenant/fund-status`

## ✅ Step 5: Update Domain (Optional)

If you want to keep using `https://oakdragoncovenant.com`:
1. Go to your **new web service** settings
2. Click **"Custom Domains"**
3. Add `oakdragoncovenant.com`
4. Follow DNS instructions

## 🔥 What You Should See After Deployment

**Successful Health Check Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-15T00:18:48.272Z",
  "uptime": 19.61,
  "environment": "production",
  "systems": {
    "covenant": "operational",
    "strategos": "operational"
  }
}
```

## 🚨 SAFETY NOTES

- **Auto-trading is DISABLED** by default (`AUTO_TRADING_ENABLED=false`)
- **Low trade limits** are set for safety
- **All agents will initialize** but won't trade automatically
- **You can test everything safely** before enabling live trading

## 📞 Need Help?

If you run into issues:
1. Check Render **deployment logs**
2. Verify all **environment variables** are set
3. Test the **health endpoint** first
4. **All systems should show "operational"**

---

🏰 **Your Oak Dragon Covenant is ready to rule the markets!** 🐉
