# Context8 Landing Page

OAuth-gated landing page for Context8 MCP server.

## Overview

This is the **frontend-only** implementation. The actual MCP server will be developed separately.

## Features

- ✅ Dark theme by default (next-themes)
- ✅ OAuth authentication (Auth.js v5 with Google & GitHub)
- ✅ Responsive design (TailwindCSS)
- ✅ Protected dashboard
- ✅ Landing page with features/FAQ
- ⚠️ MCP endpoint is a **placeholder** (returns 501 status)

## Quick Start

```bash
# Install dependencies
npm install

# Start PostgreSQL
docker-compose up -d

# Copy environment file
cp .env.local.example .env.local

# Run migrations
DATABASE_URL="postgresql://context8:dev_password_123@localhost:5433/context8_dev" npx tsx lib/db/migrate.ts

# Start dev server
npm run dev
```

Visit http://localhost:3000

## Theme

**Default theme:** Dark mode
**System theme:** Disabled
**Theme toggle:** Available in header (Sun/Moon icon)

The dark theme is applied automatically on load using `next-themes` with `defaultTheme="dark"`. Users can toggle between light and dark themes using the theme switcher in the navigation header.

## MCP Server

The MCP endpoint at `/api/mcp/context` is currently a **placeholder**.

**Response:**
```json
{
  "status": "placeholder",
  "message": "MCP server endpoint - under development",
  "info": {
    "description": "This endpoint will be replaced by a separate MCP server",
    "features": [
      "Real-time crypto market data",
      "OAuth-gated access",
      "Rate limiting (30/hour per IP, 15/hour per user)",
      "Four data sources: prices, news, on-chain, social"
    ]
  }
}
```

**Status code:** 501 Not Implemented

### Planned MCP Server Features

The separate MCP server will implement:

1. **Authentication:** OAuth session validation
2. **Rate Limiting:**
   - 30 requests/hour per IP
   - 15 requests/hour per authenticated user
3. **Data Sources:**
   - Binance spot prices (1min updates)
   - Crypto news aggregation (15min updates)
   - On-chain metrics (1hr updates)
   - Social sentiment (30min updates)
4. **Usage Tracking:** Metrics logged to PostgreSQL

## OAuth Setup

### Google OAuth

1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy credentials to `.env.local`:
   ```
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-secret"
   ```

### GitHub OAuth

1. Go to https://github.com/settings/developers
2. Create OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy credentials to `.env.local`:
   ```
   GITHUB_CLIENT_ID="your-client-id"
   GITHUB_CLIENT_SECRET="your-secret"
   ```

## Project Structure

```
app/
├── (marketing)/          # Public landing pages
│   ├── page.tsx         # Homepage
│   ├── privacy/         # Privacy policy
│   ├── terms/           # Terms of service
│   └── status/          # Status page
├── (auth)/              # Auth pages
│   ├── login/           # Login page
│   └── auth/error/      # Error page
├── (dashboard)/         # Protected dashboard
│   └── dashboard/
│       ├── page.tsx     # Main dashboard
│       └── upgrade/     # Upgrade page
└── api/
    ├── auth/[...nextauth]/  # NextAuth routes
    └── mcp/context/         # MCP placeholder endpoint

components/
├── ui/                  # shadcn/ui components
├── providers/           # Context providers (theme, session)
└── [sections]/          # Page sections

lib/
├── auth.ts             # Auth.js v5 config
├── db/                 # Database (Drizzle ORM)
├── config/             # Site config, data sources
└── rate-limit.ts       # Rate limiter (unused in placeholder)
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** TailwindCSS + shadcn/ui
- **Theme:** next-themes (dark mode default)
- **Auth:** Auth.js v5 (NextAuth)
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Testing:** Vitest + Playwright

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint
```

## CI/CD Pipeline

This project includes a complete CI/CD pipeline for automated testing and deployment.

### Workflows

- **CI (Continuous Integration)** - Runs on all PRs and pushes
  - ESLint + TypeScript checks
  - Unit tests with coverage
  - E2E tests with Playwright
  - Docker build verification
  - Security scanning (npm audit + Snyk)

- **CD (Continuous Deployment)** - Runs on push to `main`
  - Automated deployment to self-hosted server
  - Blue-green deployment with health checks
  - Automatic rollback on failure
  - Slack/email notifications

### Deployment

**Self-hosted deployment with Docker + Caddy:**

```bash
# 1. Setup server (run once)
sudo bash scripts/server-setup.sh

# 2. Configure GitHub Secrets (see docs/GITHUB_SECRETS.md)
# Required: SSH_PRIVATE_KEY, SERVER_HOST, DOMAIN, NEXT_PUBLIC_API_URL

# 3. Push to main branch
git push origin main

# Deployment happens automatically via GitHub Actions
```

**Manual deployment:**

```bash
# On server
cd /opt/context8-landing
./scripts/deploy.sh

# Rollback if needed
./scripts/rollback.sh
```

### Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [docs/GITHUB_SECRETS.md](./docs/GITHUB_SECRETS.md) - GitHub Secrets setup
- [.github/workflows/ci.yml](./.github/workflows/ci.yml) - CI workflow
- [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) - CD workflow

## Deployment Notes

- MCP endpoint returns 501 until actual server is implemented
- OAuth credentials required for login to work
- Database migrations must be run before first use
- Environment variables must be set in production
- **Self-hosted**: Uses Docker + Caddy with automatic HTTPS
- **Cost**: ~€5-10/month (vs Vercel $20/month)

## Next Steps

1. **Setup Server** - Run `scripts/server-setup.sh` on VPS
2. **Configure Secrets** - Add GitHub secrets (see docs/GITHUB_SECRETS.md)
3. **Deploy** - Push to main branch for automated deployment
4. **Implement MCP Server** (separate repository/service)
5. **Connect MCP server** to frontend via API gateway

---

**Status:** Frontend complete, MCP server pending implementation
**Theme:** Dark mode by default ✅
**Auth:** OAuth ready (credentials required)
