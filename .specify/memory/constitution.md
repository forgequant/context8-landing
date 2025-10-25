<!--
SYNC IMPACT REPORT
==================
Version: N/A → 1.0.0 (MINOR - Initial constitution ratification)
Date: 2025-10-22

Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (7 principles)
  - Scope & Boundaries
  - Technology Stack
  - Security Requirements
  - Performance & Reliability Standards
  - Report Format Standards
  - Governance

Removed Sections: N/A

Template Updates:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - Requirements align with scope and security constraints
  ✅ tasks-template.md - Task structure supports modular adapter approach

Follow-up TODOs: None
-->

# Context8 Constitution

## Core Principles

### I. AI-First Architecture

**Context is assembled server-side; LLM does not fetch sources directly.**

All data aggregation, filtering, and formatting happens within the MCP server. The AI assistant receives a pre-structured, ready-to-consume report. This ensures:
- Consistent formatting regardless of LLM capabilities
- Reduced token consumption for the LLM
- Centralized caching and optimization
- Protection of API keys and sensitive credentials

**Rationale**: Direct source access by LLMs creates inconsistent results, exposes credentials, and wastes tokens on formatting tasks.

### II. Minimal Surface Area

**No public endpoints without OAuth; even Free tier requires login.**

Every API endpoint, including the MCP context endpoint, requires OAuth authentication. There are no unauthenticated public endpoints.

- All access is gated by OAuth (Google/GitHub)
- Rate limits enforced per user plan (Free/Pro)
- No anonymous usage, no public demo without login
- TLS enforced for all connections

**Rationale**: Authentication-first design prevents abuse, enables usage tracking, and provides a foundation for tiered service plans.

### III. Deterministic Format

**Stable Markdown sections and labels for reliable LLM parsing.**

Report output follows a strict, versioned template:
- Fixed section headers (Summary, Market Data, News)
- Consistent field labels and data types
- Predictable structure for programmatic parsing
- UTC ISO8601 timestamps at report header

Changes to the report format are versioned and documented. Breaking changes require a MAJOR version bump.

**Rationale**: LLMs perform best with consistent, predictable input formats. Schema stability enables reliable downstream automation.

### IV. Modular Adapters

**Each source is an independent plug-in with a uniform interface.**

Data sources (price feeds, news APIs, on-chain metrics) are implemented as isolated adapters with:
- Standardized interface: `fetch()`, `format()`, `validate()`
- Independent error handling and retries
- Isolated timeout/rate-limit logic
- Self-contained configuration and credentials

Adapters are hot-swappable; failures in one adapter do not cascade.

**Rationale**: Modular design enables independent development, testing, and deployment of data sources. Failed adapters degrade gracefully rather than breaking the entire report.

### V. Dark-Theme UX

**Dark theme and minimal copy; avoid cognitive load.**

All user interfaces (landing page, dashboard) use:
- Dark color scheme by default (light mode optional)
- Minimal text and visual clutter
- Clear typography and generous whitespace
- Mobile-responsive design

Copy is concise and action-oriented. Avoid marketing fluff.

**Rationale**: Crypto traders and developers prefer dark interfaces. Minimal design reduces decision fatigue and improves focus.

### VI. Privacy-First Telemetry

**No sensitive data in logs; opt-out analytics by default.**

Logging and analytics policies:
- PII (emails, OAuth tokens, user IDs) redacted from application logs
- No full request/response payloads in production logs
- Analytics opt-out by default (user must consent)
- Structured logging with severity levels
- Log retention: 30 days maximum

**Rationale**: Privacy regulations (GDPR) and user trust require minimal data collection and explicit consent.

### VII. Operational Simplicity

**Minimal dependencies; predictable builds; reproducible deploys.**

Infrastructure and development practices prioritize simplicity:
- Minimal external dependencies (prefer standard library)
- Predictable builds (locked dependency versions)
- Reproducible deployments (containerized services)
- Clear runbooks for common operations
- Automated health checks and graceful degradation

Complexity must be explicitly justified; simpler alternatives are preferred.

**Rationale**: Operational complexity is a tax on velocity and reliability. Simple systems are easier to debug, scale, and maintain.

## Scope & Boundaries

### In Scope (MVP)

- MCP server for crypto tickers: BTC, ETH, SOL, and other major assets
- OAuth-gated access with tiered rate limits (Free/Pro plans)
- Price data and basic news aggregation
- Landing page (dark theme) and minimal dashboard showing current plan and active sources
- Report generation in Markdown/plaintext using a fixed template
- Server-side caching (≈60s TTL) with parallel adapter fetching
- Timeouts and retries for external data sources

### Future Scope (Post-MVP)

- On-chain metrics: active addresses, transaction volume, gas fees
- Social signals: Twitter mentions, Reddit sentiment, Discord activity
- Sentiment analysis: news tone, community mood
- Coverage expansion: stocks, ETFs, forex pairs
- User features: alerts, trading journal, richer dashboard visualizations
- Advanced filters: user-selected sources, custom tickers

### Out of Scope

- Manual source selection or complex UI configuration (MVP)
- Public unauthenticated API
- Auto-trading or brokerage integrations (MVP)
- Real-time streaming data (MVP uses polling with cache)
- White-label or multi-tenant deployments (single instance only)

## Technology Stack

- **Frontend**: Next.js (App Router) + React + TypeScript + TailwindCSS + shadcn/ui + next-themes
- **Authentication**: Auth.js (NextAuth) with Google and GitHub OAuth providers
- **Backend**: Node.js MCP service(s) on VPS; modular adapter architecture; optional task queue for async jobs
- **Hosting**: Vercel (frontend static site) + VPS (MCP backend and adapters)
- **CI/CD**: GitHub Actions for linting, type-checking, building, and deployment automation
- **Content**: Static site copy stored in repository; optional blog from Markdown files (future)

### Technology Constraints

- Use only approved OAuth providers (Google, GitHub)
- TypeScript required for all JavaScript/TypeScript code
- TailwindCSS for styling; avoid custom CSS where possible
- shadcn/ui components for UI consistency
- Environment variables for secrets; never commit credentials

## Security Requirements

### Authentication & Authorization

- **OAuth 2.0 Required**: All access requires OAuth login (Google or GitHub)
- **Providers**: Google and GitHub only (extensible in future)
- **TLS Enforced**: All connections use HTTPS; HTTP redirects to HTTPS
- **Secrets Management**: Credentials stored in environment variables; never committed to version control
- **Session Management**: Secure session cookies with appropriate flags (HttpOnly, Secure, SameSite)

### Rate Limiting

- **Per-User Limits**: Enforced based on user plan (Free/Pro)
  - Free: 100 requests/day
  - Pro: 1000 requests/day (example; adjust as needed)
- **Per-IP Limits**: Abuse protection; blocks suspicious traffic patterns
- **Graceful Degradation**: Rate limit exceeded returns 429 with clear error message

### Logging & Privacy

- **Structured Logs**: JSON format with severity levels (DEBUG, INFO, WARN, ERROR)
- **PII Redaction**: Email addresses, OAuth tokens, user IDs redacted from logs
- **No Payload Dumps**: Full request/response bodies not logged in production
- **Retention**: 30 days maximum; automatic purge after retention period
- **Access Control**: Logs accessible only to authorized operators

## Performance & Reliability Standards

### Response Times

- **Report Generation**:
  - P50 (median): < 3 seconds with warm cache
  - P90 (90th percentile): < 6 seconds with cold cache
  - P99 (99th percentile): < 10 seconds

### Caching

- **TTL**: 60 seconds for all data sources
- **Strategy**: Server-side cache shared across users
- **Cache Key**: Ticker symbol + data source + timestamp window
- **Invalidation**: TTL-based; no manual invalidation (MVP)

### Adapter Timeouts & Retries

- **Timeout**: 4000ms per adapter (4 seconds)
- **Retries**: 2 retries with exponential backoff (100ms, 200ms)
- **Circuit Breaker**: After 5 consecutive failures, adapter marked unhealthy for 60s
- **Parallel Fetch**: All adapters fetch concurrently; timeout applies per adapter

### Task Queue

- **Enabled**: Yes (for async jobs like report pre-generation)
- **Implementation**: Optional (Redis-backed queue or lightweight in-memory queue)
- **Failure Handling**: Dead-letter queue for failed jobs; manual review required

### Graceful Degradation

**Missing adapter ≠ failed report.** If an adapter fails or times out:
- Mark the corresponding section as "Unavailable" in the report
- Include timestamp and reason in the report (e.g., "Timeout after 4000ms")
- Log the failure with adapter name and error details
- Continue generating the rest of the report

Reports are always delivered, even if some data is missing.

## Report Format Standards

### Default Format

- **Primary**: Markdown (GitHub-flavored)
- **Alternate**: Plaintext (for LLMs that prefer unformatted text)

### Section Order

Fixed order for all reports:
1. **Summary**: High-level overview, key takeaways, timestamp
2. **Market Data**: Prices, 24h change, market cap, volume
3. **News**: Recent headlines, sources, publication timestamps

### Writing Style

- **Concise**: Short sentences, bullet points where appropriate
- **Factual**: No speculation, no investment advice
- **Neutral Tone**: No hype, no fear-mongering
- **Timestamped**: UTC ISO8601 timestamp at the top of every report

### Timestamp Format

All timestamps use UTC ISO8601:
```
Generated: 2025-10-22T14:35:00Z
```

### Example Report Structure

```markdown
# Crypto Market Context Report

**Generated**: 2025-10-22T14:35:00Z
**Tickers**: BTC, ETH, SOL

## Summary

- Bitcoin up 3.2% in 24h, trading at $67,345
- Ethereum holding steady at $3,210
- Solana shows strength with 5.1% gain

## Market Data

| Ticker | Price (USD) | 24h Change | Market Cap | 24h Volume |
|--------|-------------|------------|------------|------------|
| BTC    | $67,345     | +3.2%      | $1.32T     | $28.4B     |
| ETH    | $3,210      | +0.8%      | $385B      | $12.1B     |
| SOL    | $142.50     | +5.1%      | $63B       | $2.8B      |

## News

- **Bitcoin ETF sees $120M inflow** (CoinDesk, 2025-10-22 12:00 UTC)
- **Ethereum upgrade delayed to Q1 2026** (The Block, 2025-10-22 10:30 UTC)
- **Solana network uptime reaches 99.9%** (Messari, 2025-10-22 09:15 UTC)
```

## Governance

### Amendment Procedure

1. **Proposal**: Amendments must be documented in a GitHub issue or pull request
2. **Review**: At least one maintainer must review and approve
3. **Migration Plan**: Breaking changes require a migration guide for existing features
4. **Version Bump**: Follow semantic versioning (MAJOR.MINOR.PATCH)
   - MAJOR: Breaking changes to principles, scope, or governance
   - MINOR: New principles, sections, or capabilities added
   - PATCH: Clarifications, typo fixes, non-semantic refinements
5. **Ratification**: Update version and last amended date in this document

### Compliance Review

- **PR Reviews**: All pull requests must verify compliance with constitution principles
- **Complexity Justification**: Violations of "Operational Simplicity" require explicit justification
- **Security Audit**: Security-related changes require review by designated security maintainer

### Constitution Supersedes All

This constitution supersedes all other practices, guidelines, and documentation. In case of conflict, constitution takes precedence.

### Runtime Development Guidance

For day-to-day development practices, refer to:
- `CLAUDE.md` (project-specific instructions)
- `.specify/templates/` (workflow templates)
- `README.md` (setup and contribution guide, when created)

**Version**: 1.0.0 | **Ratified**: 2025-10-22 | **Last Amended**: 2025-10-22
