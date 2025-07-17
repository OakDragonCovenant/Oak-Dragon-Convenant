# Oak Dragon Covenant: Automated DNS Routing (IONOS → DigitalOcean)

This Terraform configuration automates the setup of DNS records on IONOS to route your domain to DigitalOcean infrastructure. It also provisions a DigitalOcean droplet and outputs the IP for DNS mapping.

## Prerequisites
- IONOS API credentials
- DigitalOcean API token
- Terraform installed

---

# main.tf

provider "ionoscloud" {
  username = var.ionos_username
  password = var.ionos_password
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "main" {
  image  = "ubuntu-22-04-x64"
  name   = "oakdragon-main"
  region = "nyc3"
  size   = "s-2vcpu-4gb"
  ssh_keys = [var.do_ssh_fingerprint]
}

resource "ionoscloud_domain" "oakdragon" {
  name = var.domain_name
}

resource "ionoscloud_dns_record" "oakdragon_a" {
  domain = ionoscloud_domain.oakdragon.name
  name   = "@"
  type   = "A"
  value  = digitalocean_droplet.main.ipv4_address
  ttl    = 3600
}

output "do_droplet_ip" {
  value = digitalocean_droplet.main.ipv4_address
}

---

# variables.tf

variable "ionos_username" {}
variable "ionos_password" {}
variable "do_token" {}
variable "do_ssh_fingerprint" {}
variable "domain_name" {}

---

# Usage
1. Fill in your credentials in a `terraform.tfvars` file:

ionos_username = "your-ionos-username"
ionos_password = "your-ionos-password"
do_token = "your-digitalocean-token"
do_ssh_fingerprint = "your-ssh-key-fingerprint"
domain_name = "yourdomain.com"

2. Run:
   terraform init
   terraform apply

This will:
- Provision a DigitalOcean droplet
- Automatically create an A record in IONOS DNS pointing your domain to the droplet

---

# Security & Extensions
- Add SSL provisioning (Let's Encrypt or IONOS SSL)
- Add DNSSEC, DMARC, SPF records for email/domain security
- Extend to load balancers, multiple droplets, or container clusters

---

# Next Steps
- Integrate with CI/CD for automated deployments
- Add health checks and auto-recovery
- Use outputs for further automation (e.g., webhook endpoints)
