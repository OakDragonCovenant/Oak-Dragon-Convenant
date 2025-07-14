# 🚀 RENDER DEPLOYMENT GUIDE - Step by Step for Dummies

## 📋 Prerequisites Checklist
- ✅ GitHub account 
- ✅ Render account (free tier available)
- ✅ Your Oak Dragon Covenant code ready
- ✅ Coinbase API credentials configured

---

## 🎯 STEP 1: Push Your Code to GitHub

### 1.1 Open Terminal in Your Project
```bash
cd "C:\Users\oakdr\OneDrive\Documents\Oak-Dragon-Covenant"
```

### 1.2 Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "🚀 Initial commit - Oak Dragon Covenant v2.0.0"
```

### 1.3 Create GitHub Repository
1. Go to: https://github.com/new
2. Repository name: `oak-dragon-covenant`
3. Description: `Advanced AI Agent Ecosystem: Real Estate Investment & Cryptocurrency Trading Platform`
4. Set to **Private** (important for security)
5. Click "Create repository"

### 1.4 Link Local Code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/oak-dragon-covenant.git
git branch -M main
git push -u origin main
```

---

## 🎯 STEP 2: Deploy to Render

### 2.1 Log into Render
1. Go to: https://render.com
2. Click "Get Started for Free" or "Sign In"
3. Sign in with your GitHub account

### 2.2 Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub account if prompted
4. Find and select your `oak-dragon-covenant` repository

### 2.3 Configure Deployment Settings
Fill in these **EXACT** settings:

**Basic Settings:**
- **Name:** `oak-dragon-covenant`
- **Region:** `Ohio (US East)` or closest to you
- **Branch:** `main`
- **Runtime:** `Node`

**Build & Deploy Settings:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 2.4 Advanced Settings
- **Plan Type:** `Free`
- **Node Version:** `22.17.0`

---

## 🎯 STEP 3: Configure Environment Variables

### 3.1 Scroll Down to "Environment Variables"
Add these **EXACT** variables (one by one):

```bash
COINBASE_API_KEY=a6fa2e07-d00b-4ff1-bef8-cd25ba4c161d
COINBASE_API_SECRET=bm+sIEsWeFhCEYB943z528x2YQuBeLdUz8QZdYLTXOCWH/zbM+wcQUAqwAeYHQweEIBEHq5YOH43JP9LFi9Ytig==
COINBASE_PASSPHRASE=Lovehertodeath515!
NODE_ENV=production
PORT=10000
LOG_LEVEL=info
MAX_TRADE_AMOUNT=100
DAILY_LOSS_LIMIT=50
DEFAULT_TRADING_PAIR=BTC-USD
RISK_TOLERANCE=medium
AUTO_TRADING_ENABLED=false
```

### 3.2 How to Add Each Variable:
1. Click "Add Environment Variable"
2. **Key:** Enter the variable name (e.g., `COINBASE_API_KEY`)
3. **Value:** Enter the variable value (e.g., `a6fa2e07-d00b-4ff1-bef8-cd25ba4c161d`)
4. Click "Add"
5. Repeat for all variables above

---

## 🎯 STEP 4: Deploy!

### 4.1 Start Deployment
1. Scroll to bottom
2. Click "Create Web Service"
3. Wait for deployment (5-15 minutes)

### 4.2 Monitor Deployment
Watch the deployment logs for:
- ✅ `Build completed successfully`
- ✅ `Deploy completed successfully`
- ✅ `🚀 Initializing Oak Dragon Covenant Systems...`

---

## 🎯 STEP 5: Verify Deployment

### 5.1 Get Your Live URL
After deployment completes, you'll see:
- **Live URL:** `https://oak-dragon-covenant.onrender.com`

### 5.2 Test Your Deployment
1. Click on your live URL
2. You should see: `🏰 Oak Dragon Covenant - AI Agent Ecosystem`
3. Test health endpoint: Add `/health` to your URL

---

## 🎯 STEP 6: Post-Deployment Verification

### 6.1 Check System Status
Visit these endpoints:
- `https://your-app.onrender.com/health` - Health check
- `https://your-app.onrender.com/covenant/status` - Agent status
- `https://your-app.onrender.com/strategos/status` - Trading status

### 6.2 Monitor Logs
1. In Render dashboard, click "Logs"
2. Look for successful agent initialization messages
3. No error messages should appear

---

## 🎯 STEP 7: Security & Final Setup

### 7.1 Configure Domain (Optional)
1. In Render dashboard, go to "Settings"
2. Add custom domain if you have one
3. Enable HTTPS (automatic with Render)

### 7.2 Set Up Monitoring
1. Enable "Auto-Deploy" for automatic updates
2. Set up Render notifications for deployment status
3. Monitor your Coinbase Pro account for API activity

---

## ✅ Success Checklist

After deployment, verify these items:

- [ ] GitHub repository created and code pushed
- [ ] Render web service created and deployed
- [ ] All environment variables configured
- [ ] Live URL accessible
- [ ] Health endpoint responding
- [ ] No error messages in logs
- [ ] Coinbase API credentials working
- [ ] All agents initialized successfully

---

## 🚨 Common Issues & Solutions

### Issue: Build Failed
**Solution:** Check your package.json and ensure all dependencies are listed

### Issue: Environment Variables Not Loading
**Solution:** Double-check spelling and formatting of variable names

### Issue: Coinbase API Errors
**Solution:** Verify API key permissions and sandbox vs. live environment

### Issue: Port Binding Issues
**Solution:** Ensure PORT environment variable is set to 10000

---

## 🎉 Congratulations!

Your Oak Dragon Covenant is now LIVE on the internet! 🏰⚡

**Next up:** We'll fix that minor path-to-regexp issue with detailed steps.
