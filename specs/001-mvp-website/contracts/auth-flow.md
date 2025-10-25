# OAuth Authentication Flow

**Feature**: MVP Website (Landing, Dashboard, Auth)
**Date**: 2025-10-22
**Purpose**: Document OAuth 2.0 authentication flow with Google and GitHub providers

## Overview

Context8 uses **OAuth 2.0 Authorization Code Flow** with PKCE (Proof Key for Code Exchange) for secure user authentication. All authentication is handled by Auth.js (NextAuth) v5 with database sessions.

**Supported Providers**:
- Google OAuth 2.0
- GitHub OAuth 2.0

**Session Management**:
- Database-backed sessions (users + sessions tables)
- 60-minute session duration
- HttpOnly, Secure, SameSite=Lax cookies
- Silent refresh where provider supports

---

## Authentication Flow Diagram

```
┌──────────┐                                          ┌──────────────┐
│  User    │                                          │   Context8   │
│ (Browser)│                                          │   (Next.js)  │
└────┬─────┘                                          └──────┬───────┘
     │                                                       │
     │ 1. Click "Start free (OAuth)"                        │
     ├──────────────────────────────────────────────────────►
     │                                                       │
     │ 2. Redirect to /auth/signin                          │
     ◄───────────────────────────────────────────────────────┤
     │                                                       │
     │ 3. Click "Continue with Google"                      │
     ├──────────────────────────────────────────────────────►
     │                                                       │
     │ 4. Generate PKCE code_verifier + code_challenge      │
     │    Generate CSRF state parameter                     │
     │                                                       │
     │ 5. Redirect to Google OAuth consent                  │
     ◄───────────────────────────────────────────────────────┤
     │   https://accounts.google.com/o/oauth2/v2/auth       │
     │   ?client_id=...                                     │
     │   &redirect_uri=.../api/auth/callback/google         │
     │   &state=CSRF_TOKEN                                  │
     │   &code_challenge=PKCE_CHALLENGE                     │
     │                                                       │
     ▼                                                       │
┌──────────────┐                                            │
│   Google     │                                            │
│   OAuth      │                                            │
└──────┬───────┘                                            │
     │ 6. User authorizes Context8                          │
     │    (Grant email, profile access)                     │
     │                                                       │
     │ 7. Redirect back to Context8 callback                │
     │    /api/auth/callback/google?code=AUTH_CODE&state=...│
     ├──────────────────────────────────────────────────────►
     │                                                       │
     │ 8. Validate state (CSRF check)                       │
     │ 9. Exchange code for access_token (with PKCE verify) │
     │ 10. Fetch user profile from Google                   │
     │ 11. Upsert user in database                          │
     │ 12. Create session in database                       │
     │ 13. Set session cookie                               │
     │                                                       │
     │ 14. Redirect to /dashboard                           │
     ◄───────────────────────────────────────────────────────┤
     │    Set-Cookie: next-auth.session-token=...           │
     │                                                       │
     │ 15. Load dashboard with user data                    │
     ├──────────────────────────────────────────────────────►
     │                                                       │
     ▼                                                       ▼
```

---

## Step-by-Step Flow

### Step 1-2: User Initiates Signin

**User Action**: Clicks "Start free (OAuth)" CTA on landing page

**Request**:
```http
GET / HTTP/1.1
Host: context8.vercel.app
```

**Response**:
```http
HTTP/1.1 302 Found
Location: /auth/signin
```

---

### Step 3: User Selects OAuth Provider

**Page**: `/auth/signin`

**UI**:
- Headline: "Sign in to Context8"
- Subheadline: "OAuth‑gated MCP access — even for Free."
- Buttons:
  - "Continue with Google"
  - "Continue with GitHub"
- Legal text: "By continuing, you agree to our Terms and Privacy Policy."

**User Action**: Clicks "Continue with Google"

---

### Step 4-5: Redirect to Google OAuth Consent

**Auth.js Action**:
1. Generate PKCE code_verifier (random 128-byte string, base64url-encoded)
2. Generate PKCE code_challenge (SHA256 hash of code_verifier, base64url-encoded)
3. Generate CSRF state parameter (random token, stored in session cookie)
4. Construct authorization URL

**Request** (browser redirects):
```http
GET https://accounts.google.com/o/oauth2/v2/auth HTTP/1.1
?response_type=code
&client_id=YOUR_GOOGLE_CLIENT_ID
&redirect_uri=https://context8.vercel.app/api/auth/callback/google
&scope=openid%20email%20profile
&state=RANDOM_CSRF_TOKEN
&code_challenge=PKCE_CODE_CHALLENGE
&code_challenge_method=S256
```

**Parameters**:
- `response_type=code`: Authorization Code Flow
- `client_id`: Google OAuth client ID (from environment variable)
- `redirect_uri`: Where Google redirects after user authorization
- `scope`: Requested permissions (email, profile, OpenID)
- `state`: CSRF protection token
- `code_challenge`: PKCE challenge (prevents authorization code interception)
- `code_challenge_method=S256`: SHA256 hashing for PKCE

---

### Step 6: User Authorizes on Google

**Google OAuth Consent Screen**:
- Shows Context8 app name and logo
- Requests permissions: "View your email address" and "View your basic profile info"
- User clicks "Allow"

---

### Step 7: Google Redirects Back to Context8

**Request** (Google redirects browser):
```http
GET /api/auth/callback/google HTTP/1.1
Host: context8.vercel.app
?code=4/0AeaYSHABCDEFGHIJKLMNOPQRSTUVWXYZ
&state=RANDOM_CSRF_TOKEN
```

**Parameters**:
- `code`: Authorization code (single-use, expires in ~10 minutes)
- `state`: Same CSRF token sent in step 5

---

### Step 8-13: Server-Side Token Exchange and Session Creation

**Auth.js Callback Handler** (`/api/auth/callback/google`):

1. **Validate State (CSRF Check)**:
   ```typescript
   if (query.state !== storedState) {
     throw new Error("CSRF token mismatch");
   }
   ```

2. **Exchange Authorization Code for Access Token**:
   ```http
   POST https://oauth2.googleapis.com/token HTTP/1.1
   Content-Type: application/x-www-form-urlencoded

   code=4/0AeaYSH...
   &client_id=YOUR_GOOGLE_CLIENT_ID
   &client_secret=YOUR_GOOGLE_CLIENT_SECRET
   &redirect_uri=https://context8.vercel.app/api/auth/callback/google
   &grant_type=authorization_code
   &code_verifier=PKCE_CODE_VERIFIER
   ```

   **Response**:
   ```json
   {
     "access_token": "ya29.a0AfB_byC...",
     "expires_in": 3599,
     "scope": "openid email profile",
     "token_type": "Bearer",
     "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE..."
   }
   ```

3. **Fetch User Profile** (using access_token):
   ```http
   GET https://www.googleapis.com/oauth2/v2/userinfo HTTP/1.1
   Authorization: Bearer ya29.a0AfB_byC...
   ```

   **Response**:
   ```json
   {
     "id": "1234567890",
     "email": "user@example.com",
     "verified_email": true,
     "name": "John Doe",
     "picture": "https://lh3.googleusercontent.com/..."
   }
   ```

4. **Upsert User in Database**:
   ```typescript
   const user = await db.insert(users).values({
     email: profile.email,
     name: profile.name,
     provider: "google",
     providerId: profile.id,
     plan: "free" // Default plan
   }).onConflictDoUpdate({
     target: users.email,
     set: { updatedAt: new Date() }
   }).returning();
   ```

5. **Create Session**:
   ```typescript
   const sessionToken = randomUUID(); // Or crypto.randomBytes(32).toString('hex')
   const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

   await db.insert(sessions).values({
     userId: user.id,
     sessionToken: hashToken(sessionToken), // Hash before storing
     expiresAt
   });
   ```

6. **Set Session Cookie**:
   ```http
   Set-Cookie: next-auth.session-token=abc123...xyz;
               HttpOnly;
               Secure;
               SameSite=Lax;
               Path=/;
               Expires=Tue, 22 Oct 2025 11:00:00 GMT
   ```

---

### Step 14-15: Redirect to Dashboard

**Response**:
```http
HTTP/1.1 302 Found
Location: /dashboard
Set-Cookie: next-auth.session-token=...
```

**Dashboard Page** (`/dashboard`):
- Middleware checks session cookie
- If valid: render dashboard with user data
- If invalid/expired: redirect to `/auth/signin`

---

## Error Handling

### User Denies Authorization

**Flow**: User clicks "Cancel" on Google consent screen

**Google Redirect**:
```http
GET /api/auth/callback/google HTTP/1.1
?error=access_denied
&error_description=User%20denied%20access
&state=RANDOM_CSRF_TOKEN
```

**Auth.js Handler**:
- Detects `error` parameter
- Redirects to `/auth/signin?error=AccessDenied`

**Sign-in Page**:
- Displays: "Access was denied by the provider."
- User can try again

---

### OAuth Provider Unavailable

**Scenario**: Google OAuth service is down during signin

**Auth.js Behavior**:
- Network timeout when contacting `https://accounts.google.com`
- Catch error and redirect to `/auth/signin?error=OAuthCallback`

**Sign-in Page**:
- Displays: "Authentication failed. Please try again."

---

### Rate Limit Exceeded

**Scenario**: User attempts to sign in 31 times in one hour (exceeds 30/IP/hour limit)

**Middleware**:
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/auth/signin')) {
    const ip = req.ip || req.headers.get('x-forwarded-for');
    const attempts = await rateLimiter.check(ip, 'signin', 30, 3600); // 30 per hour

    if (attempts > 30) {
      return new Response(
        JSON.stringify({ error: "Too many requests — please wait and try again." }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  return NextResponse.next();
}
```

---

## Session Validation

### On Every Protected Route Request

**Middleware** (`middleware.ts`):
```typescript
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const sessionToken = req.cookies.get('next-auth.session-token')?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.sessionToken, hashToken(sessionToken)),
        gt(sessions.expiresAt, new Date())
      )
    });

    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Session valid, continue to protected route
    return NextResponse.next();
  }
}
```

---

## Session Refresh (Silent Renewal)

**Scenario**: User session expires after 60 minutes

**Current Behavior (MVP)**:
- No automatic refresh
- User must sign in again

**Future Enhancement** (Post-MVP):
- Implement silent refresh using OAuth refresh tokens
- Extend session automatically if user is active

---

## Sign Out Flow

**User Action**: Clicks "Sign Out" button

**Request**:
```http
POST /api/auth/signout HTTP/1.1
Cookie: next-auth.session-token=abc123...xyz
```

**Auth.js Handler**:
1. Delete session from database:
   ```typescript
   await db.delete(sessions).where(eq(sessions.sessionToken, hashedToken));
   ```

2. Clear session cookie:
   ```http
   Set-Cookie: next-auth.session-token=; Max-Age=0; Path=/
   ```

3. Redirect to landing page:
   ```http
   HTTP/1.1 302 Found
   Location: /
   ```

---

## Security Considerations

### CSRF Protection
- State parameter is random token stored in session cookie
- Validated on callback to prevent CSRF attacks

### PKCE (Proof Key for Code Exchange)
- Prevents authorization code interception attacks
- code_challenge sent in authorization request
- code_verifier sent in token exchange (only Auth.js server knows it)

### Token Storage
- OAuth access tokens never sent to browser
- Session tokens stored in HttpOnly cookies (JavaScript cannot access)
- Session tokens hashed before storing in database

### Session Security
- HttpOnly: Prevents XSS attacks from stealing session tokens
- Secure: HTTPS-only in production
- SameSite=Lax: Prevents CSRF while allowing OAuth redirects

### Rate Limiting
- 30 signin attempts per IP per hour
- 15 signin attempts per user per hour
- Prevents brute-force attacks

---

## Testing Authentication Flow

### Manual Testing

1. **Happy Path**:
   - Navigate to `/`
   - Click "Start free (OAuth)"
   - Select "Continue with Google"
   - Authorize on Google
   - Verify redirect to `/dashboard`
   - Verify session cookie is set
   - Verify user data appears in dashboard

2. **Denial Path**:
   - Start signin flow
   - Click "Cancel" on Google consent
   - Verify redirect back to `/auth/signin`
   - Verify error message displays

3. **Session Expiry**:
   - Sign in successfully
   - Wait 60 minutes (or manually expire session in database)
   - Try to access `/dashboard`
   - Verify redirect to `/auth/signin`

### Automated E2E Tests (Playwright)

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('User can sign in with Google', async ({ page, context }) => {
  // Mock OAuth flow in test environment
  await context.route('https://accounts.google.com/**', route => {
    // Intercept and mock OAuth consent
    route.fulfill({ status: 302, headers: { Location: '/api/auth/callback/google?code=TEST_CODE&state=TEST_STATE' } });
  });

  await page.goto('/');
  await page.click('text=Start free (OAuth)');
  await expect(page).toHaveURL('/auth/signin');

  await page.click('text=Continue with Google');

  // After mock OAuth flow, should be on dashboard
  await expect(page).toHaveURL('/dashboard');

  // Verify session cookie is set
  const cookies = await context.cookies();
  const sessionCookie = cookies.find(c => c.name === 'next-auth.session-token');
  expect(sessionCookie).toBeDefined();
  expect(sessionCookie.httpOnly).toBe(true);
});
```

---

## Summary

**Flow**: Authorization Code Flow with PKCE
**Providers**: Google, GitHub
**Session Storage**: Database (PostgreSQL)
**Session Duration**: 60 minutes
**CSRF Protection**: State parameter
**PKCE**: code_challenge + code_verifier
**Cookie Flags**: HttpOnly, Secure, SameSite=Lax
**Rate Limiting**: 30/IP/hour, 15/user/hour

**Next Steps**: Implement in `lib/auth.ts` and `app/api/auth/[...nextauth]/route.ts`
