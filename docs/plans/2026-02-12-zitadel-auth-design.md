# Zitadel Authentication Design

**Date**: 2026-02-12
**Status**: Approved (3-expert brainstorm)
**Scope**: OIDC auth integration with self-hosted Zitadel in k3s cluster

---

## 1. Expert Panel

| Expert | Focus | Key Contribution |
|--------|-------|-------------------|
| Zitadel OIDC Auth Expert | Auth flows, library choice, token handling | PKCE flow, `aud` claim trap, refresh race condition |
| Frontend Auth Patterns Expert | React auth patterns, code architecture | useAuth hook design, TierGate paywall, migration path |
| Infra/Networking Expert | k3s deployment, CORS, JWKS, TLS | Internal JWKS fetch, NetworkPolicies, Docker Compose |

---

## 2. Architecture Decisions

### Auth Flow: PKCE Authorization Code

Non-negotiable. Implicit flow deprecated by OAuth 2.1 / RFC 9700.

- SPA redirects to Zitadel's hosted login page (no credentials in SPA)
- Token exchange via PKCE `code_verifier`/`code_challenge`
- Zitadel handles: login, registration, social OAuth, MFA, password reset

### Library: `react-oidc-context` + `oidc-client-ts`

| Factor | `@zitadel/react` | `react-oidc-context` |
|--------|-------------------|----------------------|
| Weekly downloads | ~500 | ~85,000 |
| Stars | 18 | 984 |
| Vendor lock-in | Yes | No (any OIDC provider) |
| Bundle size | wraps oidc-client-ts | wraps oidc-client-ts |

**Decision**: `react-oidc-context` (~3KB gzip) + `oidc-client-ts` (~15KB gzip). Total ~18KB.

### Auth State: OIDC Context, NOT Zustand

Auth is infrastructure state managed by a security-critical library. Do not mirror into Zustand (creates two sources of truth that drift). Zustand is for application state (prices, theme, filters).

### Token Storage

- **MVP**: `localStorage` via `WebStorageStateStore` (persistence across browser restarts, multi-tab sync built-in)
- **Post-MVP**: BFF pattern (httpOnly cookies via ctx8-api proxy)

### Token Refresh

- `automaticSilentRenew: true` + `offline_access` scope
- Zitadel blocks iframe silent refresh (X-Frame-Options: DENY)
- Refresh tokens rotated on each use by Zitadel
- Known race condition (Zitadel #9331): retry-once wrapper for 401s during refresh

---

## 3. Zitadel Configuration

### Subdomains

```
auth.context8.markets  →  Zitadel (OIDC provider)
api.context8.markets   →  ctx8-api (Go backend)
context8.markets       →  Vercel (React SPA)
```

### TLS

Cloudflare (edge) + cert-manager (origin), SSL mode Full (Strict).

### Scopes

```
openid profile email offline_access
urn:zitadel:iam:org:project:id:{PROJECT_ID}:aud    # CRITICAL: required for API validation
urn:zitadel:iam:org:project:roles                    # project-level roles
```

### Subscription Tier (Custom Claims)

Zitadel User Metadata + Action → custom JWT claim `ctx8/tier`:

```javascript
// Zitadel Action: Complement Token → Pre access token creation
function addSubscriptionTier(ctx, api) {
  var metadata = ctx.v1.user.metadata || [];
  for (var i = 0; i < metadata.length; i++) {
    if (metadata[i].key === 'subscription_tier') {
      api.v1.claims.setClaim('ctx8/tier', metadata[i].value);
      return;
    }
  }
  api.v1.claims.setClaim('ctx8/tier', 'free');
}
```

---

## 4. Backend Token Validation (ctx8-api)

### JWKS Local JWT Validation (recommended)

- Fetch JWKS from internal cluster DNS: `http://zitadel.default.svc.cluster.local:8080/oauth/v2/keys`
- Validate `iss`, `aud`, `exp`, `nbf` claims locally
- No network call per request (~0ms latency vs 1-5ms for introspection)
- Library: `lestrrat-go/jwx` with auto-refreshing `jwk.Cache`
- Cache retains keys during Zitadel downtime

### Two-URL Config Pattern

```go
type AuthConfig struct {
    Issuer       string // "https://auth.context8.markets" (matches JWT iss claim)
    JWKSEndpoint string // "http://zitadel.default.svc.cluster.local:8080/oauth/v2/keys"
    ClientID     string
}
```

---

## 5. CORS

### Zitadel

Built-in CORS. Configure in Console → Instance Settings → Security → Allowed Origins:
- `https://context8.markets`
- `http://localhost:5173`

### ctx8-api

```go
// Use github.com/rs/cors
c := cors.New(cors.Options{
    AllowedOrigins: []string{"https://context8.markets", "http://localhost:5173"},
    AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
    AllowedHeaders: []string{"Authorization", "Content-Type"},
    MaxAge:         86400,
})
```

---

## 6. React Integration

### Key Components

| Component | Purpose |
|-----------|---------|
| `src/lib/auth.ts` | OIDC config (authority, client_id, scopes, redirect URIs) |
| `src/hooks/useAuth.ts` | Wraps `react-oidc-context`, same interface as current Supabase hook |
| `src/components/auth/ProtectedRoute.tsx` | Component-based route guard (not React Router loaders) |
| `src/components/auth/AuthCallback.tsx` | `/auth/callback` route handler |
| `src/components/auth/TierGate.tsx` | Inline blurred paywall for subscription features |

### useAuth() Hook Interface

```typescript
interface UseAuthReturn {
  user: { id: string; email: string; name: string; roles: string[] } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  accessToken: string | null;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  login: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasTier: (minTier: SubscriptionTier) => boolean;
}
```

### TanStack Query 401 Handling

- Global `QueryCache.onError` catches 401s
- Retry once after token refresh, no retry on 403/404
- `enabled: !!accessToken` prevents queries before auth
- `queryClient.clear()` on logout

### Subscription Paywall

Inline blurred preview with upgrade CTA (TierGate). Better conversion than hard redirects.

---

## 7. Local Development

Docker Compose with Zitadel + Postgres:

```yaml
services:
  zitadel:
    image: ghcr.io/zitadel/zitadel:latest
    command: start-from-init --masterkeyFromEnv --tlsMode disabled
    environment:
      ZITADEL_EXTERNALSECURE: "false"
      ZITADEL_EXTERNALDOMAIN: "localhost"
      ZITADEL_EXTERNALPORT: 8080
    ports: ["8080:8080"]
  db:
    image: postgres:16-alpine
    volumes: [zitadel-db:/var/lib/postgresql/data]
```

Console: `http://localhost:8080/ui/console`

### Environment Variables

```bash
# .env.development
VITE_ZITADEL_AUTHORITY=http://localhost:8080
VITE_ZITADEL_CLIENT_ID=<local-client-id>
VITE_API_URL=http://localhost:8081

# Vercel dashboard (production)
VITE_ZITADEL_AUTHORITY=https://auth.context8.markets
VITE_ZITADEL_CLIENT_ID=<production-client-id>
VITE_API_URL=https://api.context8.markets
```

---

## 8. Migration from Supabase Auth

9-step sequence:

1. Install `react-oidc-context` + `oidc-client-ts`
2. Create `AuthProvider` wrapping OIDC config
3. Rewrite `useAuth()` hook (same return interface)
4. Replace `AdminRoute` with generic `ProtectedRoute`
5. Add `/auth/callback` route
6. Simplify `Auth.tsx` to redirect button (Zitadel handles login UI)
7. Replace all `supabase.auth.*` calls
8. Wire `apiFetch` to ctx8-api (Bearer token)
9. Remove `@supabase/supabase-js` (-30KB)

---

## 9. Network Security

### NetworkPolicies (k3s)

- Zitadel: ingress from Traefik + ctx8-api only, egress to Postgres + DNS
- ctx8-api: ingress from Traefik only, egress to Zitadel + Postgres + external APIs (443)

### Rate Limiting

- Zitadel built-in: account lockout, CAPTCHA, token endpoint limiting
- Traefik middleware: 20 req/s sustained, 50 burst
- Cloudflare WAF rules for `auth.` subdomain

### Backup

Daily pg_dump CronJob for Zitadel database. Master key stored separately.

---

## 10. Critical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Missing `aud` scope → all 401s | BLOCKER | Document scope, test in local Zitadel first |
| Refresh token race condition (#9331) | 3/5 | Retry-once wrapper in fetch |
| System clock skew (#9419) | 2/5 | Cannot fix client-side, document edge case |
| Cookie blocking (Brave, privacy ext) | 2/5 | Zitadel needs cookies for login flow |
| react-oidc-context + React 19 | 2/5 | Test early, fallback to raw oidc-client-ts |
| Zitadel pod cold start | 1/5 | Always-on replica + readiness probes |
| Losing terminal-style login UX | 1/5 | Accept Zitadel hosted login, customize branding |
