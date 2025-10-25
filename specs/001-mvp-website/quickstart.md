# Quickstart Guide: MVP Website

**Feature**: MVP Website (Landing, Dashboard, Auth)
**Date**: 2025-10-22
**Purpose**: Local development setup instructions for Context8 MVP website

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v18.x or v20.x (LTS recommended)
- **npm** or **pnpm**: Latest version (pnpm recommended for faster installs)
- **Git**: For version control
- **PostgreSQL**: v14+ (or use Docker for local database)
- **Code Editor**: VS Code recommended (with extensions: ESLint, Prettier, Tailwind CSS IntelliSense)

Optional:
- **Docker**: For running PostgreSQL locally without installation
- **Vercel CLI**: For testing deployment locally

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/context8-landing.git
cd context8-landing
```

### 2. Checkout Feature Branch

```bash
git checkout 001-mvp-website
```

### 3. Install Dependencies

```bash
# Using npm
npm install

# OR using pnpm (recommended)
pnpm install
```

Expected output:
```
 WARN  deprecated ... (ignore deprecation warnings)
Progress: resolved 1200, reused 1150, downloaded 50
+ next 14.2.0
+ react 18.3.0
+ @auth/drizzle-adapter 1.0.0
... (other packages)

Done in 45s
```

---

## Database Setup

### Option A: PostgreSQL with Docker (Recommended)

1. **Create Docker Compose file**:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: context8-db
    environment:
      POSTGRES_USER: context8
      POSTGRES_PASSWORD: dev_password_123
      POSTGRES_DB: context8_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. **Start PostgreSQL**:

```bash
docker-compose up -d
```

3. **Verify database is running**:

```bash
docker ps
# Should show: context8-db container running
```

### Option B: Local PostgreSQL Installation

1. **Install PostgreSQL** (if not already installed):

```bash
# macOS
brew install postgresql@16

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql-16

# Start service
brew services start postgresql@16  # macOS
sudo systemctl start postgresql    # Linux
```

2. **Create database**:

```bash
psql postgres
CREATE DATABASE context8_dev;
CREATE USER context8 WITH PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE context8_dev TO context8;
\q
```

### Option C: SQLite (Quick Start, Development Only)

SQLite requires no setup but is not recommended for production-like testing.

---

## Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.local.example .env.local
```

### 2. Edit `.env.local`

```bash
# .env.local
# Database
DATABASE_URL="postgresql://context8:dev_password_123@localhost:5432/context8_dev"
# OR for SQLite:
# DATABASE_URL="file:./dev.db"

# Auth.js (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Node Environment
NODE_ENV="development"
```

### 3. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET in .env.local
```

---

## OAuth Provider Setup

### Google OAuth

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create New Project**: "Context8 Development"
3. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. **Create OAuth 2.0 Credentials**:
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Context8 Local Dev"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
   - Click "Create"
5. **Copy Credentials**:
   - Copy "Client ID" to `GOOGLE_CLIENT_ID` in `.env.local`
   - Copy "Client secret" to `GOOGLE_CLIENT_SECRET` in `.env.local`

### GitHub OAuth

1. **Go to GitHub Developer Settings**: https://github.com/settings/developers
2. **Click "New OAuth App"**:
   - Application name: "Context8 Local Dev"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Click "Register application"
3. **Copy Credentials**:
   - Copy "Client ID" to `GITHUB_CLIENT_ID` in `.env.local`
   - Click "Generate a new client secret"
   - Copy secret to `GITHUB_CLIENT_SECRET` in `.env.local`

---

## Database Migration

### 1. Generate Drizzle Schema

```bash
npx drizzle-kit generate:pg
```

Expected output:
```
Generating migrations...
✓ Generated migration: 0001_create_users_sessions_usage.sql
```

### 2. Apply Migrations

```bash
npx drizzle-kit push:pg
```

Expected output:
```
Applying migrations to database...
✓ Migration 0001_create_users_sessions_usage.sql applied successfully
Tables created:
  - users
  - sessions
  - usage_metrics
```

### 3. Verify Tables

```bash
# Connect to database
psql postgresql://context8:dev_password_123@localhost:5432/context8_dev

# List tables
\dt

# Expected output:
#  Schema |      Name       | Type  |  Owner
# --------+-----------------+-------+----------
#  public | users           | table | context8
#  public | sessions        | table | context8
#  public | usage_metrics   | table | context8
#  public | drizzle_migrations | table | context8

# Exit
\q
```

---

## Running Development Server

### 1. Start Dev Server

```bash
npm run dev
# OR
pnpm dev
```

Expected output:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
○ Compiling / ...
✓ Compiled / in 458ms
```

### 2. Open Browser

Navigate to: http://localhost:3000

You should see the **landing page** with:
- Hero section: "AI‑ready crypto context. One URL away."
- Two CTAs: "Start free (OAuth)" and "View docs"
- Value propositions, How it works, Plans, FAQ sections

---

## Testing Authentication Flow

### 1. Test Google OAuth

1. Click **"Start free (OAuth)"** on landing page
2. You'll be redirected to `/auth/signin`
3. Click **"Continue with Google"**
4. You'll be redirected to Google's consent screen
5. Sign in with your Google account (use personal account for testing)
6. Grant permissions (email, profile)
7. You'll be redirected back to `/dashboard`
8. Verify dashboard shows:
   - "Context8 Dashboard" header
   - Plan panel: "Current plan: Free"
   - Usage panel: "0 / 100" (if first signin)
   - Sources panel: List of 4 data sources

### 2. Test GitHub OAuth

1. Sign out (if signed in)
2. Click **"Start free (OAuth)"** again
3. Click **"Continue with GitHub"**
4. Follow GitHub authorization flow
5. Verify same dashboard behavior as Google

### 3. Test Protected Routes

1. **Without signin**:
   - Navigate to `http://localhost:3000/dashboard` directly
   - Expected: Redirect to `/auth/signin`

2. **With signin**:
   - Sign in via OAuth
   - Navigate to `http://localhost:3000/dashboard`
   - Expected: Dashboard loads successfully

---

## Testing Landing Page

### 1. Visual Inspection

- [ ] Dark theme applied by default
- [ ] Mobile-responsive (test at 320px, 768px, 1024px, 1920px widths)
- [ ] All sections render: Hero, Value Props, How it Works, Plans, FAQ, Footer
- [ ] CTAs are clickable and navigate correctly
- [ ] Images load (if any)
- [ ] Fonts render correctly (no FOUT - Flash of Unstyled Text)

### 2. Performance Check

Open Chrome DevTools > Lighthouse:
- Click "Generate report"
- Select "Desktop" or "Mobile"
- Expected scores:
  - Performance: 90+ (green)
  - Accessibility: 90+ (green)
  - Best Practices: 90+ (green)
  - SEO: 90+ (green)

---

## Running Tests

### Unit Tests (Vitest)

```bash
npm run test
# OR
pnpm test
```

Expected output:
```
 RUN  v1.0.0

 ✓ components/landing/hero.test.tsx (2)
 ✓ lib/utils.test.ts (5)

Test Files  2 passed (2)
     Tests  7 passed (7)
  Start at  10:00:00
  Duration  1.23s
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e
# OR
pnpm test:e2e
```

Expected output:
```
Running 10 tests using 3 workers

  ✓ [chromium] › landing.spec.ts:3:1 › Landing page loads correctly (2s)
  ✓ [chromium] › auth.spec.ts:5:1 › User can sign in with Google (5s)
  ✓ [chromium] › dashboard.spec.ts:4:1 › Dashboard shows user plan (3s)
  ...

  10 passed (24s)
```

---

## Troubleshooting

### Issue: Database Connection Failed

**Error**:
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
1. Verify PostgreSQL is running:
   ```bash
   docker ps  # If using Docker
   # OR
   brew services list  # If local install
   ```
2. Check `DATABASE_URL` in `.env.local` matches your database credentials
3. Restart database service

---

### Issue: OAuth Callback Error

**Error**:
```
[next-auth][error][OAUTH_CALLBACK_ERROR]
redirect_uri_mismatch
```

**Solution**:
1. Verify redirect URI in OAuth provider settings matches exactly:
   - Google: `http://localhost:3000/api/auth/callback/google`
   - GitHub: `http://localhost:3000/api/auth/callback/github`
2. Ensure `NEXTAUTH_URL` in `.env.local` is `http://localhost:3000` (no trailing slash)
3. Restart dev server after changing `.env.local`

---

### Issue: Session Not Persisting

**Error**: User signs in successfully but is immediately signed out

**Solution**:
1. Verify `NEXTAUTH_SECRET` is set in `.env.local`
2. Check browser allows cookies (disable strict cookie blocking)
3. Verify sessions table exists in database:
   ```bash
   psql postgresql://context8:dev_password_123@localhost:5432/context8_dev -c "\dt"
   ```
4. Check browser DevTools > Application > Cookies for `next-auth.session-token`

---

### Issue: Styles Not Loading

**Error**: Page loads but no dark theme, components unstyled

**Solution**:
1. Verify TailwindCSS config is correct:
   ```bash
   cat tailwind.config.ts
   # Should have: darkMode: ["class"]
   ```
2. Rebuild:
   ```bash
   rm -rf .next
   pnpm dev
   ```
3. Check `globals.css` imports in `app/layout.tsx`

---

## Development Workflow

### 1. Making Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes to files
# ...

# Test changes
pnpm dev
# Open http://localhost:3000 and verify

# Run tests
pnpm test
pnpm test:e2e
```

### 2. Code Quality Checks

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck
```

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

---

## Next Steps

After completing local setup:

1. **Read the specification**: `specs/001-mvp-website/spec.md`
2. **Review the data model**: `specs/001-mvp-website/data-model.md`
3. **Study OAuth flow**: `specs/001-mvp-website/contracts/auth-flow.md`
4. **Start implementing**: Follow `specs/001-mvp-website/tasks.md` (to be generated)

---

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Lint code
pnpm format           # Format code with Prettier
pnpm typecheck        # TypeScript type checking

# Database
npx drizzle-kit generate:pg   # Generate migrations
npx drizzle-kit push:pg        # Apply migrations
npx drizzle-kit studio         # Open Drizzle Studio (database GUI)

# Testing
pnpm test                      # Run unit tests
pnpm test:watch                # Run tests in watch mode
pnpm test:e2e                  # Run E2E tests
pnpm test:e2e:ui               # Run E2E tests with UI

# Docker
docker-compose up -d           # Start PostgreSQL
docker-compose down            # Stop PostgreSQL
docker-compose logs -f         # View logs
```

---

## Getting Help

- **Documentation**: `/specs/001-mvp-website/`
- **Constitution**: `.specify/memory/constitution.md`
- **Issues**: File a GitHub issue
- **Questions**: Check FAQ in `spec.md`

---

## Summary

✅ **Setup Complete** when you can:
1. Run `pnpm dev` without errors
2. Access http://localhost:3000 and see landing page
3. Sign in with Google or GitHub OAuth
4. View dashboard at http://localhost:3000/dashboard
5. Run `pnpm test` and `pnpm test:e2e` successfully

**Estimated Setup Time**: 20-30 minutes (first time)

**Next Command**: `/speckit.tasks` (to generate implementation tasks)
