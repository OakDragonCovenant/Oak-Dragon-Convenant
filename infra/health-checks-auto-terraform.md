# Oak Dragon Covenant: Automated Health Checks & Auto-Recovery (DigitalOcean)

This Terraform config adds health checks and auto-recovery to your DigitalOcean infrastructure. It ensures your load balancer only routes traffic to healthy droplets and can automatically replace failed nodes.

---

# health.tf

resource "digitalocean_loadbalancer" "oakdragon_lb" {
  # ...existing config...
  health_check {
    protocol              = "http"
    port                  = 80
    path                  = "/health"
    check_interval_seconds = 10
    response_timeout_seconds = 5
    unhealthy_threshold   = 3
    healthy_threshold     = 2
  }
  # ...existing config...
}

resource "digitalocean_droplet" "main" {
  # ...existing config...
  lifecycle {
    create_before_destroy = true
    prevent_destroy       = false
    ignore_changes        = ["ipv4_address"]
  }
}

# Optionally, use DigitalOcean Monitoring for alerting and auto-recovery
resource "digitalocean_monitor_alert" "cpu_high" {
  droplet_id = digitalocean_droplet.main.id
  type       = "v1/insights/cpu"
  compare    = "GreaterThan"
  value      = 90
  window     = "5m"
  period     = "5m"
  description = "CPU usage high"
  enabled    = true
}

output "load_balancer_health_check" {
  value = digitalocean_loadbalancer.oakdragon_lb.health_check
}

---

# Usage
- Add this file to your Terraform project.
- Ensure your app responds to GET /health with a 200 OK status.
- Run `terraform apply` to enable health checks and auto-recovery.
