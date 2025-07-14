# 🚀 LIVE DEPLOYMENT GUIDE - Oak Dragon Covenant on Render

## 🎯 Quick Deploy Steps (You're Here!)

Based on your current Render dashboard showing "Main Platform" project:

### Step 1: Add Environment Variables to Render
In your Render dashboard, go to your service settings and add these environment variables:

**CRITICAL - API Keys (Add Your Real Keys!):**
```
COINBASE_API_KEY=your_real_coinbase_api_key_here
COINBASE_API_SECRET=your_real_coinbase_api_secret_here
```

**Production Configuration:**
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
```

### Step 2: Update Your Service Configuration
1. **Build Command:** `npm install && npm run build`
2. **Start Command:** `npm start`
3. **Health Check Path:** `/health`
4. **Environment:** Node.js
5. **Region:** Choose closest to your users

### Step 3: Deploy & Monitor
1. **Trigger Deploy:** Push to your connected Git repository or manual deploy
2. **Monitor Logs:** Check Render logs for successful startup
3. **Health Check:** Visit `https://your-app.onrender.com/health`
4. **API Test:** Test `https://your-app.onrender.com/api/strategos/v1/portfolio-status`

## 🛡️ SECURITY CHECKLIST

- [ ] ✅ API keys are set in Render environment variables (NOT in code)
- [ ] ✅ AUTO_TRADING_ENABLED=false (start safe!)
- [ ] ✅ MAX_TRADE_AMOUNT=10 (small amounts first)
- [ ] ✅ DAILY_LOSS_LIMIT=5 (protect your capital)
- [ ] ✅ RISK_TOLERANCE=low (conservative start)

## 📊 API Endpoints Available After Deploy

### Health & Status
- `GET /health` - System health check
- `GET /` - Main status page

### Strategos Protocol (Crypto Trading)
- `GET /api/strategos/v1/portfolio-status` - Portfolio overview
- `POST /api/strategos/v1/execute-cycle` - Manual trading cycle
- `POST /api/strategos/v1/rebalance-capital` - Rebalance portfolio
- `POST /api/strategos/v1/review-performance` - Performance analysis

### Oak Dragon Covenant (Real Estate)
- `GET /api/covenant/fund-status` - Real estate fund status
- `POST /api/covenant/acquisition/initiate` - Start property acquisition

## 🔥 GOING LIVE SAFELY

### Phase 1: Verification (NOW)
```bash
# Test basic functionality
curl https://your-app.onrender.com/health

# Test API endpoints
curl https://your-app.onrender.com/api/strategos/v1/portfolio-status
```

### Phase 2: Paper Trading (1-2 weeks)
- Monitor system stability
- Verify all agents are working
- Test error handling
- Review logs daily

### Phase 3: Live Trading (When Ready)
1. Set `AUTO_TRADING_ENABLED=true`
2. Increase `MAX_TRADE_AMOUNT` gradually
3. Monitor performance closely
4. Scale up as confidence grows

## 🚨 EMERGENCY PROCEDURES

### If Something Goes Wrong:
1. **Immediate:** Set `AUTO_TRADING_ENABLED=false`
2. **Check Logs:** Review Render application logs
3. **Health Check:** Verify `/health` endpoint
4. **Rollback:** Use Render's deployment history

### Monitoring Commands:
```bash
# Check service health
curl -f https://your-app.onrender.com/health

# View portfolio status
curl https://your-app.onrender.com/api/strategos/v1/portfolio-status
```

## 📈 SCALING UP

### Performance Optimization:
1. **Upgrade Plan:** Move from Starter to Standard
2. **Add Database:** For persistent data storage
3. **Enable Metrics:** Monitor CPU/Memory usage
4. **CDN:** Add CloudFlare for global performance

### Trading Optimization:
1. **Increase Limits:** Gradually raise trade amounts
2. **Add Exchanges:** Connect Binance, others
3. **Advanced Strategies:** Enable more sophisticated trading
4. **Real Estate:** Activate property acquisition

## 🎯 SUCCESS METRICS

Track these after going live:
- ✅ 99.9% uptime
- ✅ <200ms API response times
- ✅ Zero security incidents
- ✅ Positive trading performance
- ✅ Clean error logs

## 📞 SUPPORT & MONITORING

- **Render Dashboard:** Monitor deployments
- **Application Logs:** Track system behavior
- **Health Checks:** Automated monitoring
- **Performance Metrics:** Response times, errors

---

## 🚀 READY TO DEPLOY?

1. **Set Environment Variables** in Render dashboard
2. **Push Code** to trigger deployment
3. **Monitor Health Check** at `/health`
4. **Test APIs** to verify functionality
5. **Start Paper Trading** to validate system

Your Oak Dragon Covenant is ready for production! 🏰⚡
