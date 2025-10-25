#!/bin/bash
set -e

# Context8 Landing Page - Server Setup Script
# This script prepares a fresh Ubuntu/Debian server for deployment
# Run as root or with sudo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo_error "This script must be run as root (use sudo)"
   exit 1
fi

echo_info "Starting Context8 server setup..."

# 1. System Update
echo_info "Step 1/8: Updating system packages..."
apt update
apt upgrade -y
apt autoremove -y

# 2. Install Essential Packages
echo_info "Step 2/8: Installing essential packages..."
apt install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    htop \
    vim \
    ca-certificates \
    gnupg \
    lsb-release

# 3. Create Deployment User
echo_info "Step 3/8: Creating deployment user..."
DEPLOY_USER="deployer"

if id "$DEPLOY_USER" &>/dev/null; then
    echo_warn "User $DEPLOY_USER already exists, skipping creation"
else
    useradd -m -s /bin/bash "$DEPLOY_USER"
    echo_info "User $DEPLOY_USER created"
fi

# Add to sudo group
usermod -aG sudo "$DEPLOY_USER"

# Setup SSH directory
mkdir -p /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh

echo_info "Please paste your SSH public key (or press Enter to skip):"
read -r SSH_PUBLIC_KEY

if [ -n "$SSH_PUBLIC_KEY" ]; then
    echo "$SSH_PUBLIC_KEY" > /home/$DEPLOY_USER/.ssh/authorized_keys
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    echo_info "SSH key added for $DEPLOY_USER"
else
    echo_warn "No SSH key provided. You can add it later to /home/$DEPLOY_USER/.ssh/authorized_keys"
fi

# 4. Install Docker
echo_info "Step 4/8: Installing Docker..."
if command -v docker &> /dev/null; then
    echo_warn "Docker already installed, skipping"
else
    # Remove old versions
    apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh

    # Add deployer to docker group
    usermod -aG docker "$DEPLOY_USER"

    echo_info "Docker installed successfully"
fi

# Install Docker Compose plugin
if docker compose version &> /dev/null; then
    echo_warn "Docker Compose already installed, skipping"
else
    apt install -y docker-compose-plugin
    echo_info "Docker Compose installed successfully"
fi

# Enable Docker service
systemctl enable docker
systemctl start docker

# 5. Configure Firewall (UFW)
echo_info "Step 5/8: Configuring firewall..."
ufw --force reset

# Allow SSH (important!)
ufw allow 22/tcp comment 'SSH'

# Allow HTTP/HTTPS
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 443/udp comment 'HTTP/3'

# Enable firewall
ufw --force enable
echo_info "Firewall configured and enabled"

# 6. Configure Fail2ban
echo_info "Step 6/8: Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

cat > /etc/fail2ban/jail.local <<EOF
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
EOF

systemctl restart fail2ban
echo_info "Fail2ban configured"

# 7. SSH Hardening
echo_info "Step 7/8: Hardening SSH configuration..."
SSH_CONFIG="/etc/ssh/sshd_config"

# Backup original config
cp $SSH_CONFIG ${SSH_CONFIG}.backup

# Apply hardening
sed -i 's/#*PermitRootLogin.*/PermitRootLogin no/' $SSH_CONFIG
sed -i 's/#*PasswordAuthentication.*/PasswordAuthentication no/' $SSH_CONFIG
sed -i 's/#*PubkeyAuthentication.*/PubkeyAuthentication yes/' $SSH_CONFIG
sed -i 's/#*ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/' $SSH_CONFIG
sed -i 's/#*X11Forwarding.*/X11Forwarding no/' $SSH_CONFIG

# Add if not exists
grep -q "^AllowUsers" $SSH_CONFIG || echo "AllowUsers $DEPLOY_USER" >> $SSH_CONFIG

echo_info "SSH hardened (root login disabled, password auth disabled)"
echo_warn "IMPORTANT: Make sure you can login with SSH key before logging out!"

# 8. Setup Application Directory
echo_info "Step 8/8: Setting up application directory..."
APP_DIR="/opt/context8-landing"

mkdir -p $APP_DIR
chown -R $DEPLOY_USER:$DEPLOY_USER $APP_DIR

# Create environment file placeholder
cat > $APP_DIR/.env.production <<EOF
# Production Environment Variables
# Edit this file with your actual values

NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.context8.io
DOMAIN=context8.io
DOCKER_BUILD=true
EOF

chown $DEPLOY_USER:$DEPLOY_USER $APP_DIR/.env.production
chmod 600 $APP_DIR/.env.production

echo_info "Application directory created at $APP_DIR"

# Summary
echo ""
echo_info "========================================"
echo_info "Server setup completed successfully!"
echo_info "========================================"
echo ""
echo_info "Summary:"
echo "  - Deployment user: $DEPLOY_USER"
echo "  - Application directory: $APP_DIR"
echo "  - Docker version: $(docker --version)"
echo "  - Docker Compose version: $(docker compose version)"
echo "  - Firewall: enabled (ports 22, 80, 443)"
echo "  - Fail2ban: enabled"
echo "  - SSH: hardened (password auth disabled)"
echo ""
echo_info "Next steps:"
echo "  1. Test SSH login with key: ssh $DEPLOY_USER@YOUR_SERVER_IP"
echo "  2. Edit environment file: sudo nano $APP_DIR/.env.production"
echo "  3. Point your domain DNS to this server IP"
echo "  4. Deploy application: run deployment script or GitHub Actions"
echo ""
echo_warn "IMPORTANT: Test SSH key login in a new terminal before closing this session!"
echo ""

# Optional: Restart SSH (ask user first)
echo_info "Restart SSH to apply configuration? (y/n)"
read -r RESTART_SSH

if [ "$RESTART_SSH" = "y" ]; then
    systemctl restart sshd
    echo_info "SSH restarted. Test your connection in a new terminal!"
else
    echo_warn "Remember to restart SSH manually: sudo systemctl restart sshd"
fi
