# GitHub Secrets Configuration

This document describes all GitHub Secrets required for CI/CD workflows.

## Required Secrets

Navigate to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Deployment Secrets (Required)

| Secret Name | Description | How to Obtain |
|------------|-------------|---------------|
| `SSH_PRIVATE_KEY` | SSH private key for deployment | Generate with `ssh-keygen -t ed25519 -C "github-actions"` |
| `SERVER_HOST` | Server IP address or hostname | Your VPS IP (e.g., `123.45.67.89`) |
| `DOMAIN` | Production domain name | Your domain (e.g., `context8.io`) |
| `NEXT_PUBLIC_API_URL` | API endpoint URL | Your API URL (e.g., `https://api.context8.io`) |

### Optional Secrets (Recommended)

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `CODECOV_TOKEN` | Code coverage reporting | Coverage reports |
| `SNYK_TOKEN` | Security vulnerability scanning | Security scans |
| `SLACK_WEBHOOK_URL` | Slack notifications | Deploy notifications |
| `MAIL_USERNAME` | Email for notifications | Failure alerts |
| `MAIL_PASSWORD` | Email password | Failure alerts |
| `ALERT_EMAIL` | Email to receive alerts | Failure notifications |

## Setup Instructions

### 1. SSH Key Setup

Generate a new SSH key pair for GitHub Actions:

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
```

This creates two files:
- `~/.ssh/github-actions` (private key) → Add to GitHub Secret `SSH_PRIVATE_KEY`
- `~/.ssh/github-actions.pub` (public key) → Add to server's `authorized_keys`

**Add private key to GitHub:**
```bash
# Copy the private key
cat ~/.ssh/github-actions
# Copy the entire output including -----BEGIN and -----END lines
```

Go to GitHub repo → Settings → Secrets → New secret:
- Name: `SSH_PRIVATE_KEY`
- Value: Paste the entire private key

**Add public key to server:**
```bash
# Copy the public key
cat ~/.ssh/github-actions.pub

# SSH to your server as deployer user
ssh deployer@YOUR_SERVER_IP

# Add the public key
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Test the connection from local machine
ssh -i ~/.ssh/github-actions deployer@YOUR_SERVER_IP
```

### 2. Server Configuration

Add these secrets to GitHub:

```bash
# SERVER_HOST
Your server IP address (e.g., 123.45.67.89)

# DOMAIN
context8.io

# NEXT_PUBLIC_API_URL
https://api.context8.io
```

### 3. Code Coverage (Optional)

Sign up at [codecov.io](https://codecov.io) and get your token:

1. Link GitHub repository
2. Copy the upload token
3. Add to GitHub Secrets as `CODECOV_TOKEN`

### 4. Security Scanning (Optional)

Sign up at [snyk.io](https://snyk.io):

1. Link GitHub repository
2. Go to Settings → API Token
3. Copy token and add to GitHub Secrets as `SNYK_TOKEN`

### 5. Slack Notifications (Optional)

Create a Slack incoming webhook:

1. Go to Slack App Directory
2. Search for "Incoming WebHooks"
3. Choose channel for notifications
4. Copy webhook URL
5. Add to GitHub Secrets as `SLACK_WEBHOOK_URL`

### 6. Email Notifications (Optional)

For Gmail:

1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App Passwords
3. Add to GitHub Secrets:
   - `MAIL_USERNAME`: your-email@gmail.com
   - `MAIL_PASSWORD`: generated app password
   - `ALERT_EMAIL`: email to receive alerts

## Verification

After adding all secrets, verify the setup:

### Check Secrets Are Set

Go to: `Settings` → `Secrets and variables` → `Actions`

You should see all required secrets listed (values are hidden).

### Test CI Workflow

1. Make a small change to code
2. Push to a feature branch
3. Create PR to main
4. Check Actions tab for CI workflow
5. All tests should pass

### Test CD Workflow

1. Merge PR to main
2. Check Actions tab for Deploy workflow
3. Verify deployment at https://context8.io
4. Check health endpoint: https://context8.io/api/health

## Security Best Practices

### 1. SSH Key Security

- ✅ Use separate SSH key for GitHub Actions (not your personal key)
- ✅ Use Ed25519 algorithm (more secure than RSA)
- ✅ Never commit private keys to repository
- ✅ Rotate keys periodically (every 6-12 months)

### 2. Secret Management

- ✅ Use GitHub Environments for production secrets
- ✅ Enable "Required reviewers" for production deployments
- ✅ Audit secret access regularly
- ✅ Remove unused secrets promptly

### 3. Server Security

- ✅ Create dedicated `deployer` user (don't use root)
- ✅ Disable password authentication
- ✅ Use firewall (UFW) to limit open ports
- ✅ Enable fail2ban for SSH brute-force protection
- ✅ Keep system packages updated

## Troubleshooting

### "Permission denied (publickey)"

**Problem:** GitHub Actions cannot SSH to server

**Solution:**
1. Verify private key is correctly added to `SSH_PRIVATE_KEY` secret
2. Verify public key is in `/home/deployer/.ssh/authorized_keys`
3. Check file permissions: `chmod 600 ~/.ssh/authorized_keys`
4. Test manually: `ssh -i ~/.ssh/github-actions deployer@SERVER_IP`

### "Host key verification failed"

**Problem:** Server host key not in known_hosts

**Solution:** This is handled automatically in workflow with `ssh-keyscan`

### Deployment fails but tests pass

**Problem:** Server or network issue

**Solution:**
1. Check server is accessible: `ping SERVER_IP`
2. Check Docker is running: `ssh deployer@SERVER_IP "docker info"`
3. Check disk space: `ssh deployer@SERVER_IP "df -h"`
4. Check logs: `ssh deployer@SERVER_IP "cd /opt/context8-landing && docker-compose logs"`

### Environment variables not working

**Problem:** Secrets not properly passed to application

**Solution:**
1. Verify secrets are set in GitHub
2. Check `.env.production` on server: `ssh deployer@SERVER_IP "cat /opt/context8-landing/.env.production"`
3. Verify Docker container has variables: `docker exec context8-app env | grep NODE_ENV`

## Managing Secrets

### Update a Secret

1. Go to Settings → Secrets → Actions
2. Click on secret name
3. Click "Update secret"
4. Enter new value
5. Save

### Rotate SSH Keys

```bash
# Generate new key pair
ssh-keygen -t ed25519 -C "github-actions-new" -f ~/.ssh/github-actions-new

# Add new public key to server (don't remove old one yet)
ssh deployer@SERVER_IP
echo "NEW_PUBLIC_KEY" >> ~/.ssh/authorized_keys

# Update GitHub secret with new private key
# Go to Settings → Secrets → SSH_PRIVATE_KEY → Update

# Test deployment with new key
# If successful, remove old public key from server

# Delete old keys locally
rm ~/.ssh/github-actions ~/.ssh/github-actions.pub
```

### Revoke Access

To revoke GitHub Actions access to server:

```bash
# On server, remove public key
ssh deployer@SERVER_IP
nano ~/.ssh/authorized_keys
# Delete the line with "github-actions" comment
```

## Additional Resources

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [SSH Key Generation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Secure SSH Configuration](https://www.ssh.com/academy/ssh/config)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
