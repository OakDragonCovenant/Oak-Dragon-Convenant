# Oak Dragon Covenant: Automated SSL Provisioning (Let's Encrypt)

This Terraform extension automates SSL certificate provisioning for your DigitalOcean droplet using Let's Encrypt via the DigitalOcean Load Balancer. It integrates with the previous DNS automation for a secure, production-ready deployment.

---

# ssl.tf

resource "digitalocean_certificate" "oakdragon_ssl" {
  name       = "oakdragon-ssl"
  type       = "lets_encrypt"
  domains    = [var.domain_name]
}

resource "digitalocean_loadbalancer" "oakdragon_lb" {
  name      = "oakdragon-lb"
  region    = digitalocean_droplet.main.region
  forwarding_rule {
    entry_protocol  = "https"
    entry_port      = 443
    target_protocol = "http"
    target_port     = 80
    certificate_id  = digitalocean_certificate.oakdragon_ssl.id
  }
  droplet_ids = [digitalocean_droplet.main.id]
}

output "ssl_certificate_status" {
  value = digitalocean_certificate.oakdragon_ssl.state
}
output "load_balancer_ip" {
  value = digitalocean_loadbalancer.oakdragon_lb.ip
}

---

# Usage
1. Add this file to your Terraform project.
2. Run `terraform apply` after DNS and droplet setup.
3. Your domain will be secured with a free Let's Encrypt SSL certificate, automatically renewed by DigitalOcean.

---

# Notes
- For multi-domain or wildcard SSL, adjust the `domains` array.
- For IONOS SSL, use their control panel or API for certificate provisioning.
- For advanced security, add DNSSEC, DMARC, and SPF records in your DNS provider.

---

# Next Steps
- Integrate with CI/CD for zero-downtime SSL renewals
- Add health checks and auto-recovery for load balancer
- Extend to Kubernetes or container clusters if needed
