# Complete API Setup Guide for Oak Dragon Covenant

## 🚀 One-Click Deployment Overview

Your Oak Dragon Covenant deployment now supports **fully automated deployment** using both DigitalOcean and IONOS APIs. No more manual steps!

## 📋 Quick Start Commands

### 🎯 Fully Automated (Recommended)
```powershell
# One command deploys everything!
.\deploy-digitalocean.ps1 -AutoDeploy true -DOApiKey "your_do_api_key" -IONOSApiKey "your_ionos_key" -IONOSSecret "your_ionos_secret"
```

### 🔧 Step-by-Step (Traditional)
```powershell
# Phase 1: Setup
.\deploy-digitalocean.ps1 -Phase 1 -DOApiKey "your_do_api_key"

# Phase 2: Auto-create droplet
.\deploy-digitalocean.ps1 -Phase 2 -DOApiKey "your_do_api_key" -IONOSApiKey "your_ionos_key" -IONOSSecret "your_ionos_secret"

# Phase 3: Deploy application (IP auto-detected from Phase 2)
.\deploy-digitalocean.ps1 -Phase 3 -DropletIP "auto_detected_ip"
```

## 🔑 API Key Setup

### DigitalOcean API Key
**Why needed:** Automates droplet creation, SSH key management, and server provisioning

**How to get:**
1. Go to [DigitalOcean Control Panel](https://cloud.digitalocean.com/account/api/tokens)
2. Click "Generate New Token"
3. Name: "Oak Dragon Covenant"
4. Scopes: **Read + Write** (required for droplet creation)
5. Copy the token immediately (won't be shown again)

**Permissions needed:**
- ✅ Droplet management (create, read, delete)
- ✅ SSH key management (upload, read)
- ✅ Account information (read)
- ✅ Monitoring (read)

### IONOS API Key
**Why needed:** Automates DNS management, SSL certificates, and domain configuration

**How to get:**
1. Log into [IONOS Dashboard](https://my.ionos.com)
2. Navigate to **Account Settings**
3. Go to **API Access** and enable it
4. Create new API key:
   - Name: "Oak Dragon Covenant"
   - Permissions: DNS + SSL + Hosting
5. Copy both **public prefix** and **secret**

**Permissions needed:**
- ✅ DNS zone management
- ✅ SSL certificate provisioning
- ✅ Domain management

## 🔐 Security Best Practices

### Environment Variables (Recommended)
```powershell
# Set environment variables for security
$env:DO_API_KEY = "your_digitalocean_api_key"
$env:IONOS_API_KEY = "your_ionos_public_prefix"
$env:IONOS_SECRET = "your_ionos_secret"

# Run deployment using environment variables
.\deploy-digitalocean.ps1 -AutoDeploy true -DOApiKey $env:DO_API_KEY -IONOSApiKey $env:IONOS_API_KEY -IONOSSecret $env:IONOS_SECRET
```

### Secure Storage
```powershell
# Store credentials in Windows Credential Manager
cmdkey /add:DigitalOcean /user:OakDragon /pass:your_api_key
cmdkey /add:IONOS /user:OakDragon /pass:your_api_secret

# Retrieve when needed
$DOKey = (cmdkey /list:DigitalOcean | Select-String "Password").ToString().Split(":")[1].Trim()
```

## 🛠️ What Gets Automated

### DigitalOcean API Functions
- ✅ **SSH Key Upload**: Automatically uploads your public key
- ✅ **Droplet Creation**: Creates Ubuntu 22.04 server ($6/month)
- ✅ **Server Configuration**: Installs Node.js, Nginx, PM2, UFW
- ✅ **Monitoring Setup**: Enables DigitalOcean monitoring
- ✅ **Status Tracking**: Waits for droplet to be ready

### IONOS API Functions
- ✅ **DNS Records**: Creates A records for @, www, api, dashboard
- ✅ **SSL Certificates**: Provisions certificates for all subdomains
- ✅ **Bot Protection**: Configures IONOS-bot blocking
- ✅ **Domain Validation**: Verifies domain ownership

### Application Deployment
- ✅ **Git Clone**: Downloads latest Oak Dragon Covenant code
- ✅ **Dependencies**: Installs npm packages
- ✅ **Environment**: Configures production settings
- ✅ **Process Management**: Starts with PM2
- ✅ **Health Check**: Verifies deployment success

## 📊 Cost Breakdown

### DigitalOcean Costs
- **Droplet**: $6/month (1GB RAM, 1vCPU, 25GB SSD)
- **Bandwidth**: 1TB included (no additional cost)
- **Monitoring**: Free
- **Backups**: $1.20/month (optional, not enabled by default)

### IONOS Costs
- **Domain**: ~$12/year (if not already owned)
- **SSL Certificate**: Free with hosting
- **API Usage**: Free (within rate limits)
- **DNS Management**: Included

### Total Monthly Cost
- **Infrastructure**: $6/month
- **Remaining Budget**: $9.99/month for scaling

## 🔍 Testing Your Setup

### Test DigitalOcean API
```powershell
# Test your DO API key
.\test-digitalocean-api.ps1 -ApiKey "your_api_key"
```

### Test IONOS API
```powershell
# Test your IONOS API credentials
.\test-ionos-integration.ps1 -ApiKey "your_key" -ApiSecret "your_secret"
```

### Test Full Integration
```powershell
# Dry run without creating resources
.\deploy-digitalocean.ps1 -Phase 1 -DOApiKey "your_do_key" -IONOSApiKey "your_ionos_key" -IONOSSecret "your_ionos_secret"
```

## 🚨 Troubleshooting

### Common DigitalOcean Issues
**"Unauthorized" Error:**
- ✅ Check API key is correct
- ✅ Verify key has read+write permissions
- ✅ Check account has sufficient credits

**"SSH Connection Failed":**
- ✅ Wait 2-3 minutes after droplet creation
- ✅ Check firewall isn't blocking SSH (port 22)
- ✅ Verify SSH key was uploaded correctly

**"Droplet Creation Failed":**
- ✅ Check account limits (default: 10 droplets)
- ✅ Verify region availability (try different region)
- ✅ Check payment method is valid

### Common IONOS Issues
**"Domain Not Found":**
- ✅ Verify domain is registered with IONOS
- ✅ Check domain status in IONOS dashboard
- ✅ Ensure API has access to the domain

**"SSL Provisioning Failed":**
- ✅ Check domain DNS is configured
- ✅ Verify domain validation method
- ✅ Wait for DNS propagation (up to 24 hours)

**"Rate Limit Exceeded":**
- ✅ IONOS allows 1,200 requests/hour
- ✅ Wait for rate limit reset
- ✅ Optimize API calls if needed

## 📈 Scaling Options

### Within Budget ($15.99/month)
- **Upgrade Droplet**: $12/month (2GB RAM, 1vCPU)
- **Add Load Balancer**: $12/month (for high availability)
- **Enable Backups**: $1.20/month (automated backups)

### Performance Optimizations
- **CDN**: Use DigitalOcean Spaces + CDN
- **Database**: Add managed PostgreSQL
- **Monitoring**: Enhanced monitoring with alerts

## 🎯 Advanced Features

### Multi-Region Deployment
```powershell
# Deploy to multiple regions
.\deploy-digitalocean.ps1 -AutoDeploy true -Region "nyc3" -DOApiKey $key
.\deploy-digitalocean.ps1 -AutoDeploy true -Region "sfo3" -DOApiKey $key
```

### Custom Domain Configuration
```powershell
# Use your own domain
.\deploy-digitalocean.ps1 -AutoDeploy true -Domain "yourdomain.com" -DOApiKey $key -IONOSApiKey $ionos_key -IONOSSecret $ionos_secret
```

### Development vs Production
```powershell
# Development deployment (smaller droplet)
.\deploy-digitalocean.ps1 -AutoDeploy true -Size "s-1vcpu-512mb-10gb" -DOApiKey $key

# Production deployment (standard)
.\deploy-digitalocean.ps1 -AutoDeploy true -Size "s-1vcpu-1gb" -DOApiKey $key
```

## 🔄 Maintenance Commands

### Update Application
```powershell
# Update to latest version
ssh -i ~/.ssh/id_oak_dragon root@YOUR_IP "cd /var/www/oak-dragon && git pull && npm install && pm2 restart oak-dragon-main"
```

### Monitor Resources
```powershell
# Check server status
ssh -i ~/.ssh/id_oak_dragon root@YOUR_IP "htop"
ssh -i ~/.ssh/id_oak_dragon root@YOUR_IP "pm2 status"
```

### Backup Data
```powershell
# Create backup
ssh -i ~/.ssh/id_oak_dragon root@YOUR_IP "tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/oak-dragon"
```

## 📞 Support Resources

### DigitalOcean
- [API Documentation](https://docs.digitalocean.com/reference/api/)
- [Community Forum](https://www.digitalocean.com/community)
- [Status Page](https://status.digitalocean.com/)

### IONOS
- [Developer Portal](https://developer.ionos.com/)
- [API Documentation](https://api.ionos.com/docs/)
- [Support Center](https://www.ionos.com/help/)

### Oak Dragon Covenant
- **Deployment Issues**: Check `deployment-config.json` for settings
- **Application Logs**: `ssh root@YOUR_IP "pm2 logs oak-dragon-main"`
- **Server Logs**: `ssh root@YOUR_IP "tail -f /var/log/nginx/error.log"`

---

## 🎉 Ready to Deploy?

Choose your deployment method:

### 🚀 Ultra-Fast (5 minutes)
```powershell
.\deploy-digitalocean.ps1 -AutoDeploy true -DOApiKey "YOUR_DO_KEY" -IONOSApiKey "YOUR_IONOS_KEY" -IONOSSecret "YOUR_IONOS_SECRET"
```

### 🔧 Step-by-Step (15 minutes)
```powershell
.\deploy-digitalocean.ps1 -Phase 1
# Follow the prompts for manual steps
.\deploy-digitalocean.ps1 -Phase 2 -DOApiKey "YOUR_DO_KEY"
.\deploy-digitalocean.ps1 -Phase 3 -DropletIP "AUTO_DETECTED"
```

Your Oak Dragon Covenant ecosystem will be live and ready for trading! 🐉💰
