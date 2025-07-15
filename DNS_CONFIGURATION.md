# 🌐 DNS Configuration Guide for oakdragoncovenant.com

## Quick DNS Setup

After deploying your Oak Dragon Covenant to a cloud provider, you'll need to point your domain to the new server.

### Required DNS Records

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ (or oakdragoncovenant.com) | YOUR_SERVER_IP | 300 |
| A | www | YOUR_SERVER_IP | 300 |
| CNAME | api | oakdragoncovenant.com | 300 |

### Common Domain Registrars

#### Namecheap
1. Log into Namecheap account
2. Go to Domain List → Manage
3. Advanced DNS tab
4. Add/Edit records as shown above

#### GoDaddy
1. Log into GoDaddy account
2. My Products → DNS
3. Add/Edit records as shown above

#### Cloudflare (Recommended)
1. Add site to Cloudflare
2. Update nameservers at your registrar
3. Add DNS records in Cloudflare dashboard
4. Enable these features:
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On
   - Auto Minify: CSS, HTML, JS

#### Google Domains
1. Log into Google Domains
2. DNS settings
3. Custom records section
4. Add records as shown above

### Verification

After updating DNS (may take 5-60 minutes):

```bash
# Check if DNS has propagated
nslookup oakdragoncovenant.com
dig oakdragoncovenant.com

# Test your deployment
curl -I https://oakdragoncovenant.com/health
```

### SSL Certificate

Your deployment scripts automatically configure Let's Encrypt SSL certificates. If you need to manually renew:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Troubleshooting

**DNS not resolving:**
- Wait up to 48 hours for full propagation
- Check TTL settings (lower = faster updates)
- Use DNS checker tools online

**SSL certificate issues:**
- Ensure domain points to correct IP
- Check if ports 80 and 443 are open
- Manually run: `sudo certbot --nginx -d oakdragoncovenant.com`

### Advanced Configuration

For production setups, consider:

1. **CDN Setup (Cloudflare)**
   - Faster global loading
   - DDoS protection
   - Caching optimization

2. **Email Records**
   ```
   MX @ mail.oakdragoncovenant.com 10
   TXT @ "v=spf1 include:_spf.google.com ~all"
   ```

3. **Security Headers**
   - HSTS preload
   - CAA records
   - DMARC policy

### Monitoring

Set up monitoring for:
- Domain expiration
- SSL certificate expiration
- DNS resolution
- Website uptime

Your Oak Dragon Covenant domain will be fully operational once DNS propagates! 🏰⚡
