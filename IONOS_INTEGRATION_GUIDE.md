# IONOS Integration Guide for Oak Dragon Covenant

## Overview
This guide covers integrating IONOS APIs with your DigitalOcean deployment for automated domain management, DNS configuration, SSL provisioning, and bot protection.

## Prerequisites
1. IONOS account with hosting services
2. Domain registered with IONOS
3. API access enabled in IONOS dashboard

## Quick Start

### 1. Enable IONOS API Access
1. Sign in to your IONOS dashboard
2. Navigate to Account Settings
3. Find "API Access" section and enable it
4. Agree to the API terms of service

### 2. Create API Key
1. Go to the API Keys portal in your IONOS dashboard
2. Click "Create New Key"
3. Assign a descriptive label (e.g., "Oak Dragon Covenant")
4. Copy both the public prefix and secret
5. **Important**: Store the secret securely - it won't be shown again

### 3. Run Enhanced Deployment
```powershell
# With IONOS integration
.\deploy-digitalocean.ps1 -Phase 1 -IONOSApiKey "your-public-prefix" -IONOSSecret "your-secret"

# Continue with Phase 2
.\deploy-digitalocean.ps1 -Phase 2 -DropletIP "your-droplet-ip" -IONOSApiKey "your-public-prefix" -IONOSSecret "your-secret"

# Complete with Phase 3
.\deploy-digitalocean.ps1 -Phase 3 -DropletIP "your-droplet-ip" -IONOSApiKey "your-public-prefix" -IONOSSecret "your-secret"
```

## Features Included

### Automated DNS Management
- **A Records**: Automatically creates records for @, www, api, dashboard
- **TTL Settings**: Optimized for performance (3600 seconds)
- **Validation**: Checks domain ownership before modification

### SSL Certificate Provisioning
- **Let's Encrypt Alternative**: Uses IONOS SSL certificates
- **Multi-Domain**: Covers main domain and subdomains
- **Auto-Renewal**: Managed by IONOS infrastructure

### Bot Protection
- **IONOS-bot Control**: Blocks or throttles IONOS crawler
- **Rate Limiting**: Protects against aggressive crawling
- **Custom Rules**: Flexible protection policies

## Manual Configuration (If API Not Available)

### DNS Records
If IONOS API credentials aren't provided, configure these manually:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_DROPLET_IP | 3600 |
| A | www | YOUR_DROPLET_IP | 3600 |
| A | api | YOUR_DROPLET_IP | 3600 |
| A | dashboard | YOUR_DROPLET_IP | 3600 |

### SSL Setup
Without IONOS API, use Let's Encrypt on your droplet:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Bot Protection Details

### Files Created
1. **`.htaccess`**: Apache/Nginx rules for bot blocking
2. **`robots.txt`**: Crawl directives for search engines

### Protection Rules
- Blocks IONOS-bot from sensitive areas (/api/, /dashboard/)
- Allows general crawling of public content
- Implements rate limiting for all bots

### Advanced Configuration
```apache
# Custom IONOS bot handling
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} IONOS-bot [NC]
RewriteCond %{REQUEST_URI} !^/public/ [NC]
RewriteRule .* - [F,L]
```

## API Rate Limits
- **Limit**: 1,200 requests per hour per API key
- **Monitoring**: Check headers: `X-RateLimit-Remaining`
- **Error**: HTTP 429 when limit exceeded

## Authentication Methods

### Primary (Hosting API)
```powershell
$headers = @{
    "X-API-Key" = "publicprefix.secret"
    "Content-Type" = "application/json"
}
```

### Alternative (Cloud API)
```bash
# Generate bearer token
curl --request GET 'https://api.ionos.com/auth/v1/tokens/generate' \
     --header 'Authorization: Basic <Base64(username:password)>'
```

## Troubleshooting

### Common Issues
1. **DNS Not Propagating**: Wait 15-30 minutes for global propagation
2. **SSL Certificate Failed**: Check domain validation and DNS records
3. **API Rate Limit**: Wait for rate limit reset (hourly)
4. **Bot Protection Too Aggressive**: Adjust rules in .htaccess

### Debug Commands
```powershell
# Test DNS propagation
nslookup yourdomain.com

# Check SSL certificate
curl -I https://yourdomain.com

# Verify bot protection
curl -A "IONOS-bot" https://yourdomain.com/api/
```

## Security Best Practices

### API Key Security
- Store credentials in environment variables
- Use separate keys for different environments
- Rotate keys regularly (quarterly recommended)
- Monitor API usage in IONOS dashboard

### Bot Protection Strategy
- Whitelist legitimate crawlers
- Log blocked requests for analysis
- Update protection rules based on traffic patterns
- Monitor server resources and adjust as needed

## Integration with Oak Dragon Covenant

### Environment Variables
The deployment automatically sets:
```bash
DOMAIN=yourdomain.com
IONOS_API_KEY=your-key
IONOS_SSL_ENABLED=true
BOT_PROTECTION=enabled
```

### Monitoring Integration
Bot protection logs are integrated with your monitoring dashboard at:
- Dashboard: `https://yourdomain.com/dashboard`
- API Status: `https://yourdomain.com/api/status`

## Cost Analysis

### IONOS Services
- **Domain**: ~$12/year
- **SSL Certificate**: Free with hosting
- **API Usage**: Free (within rate limits)
- **DNS Management**: Included with domain

### Total Integration Cost
- **Additional Cost**: $0 (uses existing IONOS services)
- **Savings**: Automated management reduces manual work
- **ROI**: Improved uptime and security

## Support and Documentation

### IONOS Resources
- [Developer Portal](https://developer.ionos.com/)
- [API Documentation](https://api.ionos.com/docs/)
- [Support Center](https://www.ionos.com/help/)

### Oak Dragon Covenant
- Main deployment guide: `deploy-digitalocean.ps1`
- Domain setup: `DOMAIN_DEPLOYMENT_GUIDE.md`
- DNS configuration: `DNS_CONFIGURATION.md`

---

**Next Steps**: After successful integration, proceed to configure your trading bots and API keys for the full Oak Dragon Covenant ecosystem.
