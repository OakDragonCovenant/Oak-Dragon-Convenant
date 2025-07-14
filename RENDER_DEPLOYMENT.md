# 🚀 RENDER DEPLOYMENT - Complete Step-by-Step Guide
# Oak Dragon Covenant - Live Deployment Instructions

## 📋 What You Need Before Starting:
✅ GitHub account (free)
✅ Render account (free) 
✅ Your Oak Dragon Covenant code ready
✅ Coinbase API credentials (already configured)

---

## 🎯 STEP 1: PUSH CODE TO GITHUB

### 1.1 Open PowerShell in Your Project Folder
```powershell
cd "C:\Users\oakdr\OneDrive\Documents\Oak-Dragon-Covenant"
```

### 1.2 Initialize Git (if not done already)
```powershell
git init
git add .
git commit -m "🚀 Oak Dragon Covenant v2.0.0 - Ready for deployment"
```

### 1.3 Create GitHub Repository
1. **Go to:** https://github.com/new
2. **Repository name:** `oak-dragon-covenant`
3. **Description:** `AI Agent Ecosystem: Real Estate Investment & Crypto Trading`
4. **Set to PRIVATE** (important for security!)
5. **Click:** "Create repository"

### 1.4 Connect Local Code to GitHub
```powershell
git remote add origin https://github.com/YOUR_USERNAME/oak-dragon-covenant.git
git branch -M main
git push -u origin main
```

---

## 🎯 STEP 2: CREATE RENDER WEB SERVICE

### 2.1 Sign Up for Render
1. **Go to:** https://render.com
2. **Click:** "Get Started for Free"
3. **Sign in with GitHub** (easiest option)

### 2.2 Create New Web Service
1. **Click:** "New +" button (top right corner)
2. **Select:** "Web Service"
3. **Connect GitHub:** Allow Render to access your repositories
4. **Find and select:** `oak-dragon-covenant` repository

### 2.3 Configure Basic Settings
**Fill in EXACTLY:**
- **Name:** `oak-dragon-covenant`
- **Region:** `Ohio (US East)` (or closest to you)
- **Branch:** `main`
- **Runtime:** `Node`

### 2.4 Build & Deploy Settings
**Fill in EXACTLY:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** `22`

---

## 🎯 STEP 3: CONFIGURE ENVIRONMENT VARIABLES

### 3.1 Scroll Down to "Environment Variables" Section

### 3.2 Add Each Variable One by One:
**Click "Add Environment Variable" for each:**

**Variable 1:**
- **Key:** `COINBASE_API_KEY`
- **Value:** `a6fa2e07-d00b-4ff1-bef8-cd25ba4c161d`

**Variable 2:**
- **Key:** `COINBASE_API_SECRET`
- **Value:** `bm+sIEsWeFhCEYB943z528x2YQuBeLdUz8QZdYLTXOCWH/zbM+wcQUAqwAeYHQweEIBEHq5YOH43JP9LFi9Ytig==`

**Variable 3:**
- **Key:** `COINBASE_PASSPHRASE`
- **Value:** `Lovehertodeath515!`

**Variable 4:**
- **Key:** `NODE_ENV`
- **Value:** `production`

**Variable 5:**
- **Key:** `PORT`
- **Value:** `10000`

**Variable 6:**
- **Key:** `LOG_LEVEL`
- **Value:** `info`

**Variable 7:**
- **Key:** `MAX_TRADE_AMOUNT`
- **Value:** `100`

**Variable 8:**
- **Key:** `DAILY_LOSS_LIMIT`
- **Value:** `50`

**Variable 9:**
- **Key:** `AUTO_TRADING_ENABLED`
- **Value:** `false`

**Variable 10:**
- **Key:** `DEFAULT_TRADING_PAIR`
- **Value:** `BTC-USD`

---

## 🎯 STEP 4: DEPLOY YOUR APPLICATION

### 4.1 Start Deployment
1. **Scroll to bottom of page**
2. **Click:** "Create Web Service"
3. **Wait:** Deployment will take 5-15 minutes

### 4.2 Monitor Deployment Progress
**Watch for these messages in the logs:**
- ✅ `==> Build completed successfully`
- ✅ `==> Deploy completed successfully`
- ✅ `🚀 Initializing Oak Dragon Covenant Systems...`

---

## 🎯 STEP 5: VERIFY YOUR LIVE DEPLOYMENT

### 5.1 Get Your Live URL
**After deployment completes, you'll see:**
- **Your Live URL:** `https://oak-dragon-covenant-XXXX.onrender.com`

### 5.2 Test Your Application
1. **Click on your live URL**
2. **You should see:** Oak Dragon Covenant welcome page
3. **Test health endpoint:** Add `/health` to your URL
4. **Example:** `https://oak-dragon-covenant-XXXX.onrender.com/health`

### 5.3 Verify Agent Status
**Test these endpoints:**
- `/covenant/status` - Check all agent status
- `/strategos/status` - Check trading system status
- `/health` - Basic health check

---

## 🎯 STEP 6: POST-DEPLOYMENT CHECKLIST

### 6.1 Verify Everything Works
- [ ] Live URL accessible
- [ ] Health endpoint returns OK
- [ ] No errors in Render logs
- [ ] All agents initialized successfully
- [ ] Coinbase API credentials working

### 6.2 Security Check
- [ ] Repository is set to PRIVATE
- [ ] Environment variables are secure
- [ ] API keys not exposed in logs
- [ ] HTTPS enabled (automatic with Render)

---

## 🎯 STEP 7: MONITORING & MAINTENANCE

### 7.1 Monitor Your Application
1. **Render Dashboard:** Check deployment status
2. **Logs:** Monitor for any errors
3. **Coinbase Account:** Verify API activity

### 7.2 Enable Auto-Deploy (Recommended)
1. **In Render dashboard:** Go to Settings
2. **Enable:** "Auto-Deploy" 
3. **Result:** Automatic updates when you push to GitHub

---

## ✅ SUCCESS INDICATORS

**Your deployment is successful when you see:**
1. ✅ Green "Live" status in Render dashboard
2. ✅ Your live URL loads without errors
3. ✅ `/health` endpoint returns healthy status
4. ✅ Agent initialization messages in logs
5. ✅ No error messages in Render logs

---

## 🚨 TROUBLESHOOTING COMMON ISSUES

### Issue: Build Failed
**Solution:** 
1. Check package.json exists
2. Verify all dependencies are listed
3. Try redeploying

### Issue: Environment Variables Not Working
**Solution:**
1. Double-check spelling of variable names
2. Ensure no extra spaces in values
3. Redeploy after adding variables

### Issue: Application Won't Start
**Solution:**
1. Check start command is `npm start`
2. Verify PORT environment variable is 10000
3. Check logs for specific error messages

### Issue: Coinbase API Errors
**Solution:**
1. Verify API key permissions in Coinbase
2. Check passphrase is correct
3. Ensure API keys are for production (not sandbox)

---

## 💰 RENDER PRICING INFO

### Free Tier:
- ✅ **750 hours/month** (enough for 24/7 for 31 days)
- ✅ **No crypto trading restrictions**
- ✅ **Free SSL certificates**
- ✅ **Automatic deployments**

### After Free Tier:
- **$7/month** for continuous 24/7 operation
- **Professional infrastructure**
- **Automatic scaling**

---

## 🎉 CONGRATULATIONS!

**Your Oak Dragon Covenant is now LIVE on the internet!** 🏰⚡

**Live URL Example:** `https://oak-dragon-covenant-XXXX.onrender.com`

**Next Steps:**
1. Share your live URL (it's secure)
2. Monitor your deployment
3. We'll fix the minor path-to-regexp issue next

---

## 📞 NEED HELP?

**If you get stuck:**
1. Check Render logs for error messages
2. Verify all environment variables are correct
3. Ensure GitHub repository is properly connected
4. Try redeploying from Render dashboard
