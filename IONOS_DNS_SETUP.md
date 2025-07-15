# 🌐 IONOS DNS CONFIGURATION GUIDE
# Complete DNS setup for oakdragoncovenant.com with IONOS hosting

## Current Domain: oakdragoncovenant.com (IONOS)

### Recommended DNS Records Configuration

```
# Main domain pointing to primary service
Type    | Name               | Value/Target                           | TTL   | Priority
--------|--------------------|-----------------------------------------|-------|----------
A       | @                  | [Railway/Render Primary IP]           | 3600  | -
A       | www                | [Railway/Render Primary IP]           | 3600  | -
CNAME   | trading            | oak-dragon-covenant.onrender.com       | 3600  | -
CNAME   | dashboard          | oak-dragon-covenant-dashboard.vercel.app | 3600 | -
CNAME   | api                | oak-dragon-covenant.up.railway.app     | 3600  | -
CNAME   | backup             | oak-dragon-backup.onrender.com         | 3600  | -
CNAME   | command            | oak-dragon-command.vercel.app           | 3600  | -
CNAME   | portal             | oak-dragon-portal.vercel.app            | 3600  | -
CNAME   | monitor            | oak-dragon-monitor.up.railway.app       | 3600  | -
TXT     | @                  | v=spf1 include:_spf.ionos.com ~all     | 3600  | -
TXT     | _dmarc             | v=DMARC1; p=quarantine; rua=mailto:admin@oakdragoncovenant.com | 3600 | -
```

### Service Mapping Strategy

1. **Main Domain (oakdragoncovenant.com)**
   - Primary landing page and authentication
   - Hosted on Railway (primary) with Render backup

2. **trading.oakdragoncovenant.com**
   - Live trading dashboard and bot interface
   - Real-time market data and trade execution
   - Hosted on Render (optimized for uptime)

3. **dashboard.oakdragoncovenant.com**
   - Command center and system overview
   - Portfolio analytics and performance metrics
   - Hosted on Vercel (fast global CDN)

4. **api.oakdragoncovenant.com**
   - REST API endpoints for trading operations
   - Webhook endpoints for external integrations
   - Hosted on Railway (low latency)

5. **command.oakdragoncovenant.com**
   - Interactive command interface
   - LayeredAgentFramework ritual execution
   - Hosted on Vercel (serverless functions)

6. **portal.oakdragoncovenant.com**
   - Secure member portal and document access
   - Enhanced landing page with authentication
   - Hosted on Vercel (static + serverless)

### IONOS DNS Setup Steps

1. **Login to IONOS Control Panel**
   - Go to: https://my.ionos.com/domain-dns-settings/oakdragoncovenant.com
   - Navigate to DNS settings

2. **Add/Update A Records**
   ```
   @ (root domain) → [Primary Server IP]
   www → [Primary Server IP]
   ```

3. **Add CNAME Records**
   ```
   trading → oak-dragon-covenant.onrender.com
   dashboard → oak-dragon-covenant-dashboard.vercel.app
   api → oak-dragon-covenant.up.railway.app
   command → oak-dragon-command.vercel.app
   portal → oak-dragon-portal.vercel.app
   backup → oak-dragon-backup.onrender.com
   monitor → oak-dragon-monitor.up.railway.app
   ```

4. **Add Security Records**
   ```
   TXT @ → "v=spf1 include:_spf.ionos.com ~all"
   TXT _dmarc → "v=DMARC1; p=quarantine; rua=mailto:admin@oakdragoncovenant.com"
   ```

### SSL/TLS Configuration

- Enable SSL for all subdomains in IONOS panel
- Configure automatic HTTPS redirect
- Use Cloudflare proxy if needed for additional security

### Deployment URLs After DNS Setup

- **Main Site**: https://oakdragoncovenant.com
- **Trading Dashboard**: https://trading.oakdragoncovenant.com
- **Command Center**: https://dashboard.oakdragoncovenant.com
- **API Gateway**: https://api.oakdragoncovenant.com
- **Command Interface**: https://command.oakdragoncovenant.com
- **Member Portal**: https://portal.oakdragoncovenant.com
- **Backup Site**: https://backup.oakdragoncovenant.com
- **System Monitor**: https://monitor.oakdragoncovenant.com

### Testing DNS Propagation

```bash
# Test DNS resolution
nslookup oakdragoncovenant.com
nslookup trading.oakdragoncovenant.com
nslookup dashboard.oakdragoncovenant.com

# Test HTTP responses
curl -I https://oakdragoncovenant.com
curl -I https://trading.oakdragoncovenant.com
curl -I https://dashboard.oakdragoncovenant.com
```

### Next Steps

1. Configure DNS records in IONOS panel
2. Deploy services to cloud providers with custom domains
3. Update LayeredAgentFramework cloud configuration
4. Test all endpoints and subdomain routing
5. Enable monitoring and health checks
