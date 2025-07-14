# 🚨 SECURITY INCIDENT REPORT & RECOVERY GUIDE

## INCIDENT: Private Key Exposure
**Date:** July 14, 2025
**Type:** Coinbase API Private Key Exposed
**Status:** CRITICAL - Immediate Action Required

## 🛑 IMMEDIATE RECOVERY STEPS

### STEP 1: Revoke Compromised API Key (DO NOW!)
1. **Go to:** https://pro.coinbase.com/profile/api
2. **Find API Key:** `787a026a-407f-4825-bb56-69b6ba2bbedc`
3. **DELETE IT IMMEDIATELY** - Click delete/revoke
4. **Confirm deletion** - This key is now compromised

### STEP 2: Check Your Account Security
1. **Review recent trades** in your Coinbase Pro account
2. **Check account balance** for any unauthorized transactions
3. **Review login history** for suspicious activity
4. **Enable 2FA** if not already enabled

### STEP 3: Create New API Keys (After Deleting Old Ones)
1. **Wait for old key deletion** to be confirmed
2. **Create new API key** with these permissions ONLY:
   - ✅ View
   - ✅ Trade  
   - ❌ Transfer (keep disabled)
3. **Use a passphrase** for additional security
4. **Store securely** - never share or post anywhere

### STEP 4: Secure Your Environment
1. **Update your local .env** with new credentials
2. **Update Render environment variables** with new credentials
3. **Never store private keys in plain text**
4. **Use environment variables only**

## 🔒 SECURITY BEST PRACTICES GOING FORWARD

### ✅ DO:
- Store API keys in environment variables only
- Use strong passphrases for API keys
- Enable 2FA on all accounts
- Regularly rotate API keys
- Monitor account activity
- Start with paper trading (`AUTO_TRADING_ENABLED=false`)

### ❌ NEVER:
- Share private keys or secrets in messages/chat
- Commit API keys to version control
- Store keys in plain text files
- Give API keys transfer permissions
- Use API keys on untrusted systems

## 🛡️ ENHANCED SECURITY SETUP

After creating new API keys, use this secure configuration:

### Local Development (.env):
```bash
# New secure API keys (replace with your new ones)
COINBASE_API_KEY=your_new_32_char_api_key
COINBASE_API_SECRET=your_new_88_char_secret
COINBASE_PASSPHRASE=your_secure_passphrase

# Security settings
NODE_ENV=development
AUTO_TRADING_ENABLED=false
MAX_TRADE_AMOUNT=1
DAILY_LOSS_LIMIT=0.50
RISK_TOLERANCE=low
```

### Render Production:
Add these environment variables in Render dashboard:
- `COINBASE_API_KEY` = your new API key
- `COINBASE_API_SECRET` = your new secret  
- `COINBASE_PASSPHRASE` = your passphrase
- `AUTO_TRADING_ENABLED` = false
- `MAX_TRADE_AMOUNT` = 1
- `DAILY_LOSS_LIMIT` = 0.50

## 📊 MONITORING & VERIFICATION

After recovery:
1. **Test new API keys** with paper trading only
2. **Monitor logs** for any errors
3. **Verify account security** regularly
4. **Start with micro-amounts** when ready for live trading

## 🆘 IF YOU SUSPECT UNAUTHORIZED ACTIVITY

1. **Immediately contact Coinbase Pro support**
2. **Change your account password**
3. **Review and secure all API keys**
4. **Document any suspicious transactions**
5. **Consider temporarily disabling API access**

---

## ✅ RECOVERY CHECKLIST

- [ ] Deleted compromised API key from Coinbase Pro
- [ ] Verified no unauthorized transactions
- [ ] Created new API keys with minimal permissions
- [ ] Updated local .env with new credentials
- [ ] Updated Render environment variables
- [ ] Enabled 2FA on Coinbase Pro account
- [ ] Set conservative trading limits
- [ ] Tested system with paper trading only

**Remember: Security first, trading second. Never compromise on API key security!**

🏰 Your Oak Dragon Covenant remains strong with proper security! ⚡
