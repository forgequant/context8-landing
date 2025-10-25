# Phase 0: Research & Best Practices

**Feature**: MVP Website (Landing, Dashboard, Auth)
**Date**: 2025-10-22
**Purpose**: Research best practices and establish technical foundation for implementation

## Research Areas

### 1. Next.js 14 App Router Best Practices

**Decision**: Use Next.js 14+ App Router with route groups and server components

**Rationale**:
- App Router is the recommended approach for new Next.js projects (stable since v13.4)
- Server Components reduce JavaScript bundle size and improve performance
- Route groups `(marketing)`, `(auth)`, `(dashboard)` enable layout composition without affecting URL structure
- Middleware support for authentication checks on protected routes
- Built-in support for streaming and Suspense for better UX

**Alternatives Considered**:
- Pages Router (legacy): Simpler mental model but lacks modern features; being phased out
- Remix: Similar RSC approach but smaller ecosystem and less mature tooling

**Best Practices Adopted**:
- Use Server Components by default; opt into Client Components only when needed (interactivity, hooks)
- Implement loading.tsx and error.tsx for each route for better UX
- Leverage parallel routes for dashboard sections (plan, sources)
- Use Next.js Image component for optimized landing page assets
- Implement metadata API for SEO (title, description, Open Graph)

**References**:
- https://nextjs.org/docs/app/building-your-application/routing
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

### 2. Auth.js (NextAuth) v5 Configuration

**Decision**: Use Auth.js v5 (next-auth@beta) with OAuth providers only

**Rationale**:
- Auth.js v5 is designed for App Router (v4 primarily supports Pages Router)
- Built-in OAuth provider support for Google and GitHub
- Handles CSRF protection, state parameter validation, PKCE automatically
- Session management with secure cookie configuration
- Database adapter support for user/session persistence

**Alternatives Considered**:
- Clerk: Commercial, great DX but adds cost and vendor lock-in
- NextAuth v4: Stable but Pages Router focused; migration path unclear
- Custom OAuth: Too complex; reinventing the wheel

**Configuration Approach**:
```typescript
// lib/auth.ts structure
export const authOptions = {
  providers: [
    GoogleProvider({ clientId, clientSecret }),
    GitHubProvider({ clientId, clientSecret })
  ],
  adapter: PrismaAdapter(db), // or DrizzleAdapter
  session: {
    strategy: "database", // or "jwt" for serverless
    maxAge: 60 * 60 // 60 minutes per spec
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  callbacks: {
    session: async ({ session, user }) => {
      // Attach user plan to session
      session.user.plan = user.plan;
      return session;
    }
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
};
```

**Best Practices Adopted**:
- Use database sessions for better security and revocation support
- Implement custom error pages for auth failures
- Extend session object to include user plan (Free/Pro)
- Set appropriate cookie flags (HttpOnly, Secure, SameSite)
- Use environment variables for OAuth client credentials

**Rate Limiting Implementation**:
- Use middleware or edge functions to track signin attempts by IP and user
- Store attempts in Redis (if available) or in-memory cache (MVP)
- Return 429 after threshold (30/IP/hour, 15/user/hour)

**References**:
- https://authjs.dev/getting-started/installation
- https://authjs.dev/reference/core/providers_google
- https://authjs.dev/reference/core/providers_github

---

### 3. Dark Theme Implementation (TailwindCSS + next-themes)

**Decision**: Use TailwindCSS dark mode with next-themes for theme management

**Rationale**:
- TailwindCSS has built-in dark mode support via `dark:` variant
- next-themes provides system preference detection and theme persistence
- shadcn/ui components are pre-configured for dark mode
- CSS variables approach enables dynamic theme customization

**Configuration**:
```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"], // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // shadcn/ui default dark theme colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... other semantic colors
      }
    }
  }
};
```

```typescript
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Default to dark per spec
          enableSystem={false} // Disable system preference for MVP
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Best Practices Adopted**:
- Use CSS custom properties for colors (enables theme customization)
- Apply `dark:` variants consistently across all components
- Use `suppressHydrationWarning` on `<html>` to prevent hydration errors
- Default to dark theme; light mode toggle can be added post-MVP

**References**:
- https://tailwindcss.com/docs/dark-mode
- https://ui.shadcn.com/docs/dark-mode/next
- https://github.com/pacocoursey/next-themes

---

### 4. Database Selection & ORM

**Decision**: Use PostgreSQL with Drizzle ORM for production; SQLite for local development

**Rationale**:
- PostgreSQL: Industry standard, excellent Vercel integration, supports JSON columns for flexibility
- Drizzle ORM: Type-safe, minimal overhead, great DX, schema migrations included
- SQLite: Zero-config local development, same Drizzle API

**Alternatives Considered**:
- Prisma: Popular but slower than Drizzle; larger bundle size
- Supabase: Great for real-time features but adds complexity; overkill for MVP
- Postgres.js: Lower-level but requires manual query building

**Schema Design** (see data-model.md for full details):
```typescript
// Example Drizzle schema structure
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  provider: varchar("provider", { length: 50 }).notNull(), // "google" | "github"
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 20 }).default("free"), // "free" | "pro"
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Best Practices Adopted**:
- Use serial (auto-increment) primary keys
- Index email and token columns for fast lookups
- Use timestamps for audit trails
- Normalize user/session data (separate tables)
- Use Drizzle Kit for migrations

**References**:
- https://orm.drizzle.team/docs/overview
- https://vercel.com/docs/storage/vercel-postgres
- https://orm.drizzle.team/docs/get-started-postgresql

---

### 5. Responsive Design & Mobile-First Approach

**Decision**: Mobile-first responsive design using TailwindCSS breakpoints

**Rationale**:
- 50%+ of web traffic is mobile; prioritize mobile UX
- TailwindCSS mobile-first breakpoints (sm:, md:, lg:, xl:, 2xl:)
- Flexbox and Grid for layout (no custom CSS)
- Touch-friendly targets (min 44x44px for buttons)

**Breakpoint Strategy**:
- Base (mobile): 320px - 639px
- sm: 640px+ (large phones, small tablets)
- md: 768px+ (tablets)
- lg: 1024px+ (desktops)
- xl: 1280px+ (large desktops)
- 2xl: 1536px+ (ultra-wide)

**Implementation Patterns**:
```tsx
// Example: Hero section responsive layout
<section className="
  flex flex-col gap-6         /* Mobile: stack vertically */
  md:flex-row md:gap-12       /* Tablet+: horizontal layout */
  lg:gap-16                   /* Desktop: larger gaps */
">
  <div className="
    w-full                    /* Mobile: full width */
    md:w-1/2                  /* Tablet+: 50% width */
  ">
    {/* Content */}
  </div>
</section>
```

**Best Practices Adopted**:
- Design for 320px first (iPhone SE), scale up
- Use `container` and `max-w-*` utilities for content width constraints
- Test on real devices (not just browser DevTools)
- Ensure touch targets are at least 44x44px (use `p-4` on buttons)
- Use responsive typography (`text-sm md:text-base lg:text-lg`)

**References**:
- https://tailwindcss.com/docs/responsive-design
- https://www.a11yproject.com/posts/large-touch-targets/

---

### 6. Static Site Copy Management (YAML)

**Decision**: Store site copy in TypeScript config files (not YAML at runtime)

**Rationale**:
- YAML parsing at runtime adds overhead
- TypeScript provides type safety for copy
- Tree-shaking eliminates unused copy
- Easier IDE autocomplete and refactoring

**Approach**:
```typescript
// config/site-copy.ts
export const siteCopy = {
  brand: {
    name: "Context8",
    shortTagline: "AI‑ready crypto context. One URL away.",
    longTagline: "An OAuth‑gated MCP server that returns concise, LLM‑ready crypto briefings."
  },
  cta: {
    startFree: "Start free (OAuth)",
    joinWaitlist: "Join waitlist",
    upgradePro: "Upgrade to Pro"
  },
  landing: {
    hero: {
      title: "AI‑ready crypto context. One URL away.",
      subtitle: "Context8 is an OAuth‑gated MCP server..."
    },
    // ... other sections
  }
} as const; // as const for literal types

// Type-safe usage in components
import { siteCopy } from "@/config/site-copy";

<h1>{siteCopy.landing.hero.title}</h1>
```

**Best Practices Adopted**:
- Use `as const` for literal type inference
- Export individual sections for better tree-shaking
- Keep one source of truth for all copy
- Use descriptive keys (`cta.startFree` not `button1`)

**Alternative** (if YAML preferred for non-technical content editing):
- Parse YAML at build time (not runtime) using next.config.js
- Generate TypeScript types from YAML schema
- Validates copy structure at build time

---

### 7. Performance Optimization

**Decision**: Implement static generation where possible, with ISR for dashboard

**Rationale**:
- Landing page is fully static → SSG (Static Site Generation)
- Dashboard requires user data → SSR (Server-Side Rendering) or ISR
- Next.js Image component for optimized images
- Code splitting via route groups automatically

**Caching Strategy**:
```typescript
// Landing page - fully static
export const dynamic = "force-static";

// Dashboard - revalidate every 60 seconds
export const revalidate = 60;
```

**Image Optimization**:
- Use Next.js Image component with `priority` for above-the-fold images
- Serve WebP/AVIF formats automatically
- Lazy load below-the-fold images

**Bundle Optimization**:
- Use Server Components to reduce client-side JavaScript
- Dynamic imports for heavy components (e.g., FAQ accordion)
- Minimize use of client-side libraries

**Best Practices Adopted**:
- Measure performance with Lighthouse CI in CI/CD
- Set performance budgets (Lighthouse 90+ mobile/desktop)
- Use `next/font` for optimized font loading
- Implement proper caching headers

**References**:
- https://nextjs.org/docs/app/building-your-application/optimizing/images
- https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- https://web.dev/vitals/

---

### 8. Testing Strategy

**Decision**: Vitest for unit tests, Playwright for E2E tests

**Rationale**:
- Vitest: Fast, Vite-powered, great TypeScript support, Jest-compatible API
- Playwright: Multi-browser support, reliable E2E tests, auto-wait built-in
- Avoid testing implementation details; test user behavior

**Testing Layers**:
1. **Unit Tests (Vitest)**: Utility functions, helpers, pure components
2. **Integration Tests (Vitest + React Testing Library)**: Component interactions
3. **E2E Tests (Playwright)**: Full user journeys (landing → auth → dashboard)

**E2E Test Coverage** (from acceptance scenarios):
```typescript
// tests/e2e/auth.spec.ts
test("User can sign in with Google", async ({ page }) => {
  await page.goto("/");
  await page.click('text=Start free (OAuth)');
  await expect(page).toHaveURL("/auth/signin");
  await page.click('text=Continue with Google');
  // Mock OAuth flow in test environment
  await expect(page).toHaveURL("/dashboard");
});
```

**Best Practices Adopted**:
- Test user behavior, not implementation
- Use data-testid only when necessary (prefer accessible queries)
- Mock external services (OAuth providers) in E2E tests
- Run Playwright tests in CI on every PR

**References**:
- https://vitest.dev/guide/
- https://playwright.dev/docs/intro
- https://testing-library.com/docs/react-testing-library/intro/

---

## Summary

All technical decisions are resolved. No NEEDS CLARIFICATION markers remain.

**Key Decisions**:
1. Next.js 14 App Router with route groups
2. Auth.js v5 with database sessions
3. TailwindCSS dark mode + next-themes
4. PostgreSQL + Drizzle ORM
5. Mobile-first responsive design
6. TypeScript config for site copy (not runtime YAML)
7. SSG for landing, SSR/ISR for dashboard
8. Vitest + Playwright for testing

**Next Steps**: Proceed to Phase 1 (Design) to generate:
- data-model.md (entities, relationships, validation)
- contracts/ (API routes, OAuth flow)
- quickstart.md (local setup guide)
