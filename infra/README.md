# Oak Dragon Covenant Infra Automation

This directory contains Terraform blueprints for fully automated deployment, DNS, SSL, health checks, and auto-recovery for your hybrid architecture.

## Modules
- `automated-dns-routing-terraform.md`: DNS routing from IONOS to DigitalOcean
- `ssl-auto-terraform.md`: Automated SSL provisioning (Let's Encrypt)
- `health-checks-auto-terraform.md`: Health checks and auto-recovery

## Usage
1. Fill in your credentials in `terraform.tfvars`.
2. Run `terraform init` and `terraform apply` in sequence for each module.
3. Your system will be:
   - Deployed on DigitalOcean
   - DNS routed from IONOS
   - Secured with SSL
   - Monitored and auto-recovered for uptime

## Next Steps
- Integrate with CI/CD for zero-downtime deploys
- Extend for multi-region, multi-cloud, or container clusters
- Add advanced alerting and reporting
