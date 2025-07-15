# 🚀 Oak Dragon Covenant - Complete Deployment Guide

## Phase 1: DNS Configuration (IONOS)

### Step 1.1: Access IONOS DNS Management
1. **Login to IONOS**: Go to [ionos.com](https://ionos.com) and login to your account
2. **Navigate to Domain Management**: Click on "Domains & SSL" in the main menu
3. **Select Your Domain**: Click on "oakdragoncovenant.com"
4. **Open DNS Settings**: Click "Manage DNS" or "DNS" tab

### Step 1.2: Configure A Records
Add these A records pointing to your cloud providers:

```
Type: A
Name: @
Value: [Your Railway/Render IP - get from cloud provider]
TTL: 3600

Type: A  
Name: www
Value: [Same IP as above]
TTL: 3600
```

### Step 1.3: Configure CNAME Records
Add these CNAME records for subdomains:

```
Type: CNAME
Name: api
Value: oak-dragon-covenant-api.up.railway.app
TTL: 3600

Type: CNAME
Name: trading
Value: oak-dragon-covenant-trading.onrender.com
TTL: 3600

Type: CNAME
Name: crypto
Value: oak-dragon-covenant-trading.onrender.com
TTL: 3600

Type: CNAME
Name: dashboard
Value: oak-dragon-covenant-dashboard.vercel.app
TTL: 3600

Type: CNAME
Name: command
Value: oak-dragon-covenant-dashboard.vercel.app
TTL: 3600

Type: CNAME
Name: divisions
Value: oak-dragon-covenant-dashboard.vercel.app
TTL: 3600

Type: CNAME
Name: portal
Value: oak-dragon-covenant-dashboard.vercel.app
TTL: 3600

Type: CNAME
Name: monitor
Value: oak-dragon-covenant-api.up.railway.app
TTL: 3600
```

### Step 1.4: Save DNS Changes
1. Click "Save" or "Apply Changes" in IONOS
2. **Wait 5-10 minutes** for DNS propagation

---

## Phase 2: Railway Deployment (API & Main Backend - No Trading)

### Step 2.1: Prepare Railway Deployment
1. **Install Railway CLI** (if not installed):
   ```powershell
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```powershell
   railway login
   ```

### Step 2.2: Initialize Railway Project
```powershell
cd "c:\Users\oakdr\OneDrive\Documents\Oak-Dragon-Covenant"
railway init
# Select: "Create new project"
# Name: "oak-dragon-covenant-api"
```

### Step 2.3: Configure Environment Variables (No Trading)
```powershell
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set DOMAIN=oakdragoncovenant.com
railway variables set CLOUD_PROVIDER=railway
railway variables set TRADING_DISABLED=true
railway variables set SERVICES_ALLOWED=divisions,entities,auth,monitoring
```

### Step 2.4: Deploy to Railway
```powershell
railway up
```

**Note**: Railway deployment will host only:
- Division Command Center API
- Entity Management System
- Authentication Services  
- General Business APIs
- Monitoring/Health Checks

**Trading functionality will be deployed separately to Render.**

### Step 2.5: Configure Custom Domain
1. Go to Railway dashboard: [railway.app](https://railway.app)
2. Select your project
3. Go to "Settings" → "Domains"
4. Add custom domains:
   - `oakdragoncovenant.com`
   - `api.oakdragoncovenant.com`
   - `monitor.oakdragoncovenant.com`

---

## Phase 3: Vercel Deployment (Dashboard & Frontend)

### Step 3.1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 3.2: Login to Vercel
```powershell
vercel login
```

### Step 3.3: Deploy to Vercel
```powershell
cd "c:\Users\oakdr\OneDrive\Documents\Oak-Dragon-Covenant"
vercel --prod
```

### Step 3.4: Configure Custom Domains
1. Go to Vercel dashboard: [vercel.com](https://vercel.com)
2. Select your project
3. Go to "Settings" → "Domains"
4. Add these domains:
   - `dashboard.oakdragoncovenant.com`
   - `command.oakdragoncovenant.com`
   - `divisions.oakdragoncovenant.com`
   - `portal.oakdragoncovenant.com`

---

## Phase 4: Render Deployment (Trading & High-Compute Services)

### Step 4.1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub account
3. Connect your GitHub repository

### Step 4.2: Create Web Service for Trading
1. Click "New" → "Web Service"
2. Connect repository: `Oak-Dragon-Convenant`
3. Configure settings:
   - **Name**: `oak-dragon-covenant-trading`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 4.3: Set Environment Variables (Trading Enabled)
```
NODE_ENV=production
PORT=10000
DOMAIN=oakdragoncovenant.com
CLOUD_PROVIDER=render
SCALING_MODE=auto
TRADING_ENABLED=true
CRYPTO_SERVICES=enabled
STOCK_SERVICES=enabled
API_ENDPOINT=https://api.oakdragoncovenant.com
```

### Step 4.4: Configure Custom Domains for Trading
1. In Render dashboard, go to your service
2. Settings → Custom Domains
3. Add these domains:
   - `trading.oakdragoncovenant.com`
   - `crypto.oakdragoncovenant.com` (optional)
   - `stocks.oakdragoncovenant.com` (optional)

**Note**: Render allows trading applications and financial services, making it the appropriate platform for:
- Crypto Trading Bots
- Stock Market Analysis
- Portfolio Management
- Financial Data Processing
- Trading Algorithm Execution

---

## Phase 5: Verification & Testing

### Step 5.1: Test DNS Resolution
```powershell
# Test main domain
nslookup oakdragoncovenant.com

# Test subdomains
nslookup api.oakdragoncovenant.com
nslookup dashboard.oakdragoncovenant.com
nslookup divisions.oakdragoncovenant.com
```

### Step 5.2: Test All Endpoints
Run the deployment verification script:
```powershell
cd "c:\Users\oakdr\OneDrive\Documents\Oak-Dragon-Covenant"
.\verify-deployment.ps1
```

### Step 5.3: Manual Endpoint Testing
Visit these URLs to verify deployment:

**Main Services:**
- https://oakdragoncovenant.com (Landing page)
- https://api.oakdragoncovenant.com (API status)
- https://dashboard.oakdragoncovenant.com (Dashboard)
- https://divisions.oakdragoncovenant.com (Division Center)
- https://trading.oakdragoncovenant.com (Trading dashboard)

**API Endpoints:**
- https://api.oakdragoncovenant.com/health
- https://api.oakdragoncovenant.com/divisions/divisions
- https://api.oakdragoncovenant.com/cloud-status

---

## Phase 6: Security & SSL Configuration

### Step 6.1: Verify SSL Certificates
1. **Railway**: SSL automatically provided
2. **Vercel**: SSL automatically provided  
3. **Render**: SSL automatically provided
4. **IONOS**: Check DNS is pointing correctly

### Step 6.2: Test HTTPS Redirects
Verify all HTTP requests redirect to HTTPS:
```powershell
curl -I http://oakdragoncovenant.com
curl -I http://api.oakdragoncovenant.com
```

---

## Phase 7: Monitoring Setup

### Step 7.1: Deploy Monitoring Dashboard
```powershell
cd "c:\Users\oakdr\OneDrive\Documents\Oak-Dragon-Covenant"
.\monitor-free-cloud.ps1
```

### Step 7.2: Verify System Status
Check the monitoring endpoint:
- https://monitor.oakdragoncovenant.com
- https://api.oakdragoncovenant.com/cloud-status

---

## Phase 8: Final Configuration

### Step 8.1: Update Production Environment Variables
For each platform, ensure these are set:

**Railway (API/Backend - No Trading):**
```
NODE_ENV=production
DOMAIN=oakdragoncovenant.com
CORS_ORIGINS=https://dashboard.oakdragoncovenant.com,https://divisions.oakdragoncovenant.com
TRADING_DISABLED=true
SERVICES_ALLOWED=divisions,entities,auth,monitoring
```

**Vercel (Frontend):**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.oakdragoncovenant.com
NEXT_PUBLIC_TRADING_URL=https://trading.oakdragoncovenant.com
```

**Render (Trading & Financial Services):**
```
NODE_ENV=production
API_ENDPOINT=https://api.oakdragoncovenant.com
TRADING_ENABLED=true
CRYPTO_SERVICES=enabled
STOCK_SERVICES=enabled
FINANCIAL_DATA_PROCESSING=enabled
```

### Step 8.2: Test Division Command Center
1. Visit: https://divisions.oakdragoncovenant.com
2. Verify all 8 industry buttons load
3. Test creating a new entity
4. Verify API calls work properly

---

## 🎯 Quick Deployment Script

For rapid deployment, run this comprehensive script:

```powershell
cd "c:\Users\oakdr\OneDrive\Documents\Oak-Dragon-Covenant"
.\deploy-free-cloud.ps1
```

---

## ⚡ Emergency Rollback

If anything goes wrong during deployment:

```powershell
# Rollback Railway
railway rollback

# Rollback Vercel  
vercel --prod --force

# Reset DNS (if needed)
# Go back to IONOS and restore previous DNS settings
```

---

## 📊 Post-Deployment Checklist

- [ ] DNS records propagated (5-10 minutes)
- [ ] Railway service running
- [ ] Vercel deployment successful
- [ ] Render service online
- [ ] All subdomains accessible
- [ ] SSL certificates active
- [ ] API endpoints responding
- [ ] Division Command Center functional
- [ ] Monitoring dashboard operational
- [ ] All authentication working

---

## 🔧 Troubleshooting

**DNS Issues:**
- Wait 24 hours for full propagation
- Use `nslookup` to test resolution
- Check IONOS DNS configuration

**Deployment Failures:**
- Check build logs in each platform
- Verify environment variables
- Ensure package.json is correct

**SSL Certificate Issues:**
- Wait for automatic SSL provisioning (5-10 minutes)
- Force refresh SSL in platform settings

**API Connection Issues:**
- Verify CORS settings
- Check firewall rules
- Test API endpoints directly

---

## 📞 Support Resources

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Render**: [render.com/docs](https://render.com/docs)
- **IONOS**: [ionos.com/help](https://ionos.com/help)

---

**Estimated Total Deployment Time: 30-45 minutes**
**DNS Propagation: Additional 5-60 minutes**

Your Oak Dragon Covenant empire will be fully operational across all domains! 🐉👑
