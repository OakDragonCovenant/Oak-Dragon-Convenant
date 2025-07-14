# 🔐 SECURE API KEY SETUP GUIDE

## Your Coinbase API Key Information
**API Key ID:** `organizations/609c3fb9-4df5-443d-b673-1cf263f7fdc3/apiKeys/787a026a-407f-4825-bb56-69b6ba2bbedc`

## 🚨 CRITICAL SECURITY STEPS

### 1. Get Your Complete API Credentials
From your Coinbase Pro dashboard, you should have received:
- **API Key** (public identifier)
- **API Secret** (private key - NEVER SHARE)
- **Passphrase** (if required)

### 2. LOCAL DEVELOPMENT SETUP
For local testing, update your `.env` file:

```bash
# Replace with your ACTUAL credentials from Coinbase
COINBASE_API_KEY=your_actual_32_character_api_key_here
COINBASE_API_SECRET=your_actual_88_character_base64_secret_here
COINBASE_PASSPHRASE=your_passphrase_if_required
```

### 3. RENDER PRODUCTION SETUP
In your Render dashboard, add these environment variables:

**Environment Variables to Add:**
```
COINBASE_API_KEY = [your actual API key]
COINBASE_API_SECRET = [your actual API secret]
COINBASE_PASSPHRASE = [your passphrase if needed]
NODE_ENV = production
AUTO_TRADING_ENABLED = false
MAX_TRADE_AMOUNT = 10
DAILY_LOSS_LIMIT = 5
RISK_TOLERANCE = low
```

### 4. SECURITY BEST PRACTICES

✅ **DO:**
- Keep API keys in environment variables only
- Start with `AUTO_TRADING_ENABLED=false`
- Use small trade amounts initially (`MAX_TRADE_AMOUNT=10`)
- Set conservative loss limits (`DAILY_LOSS_LIMIT=5`)
- Monitor all trades closely

❌ **DON'T:**
- Put real API keys in code files
- Commit `.env` files with real credentials
- Enable live trading immediately
- Use large trade amounts initially
- Share your API secret with anyone

### 5. API KEY PERMISSIONS VERIFICATION

Your API key should have these permissions:
- ✅ **View** - To check portfolio status
- ✅ **Trade** - To execute buy/sell orders
- ❌ **Transfer** - NOT recommended (keep disabled for security)

### 6. TESTING YOUR SETUP

After configuring your API keys, test with:

```bash
# Local testing
npm start

# Test health endpoint
curl http://localhost:3000/health

# Test portfolio status (will use your real API key)
curl http://localhost:3000/api/strategos/v1/portfolio-status
```

### 7. DEPLOYMENT CHECKLIST

Before going live:
- [ ] API keys configured in Render environment variables
- [ ] `AUTO_TRADING_ENABLED=false` (start safe!)
- [ ] Small trade amounts configured
- [ ] Loss limits set conservatively  
- [ ] All tests passing
- [ ] Health check responding

## 🚀 READY TO GO LIVE?

1. **Configure your real API credentials** in both local `.env` and Render environment variables
2. **Test locally** to ensure everything works
3. **Deploy to Render** with conservative settings
4. **Monitor closely** and scale up gradually

## 🆘 EMERGENCY PROCEDURES

If something goes wrong:
1. **Immediately set** `AUTO_TRADING_ENABLED=false` in Render
2. **Check your Coinbase Pro account** for any unexpected trades
3. **Review application logs** in Render dashboard
4. **Disable API key** in Coinbase Pro if necessary

---

**Your Oak Dragon Covenant is ready for secure deployment! 🏰⚡**
