#!/bin/bash

# AWS EC2 User Data Script for Strategos Protocol
# This script runs when the EC2 instance first boots

# Update system
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /opt/strategos
sudo chown ubuntu:ubuntu /opt/strategos

# Clone your repository (you'll need to update this with your repo)
cd /opt/strategos
# git clone https://github.com/yourusername/strategos-protocol.git .

# Copy your files (for now, you'll upload manually)
# Later we'll automate this with GitHub Actions or AWS CodeDeploy

# Install dependencies
npm install

# Set up environment variables
cat > .env << EOL
COINBASE_API_KEY=your_key_here
COINBASE_API_SECRET=your_secret_here
NODE_ENV=production
EOL

# Start the application with PM2
pm2 start server.js --name "strategos-trading-bot"
pm2 startup
pm2 save

# Set up log rotation
sudo cp /etc/logrotate.d/rsyslog /etc/logrotate.d/strategos
sudo sed -i 's/\/var\/log\/syslog/\/opt\/strategos\/logs\/*.log/g' /etc/logrotate.d/strategos

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

echo "Strategos Protocol deployment complete!"
echo "Access your trading bot at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
