# 🌐 OAKDRAGONCOVENANT.COM DEPLOYMENT GUIDE
# Complete setup for your domain with IONOS DNS

## 🎯 IMMEDIATE ACTION ITEMS

### 1. IONOS DNS Configuration (Do this first!)

Login to your IONOS control panel: https://my.ionos.com/domain-dns-settings/oakdragoncovenant.com

**Add these DNS records:**

```
Record Type | Name        | Value/Target                                | TTL
------------|-------------|---------------------------------------------|------
A           | @           | [Railway deployment IP - get after deploy] | 3600
A           | www         | [Railway deployment IP - get after deploy] | 3600
CNAME       | trading     | oak-dragon-covenant.onrender.com           | 3600
CNAME       | dashboard   | oak-dragon-covenant.vercel.app              | 3600
CNAME       | api         | oak-dragon-api.up.railway.app               | 3600
CNAME       | command     | oak-dragon-command.vercel.app               | 3600
CNAME       | portal      | oak-dragon-portal.vercel.app                | 3600
CNAME       | monitor     | oak-dragon-monitor.up.railway.app           | 3600
TXT         | @           | v=spf1 include:_spf.ionos.com ~all         | 3600
TXT         | _dmarc      | v=DMARC1; p=quarantine; rua=mailto:admin@oakdragoncovenant.com | 3600
```

### 2. Deploy to Cloud Providers

Run these PowerShell commands in your project directory:

```powershell
# 1. Deploy domain configuration
.\deploy-domain.ps1 -SetupDNS

# 2. Deploy to all cloud providers
.\deploy-domain.ps1 -DeployAll

# 3. Test domain resolution
.\deploy-domain.ps1 -TestDomains

# 4. Update framework with domain config
.\deploy-domain.ps1 -UpdateFramework

# 5. Start monitoring
.\monitor-free-cloud.ps1 -Dashboard -Alerts
```

## 🚀 YOUR NEW SERVICE ARCHITECTURE

After deployment, your services will be available at:

### 🏠 **Main Domain**
- **URL**: https://oakdragoncovenant.com
- **Purpose**: Landing page & authentication portal
- **Provider**: Railway (primary)
- **Features**: Secure login, member portal access

### 📊 **Trading Dashboard**
- **URL**: https://trading.oakdragoncovenant.com
- **Purpose**: Live trading interface & bot control
- **Provider**: Render (750 free hours/month)
- **Features**: Real-time trading, portfolio management

### 🎛️ **Command Center**
- **URL**: https://dashboard.oakdragoncovenant.com
- **Purpose**: System overview & analytics
- **Provider**: Vercel (unlimited free tier)
- **Features**: Performance metrics, system health

### 🔧 **Command Interface**
- **URL**: https://command.oakdragoncovenant.com
- **Purpose**: Interactive ritual command execution
- **Provider**: Vercel (serverless functions)
- **Features**: LayeredAgentFramework commands

### 🚪 **Member Portal**
- **URL**: https://portal.oakdragoncovenant.com
- **Purpose**: Enhanced member area
- **Provider**: Vercel (static + serverless)
- **Features**: Documentation, resources, support

### 🔌 **API Gateway**
- **URL**: https://api.oakdragoncovenant.com
- **Purpose**: REST API & webhook endpoints
- **Provider**: Railway (500 free hours/month)
- **Features**: Trading API, integrations, webhooks

### 📈 **System Monitor**
- **URL**: https://monitor.oakdragoncovenant.com
- **Purpose**: Real-time system monitoring
- **Provider**: Railway (monitoring instance)
- **Features**: Health checks, performance tracking

## 🛠️ FRAMEWORK INTEGRATION

Your LayeredAgentFramework now supports domain-specific commands:

```javascript
// Deploy to your domain
!clouddeploy trading-bot --domain=oakdragoncovenant.com --provider=railway

// Check domain status
!freecloud status --domain=oakdragoncovenant.com

// Execute failover between subdomains
!failover --from=trading.oakdragoncovenant.com --to=dashboard.oakdragoncovenant.com
```

## 📋 DEPLOYMENT CHECKLIST

### Phase 1: DNS Setup (5 minutes)
- [ ] Login to IONOS control panel
- [ ] Add A records for @ and www
- [ ] Add CNAME records for all subdomains
- [ ] Add security TXT records
- [ ] Enable SSL for all subdomains

### Phase 2: Cloud Deployment (15 minutes)
- [ ] Install CLIs: `npm install -g @railway/cli vercel`
- [ ] Login to providers: `railway login`, `vercel login`
- [ ] Run deployment script: `.\deploy-domain.ps1 -DeployAll`
- [ ] Configure custom domains in each provider dashboard

### Phase 3: Testing & Monitoring (10 minutes)
- [ ] Test domain resolution: `.\deploy-domain.ps1 -TestDomains`
- [ ] Verify SSL certificates are active
- [ ] Start monitoring dashboard: `.\monitor-free-cloud.ps1 -Dashboard`
- [ ] Test LayeredAgentFramework commands

### Phase 4: Go Live (5 minutes)
- [ ] Update DNS A records with final Railway IP
- [ ] Test all subdomain endpoints
- [ ] Enable automated monitoring alerts
- [ ] Document access URLs for team

## 🔧 PROVIDER-SPECIFIC SETUP

### Railway Configuration
```bash
# Link project to Railway
railway link

# Set custom domain
railway domain add api.oakdragoncovenant.com
railway domain add oakdragoncovenant.com
railway domain add monitor.oakdragoncovenant.com

# Deploy
railway up
```

### Render Configuration
1. Connect GitHub repository to Render
2. Set custom domain: `trading.oakdragoncovenant.com`
3. Enable auto-deploy from main branch
4. Configure environment variables

### Vercel Configuration
```bash
# Deploy with custom domains
vercel --prod

# Add domains
vercel domains add dashboard.oakdragoncovenant.com
vercel domains add command.oakdragoncovenant.com
vercel domains add portal.oakdragoncovenant.com
```

## 🔒 SECURITY CONFIGURATION

### SSL/TLS Setup
- All subdomains will have automatic SSL certificates
- HSTS headers are configured in server.js
- CSP headers prevent XSS attacks

### Access Control
- Authentication required for sensitive endpoints
- Rate limiting on API routes
- CORS configured for your domain only

## 📊 MONITORING & ALERTS

### Real-time Monitoring
```powershell
# Start comprehensive monitoring
.\monitor-free-cloud.ps1 -Dashboard -Alerts -RefreshInterval 30

# Export monitoring data
.\monitor-free-cloud.ps1 -Export -ExportPath "daily-report.json"
```

### Alert Thresholds
- Resource usage > 80% of free tier
- Response time > 5 seconds
- Service availability < 99%
- DNS resolution failures

## 🚨 TROUBLESHOOTING

### Common Issues

1. **DNS not resolving**
   - Wait 15-30 minutes for propagation
   - Check IONOS DNS settings
   - Test with: `nslookup trading.oakdragoncovenant.com`

2. **SSL certificate issues**
   - Verify domain ownership in provider dashboards
   - Check CNAME records are correct
   - Allow 10-15 minutes for certificate generation

3. **Deployment failures**
   - Check provider CLI authentication
   - Verify environment variables
   - Review build logs in provider dashboards

### Emergency Procedures
```powershell
# Quick health check
.\monitor-free-cloud.ps1

# Emergency failover
.\deploy-free-cloud.ps1 -Failover -FailoverFrom railway -FailoverTo render

# Framework status check
node -e "const f=require('./OakDragonCovenant/Modules/layeredAgentFramework.js'); new f().executeRitual({type:'freecloud',action:'status'}).then(console.log)"
```

## 🎉 NEXT STEPS

1. **Complete DNS setup in IONOS** (highest priority)
2. **Deploy to all cloud providers**
3. **Test all subdomain endpoints**
4. **Configure monitoring alerts**
5. **Share access URLs with your team**

## 📞 SUPPORT RESOURCES

- **IONOS DNS Help**: https://www.ionos.com/help/domains/
- **Railway Docs**: https://docs.railway.app/
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

Your Oak Dragon Covenant infrastructure will be fully operational across your custom domain with 24/7 monitoring and automatic failover capabilities!
