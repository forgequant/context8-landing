# GitHub Actions Workflows

Automated CI/CD pipelines for Context8 landing page.

## Workflows

### 1. `test.yml` - Continuous Integration
**Triggers**: Push to any branch, PR to develop/main

**Jobs**:
- TypeScript compilation check
- ESLint linting
- Unit tests (Vitest)
- E2E tests (Playwright)
- Build verification

**Duration**: ~3-5 minutes

### 2. `claude-code-review.yml` - AI Code Review
**Triggers**: PR opened/updated to develop/main

**Features**:
- Automated code review with Claude Sonnet 4
- Focus areas: security, performance, accessibility, type safety
- Inline comments on code issues
- Complexity analysis
- Bundle size checking

**Requirements**:
- `ANTHROPIC_API_KEY` secret

### 3. `deploy-staging.yml` - Staging Deployment
**Triggers**: Push to `develop` branch

**Jobs**:
- Run tests
- Build project
- Deploy to Vercel staging
- Smoke tests
- Post deployment notifications

**Environment**: staging
**URL**: https://context8-staging.vercel.app

### 4. `deploy-production.yml` - Production Deployment
**Triggers**: Push to `main` branch, manual dispatch

**Jobs**:
- Pre-deployment checks (tests, security audit)
- Deploy to production
- Health checks
- Lighthouse performance audit
- Automatic rollback on failure

**Environment**: production
**URL**: https://context8.io

## Setup Instructions

### 1. GitHub Secrets

Add these secrets in repository settings:

```bash
# Anthropic API (for Claude Code reviews)
ANTHROPIC_API_KEY=sk-ant-xxx

# Vercel deployment
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx

# Optional: Slack/Discord notifications
SLACK_WEBHOOK=https://hooks.slack.com/xxx
```

### 2. Vercel Project Setup

1. Create Vercel project: https://vercel.com/new
2. Link to GitHub repository
3. Get project ID and org ID:
   ```bash
   npx vercel link
   cat .vercel/project.json
   ```
4. Add IDs to GitHub secrets

### 3. Environments

Create GitHub environments:
- `staging`: Auto-deploy, no approvals
- `production`: Require manual approval
- `production-rollback`: Require approval

Settings → Environments → New environment

### 4. Branch Protection

Configure branch protection rules:

**`main` branch**:
- Require pull request reviews
- Require status checks:
  - Test & Lint
  - Build Check
  - Claude Code Review
- Require branches to be up to date

**`develop` branch**:
- Require status checks:
  - Test & Lint
  - Build Check

### 5. Enable Playwright Tests

Install Playwright browsers in CI:
```bash
npx playwright install --with-deps
```

Already configured in workflows.

## Workflow Diagram

```
Developer Push
      ↓
  [test.yml]
      ↓
  Tests Pass
      ↓
    PR Created
      ↓
 [claude-code-review.yml]
      ↓
  Review Complete
      ↓
  Merge to develop
      ↓
[deploy-staging.yml]
      ↓
Staging Deployed ✅
      ↓
  Merge to main
      ↓
[deploy-production.yml]
      ↓
Production Deployed 🚀
```

## Local Testing

Test workflows locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Run test workflow
act push -W .github/workflows/test.yml

# Run with secrets
act push -W .github/workflows/test.yml --secret-file .secrets
```

## Troubleshooting

### Tests fail in CI but pass locally
- Check Node.js version (should be 20)
- Verify environment variables
- Clear npm cache: `npm ci --cache .npm`

### Claude Code review not working
- Verify `ANTHROPIC_API_KEY` is set
- Check API quota: https://console.anthropic.com
- Review permissions: `pull-requests: write`

### Deployment fails
- Check Vercel dashboard for errors
- Verify secrets are correct
- Review build logs in GitHub Actions

### Lighthouse fails
- Ensure site is publicly accessible
- Check performance budget settings
- Review Lighthouse report artifacts

## Monitoring

**GitHub Actions**:
- Dashboard: https://github.com/{org}/{repo}/actions
- Insights: https://github.com/{org}/{repo}/pulse

**Vercel**:
- Dashboard: https://vercel.com/{org}/{repo}
- Analytics: https://vercel.com/{org}/{repo}/analytics

**Lighthouse CI**:
- Reports: Uploaded as workflow artifacts
- Temporary storage: 7 days

## Cost Optimization

**GitHub Actions**:
- Free tier: 2,000 minutes/month
- Optimize by caching dependencies
- Cancel redundant runs

**Vercel**:
- Free tier: 100 GB bandwidth
- Pro tier: $20/month unlimited

**Anthropic API**:
- Pay per token
- Optimize review frequency
- Cache results when possible

## Best Practices

1. **Commit frequently**: Smaller commits = faster reviews
2. **Write tests**: Required for CI to pass
3. **Follow conventions**: ESLint rules enforced
4. **Review before merge**: Don't bypass checks
5. **Monitor deployments**: Check Vercel logs

## Support

- GitHub Actions docs: https://docs.github.com/en/actions
- Vercel docs: https://vercel.com/docs
- Claude Code: https://claude.com/claude-code

---

**Last Updated**: 2025-10-24
**Maintained by**: Claude Code + Vital D.
