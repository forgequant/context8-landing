# Implementation Plan: Crypto Subscription Payment System

**Branch**: `003-crypto-subscription-payments` | **Date**: 2025-10-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-crypto-subscription-payments/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement manual cryptocurrency subscription payment system allowing users to upgrade from Free to Pro plan ($8/month) by sending USDT/USDC on Ethereum, Polygon, or BSC networks. Users submit transaction hashes for admin verification. System activates 30-day Pro subscriptions upon approval. Includes admin panel for payment verification with blockchain explorer integration, subscription status management on user dashboard, and email notifications for payment status updates.

**Technical Approach**: Frontend-only implementation using existing React 19 + Vite + TypeScript + Tailwind CSS stack with Supabase backend (PostgreSQL + Auth + RLS). Add two new database tables (subscriptions, payment_submissions), create payment modal with QR codes (qrcode.react), build admin panel route with blockchain explorer links, and implement subscription status checks in existing Dashboard component.

## Technical Context

**Language/Version**: TypeScript 5.x (via Vite 7), React 19.2
**Primary Dependencies**:
- Frontend: React 19, React Router 7, Framer Motion 12, Tailwind CSS v3
- Backend/Auth: Supabase (PostgreSQL + Auth with Google/GitHub OAuth)
- New: qrcode.react (QR code generation), date-fns (date calculations)

**Storage**: Supabase PostgreSQL with Row Level Security policies
**Testing**: Vitest (unit tests), React Testing Library (component tests)
**Target Platform**: Web (desktop + mobile responsive), deployed on Vercel
**Project Type**: Web application (frontend-only SPA, backend via Supabase)
**Performance Goals**:
- Payment modal load < 1s
- QR code generation < 200ms
- Admin panel list render < 2s for 100 pending payments
- Blockchain explorer links open instantly (external)

**Constraints**:
- No backend code (Supabase only)
- Must work on mobile (QR scanning)
- Static wallet addresses (no dynamic generation)
- Manual admin verification (no automated on-chain checks)
- Vercel deployment limits (no serverless functions needed)

**Scale/Scope**:
- Expected: 10-50 Pro subscriptions/month initially
- Database: <1000 payment submissions/year
- 3 new React components (PaymentModal, AdminPanel, SubscriptionStatus)
- 2 database tables, 4-6 RLS policies
- ~800-1200 lines of new TypeScript code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. AI-First Architecture ✅ PASS
**Principle**: Context assembled server-side; LLM does not fetch sources directly.
**Compliance**: N/A - This feature is payment/subscription system, not MCP data aggregation. No impact on report generation.

### II. Minimal Surface Area ✅ PASS
**Principle**: No public endpoints without OAuth; even Free tier requires login.
**Compliance**: ✅ All payment and admin endpoints require Supabase OAuth authentication. Payment modal only accessible to logged-in users. Admin panel gated by admin role check. No unauthenticated payment submission possible.

### III. Deterministic Format ✅ PASS
**Principle**: Stable Markdown sections and labels for reliable LLM parsing.
**Compliance**: N/A - This feature doesn't affect MCP report format. Email notifications use simple templates (not LLM-parsed).

### IV. Modular Adapters ✅ PASS
**Principle**: Each source is an independent plug-in with uniform interface.
**Compliance**: N/A - No data source adapters in this feature. Payment system is self-contained.

### V. Dark-Theme UX ✅ PASS
**Principle**: Dark theme and minimal copy; avoid cognitive load.
**Compliance**: ✅ Payment modal and admin panel use existing dark theme (`bg-graphite-950`, `text-terminal-text`). Minimal copy with clear CTAs ("Verify", "Approve/Reject", "Submit Payment"). Mobile-responsive design with Tailwind.

### VI. Privacy-First Telemetry ✅ PASS
**Principle**: No sensitive data in logs; opt-out analytics by default.
**Compliance**: ✅ Transaction hashes and wallet addresses logged only in database, not application logs. User emails access via Supabase (already compliant). No analytics added by this feature. PII (user_id, email) protected by Supabase RLS policies.

### VII. Operational Simplicity ✅ PASS
**Principle**: Minimal dependencies; predictable builds; reproducible deploys.
**Compliance**: ✅ Only 2 new dependencies (qrcode.react, date-fns), both lightweight and well-maintained. No backend code, no new infrastructure. Deploys via existing Vercel pipeline. Static wallet addresses eliminate dynamic key management complexity.

### Technology Stack Alignment ⚠️ PARTIAL DEVIATION (Pre-existing)

**Constitution States**: "Frontend: Next.js (App Router) + React + TypeScript + TailwindCSS + shadcn/ui + next-themes"

**Current Reality**: Project uses **Vite 7 + React 19** (not Next.js)

**Status**: ⚠️ **ACKNOWLEDGED** - This deviation exists in the base project before this feature. Constitution likely written before project started or needs updating. This feature maintains existing architecture (Vite + React) rather than introducing new violations.

**Impact**: None for this feature. Payment system works identically in Vite or Next.js.

**Action**: Continue with Vite. Recommend updating constitution.md to reflect actual tech stack in future amendment.

### Gate Evaluation: ✅ **PASS** - All applicable principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/003-crypto-subscription-payments/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── database.sql     # Supabase schema and RLS policies
│   └── types.ts         # TypeScript interfaces for payment/subscription
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Project Type**: Web application (frontend SPA with Supabase backend)

```text
frontend-v2/
├── src/
│   ├── components/
│   │   ├── payment/
│   │   │   ├── PaymentModal.tsx          # NEW: Multi-chain payment UI
│   │   │   ├── ChainSelector.tsx         # NEW: Ethereum/Polygon/BSC selector
│   │   │   ├── QRCodeDisplay.tsx         # NEW: Wallet QR code + address
│   │   │   └── TxHashInput.tsx           # NEW: Transaction hash submission
│   │   ├── subscription/
│   │   │   ├── SubscriptionStatus.tsx    # NEW: Current plan display
│   │   │   ├── PaymentHistory.tsx        # NEW: Past payments table
│   │   │   └── RenewalReminder.tsx       # NEW: Expiration warnings
│   │   └── admin/
│   │       ├── AdminPanel.tsx            # NEW: Payment verification dashboard
│   │       ├── PaymentSubmissionRow.tsx  # NEW: Single payment entry
│   │       └── VerificationModal.tsx     # NEW: Approve/reject with notes
│   ├── pages/
│   │   ├── Dashboard.tsx                 # MODIFIED: Add subscription status
│   │   ├── Admin.tsx                     # NEW: Admin-only route
│   │   └── Subscribe.tsx                 # NEW: Upgrade flow (optional)
│   ├── lib/
│   │   ├── supabase.ts                   # EXISTING: Supabase client
│   │   ├── subscription.ts               # NEW: Subscription helpers
│   │   └── blockchain.ts                 # NEW: Explorer URL generators
│   ├── hooks/
│   │   ├── useSubscription.ts            # NEW: Current subscription state
│   │   ├── usePaymentSubmissions.ts      # NEW: Admin payment list
│   │   └── useAuth.ts                    # MODIFIED: Add admin role check
│   ├── data/
│   │   ├── walletAddresses.ts            # NEW: Static addresses per chain
│   │   └── pricing.ts                    # MODIFIED: Update Pro plan to $8
│   └── types/
│       └── subscription.ts               # NEW: TypeScript interfaces
│
├── supabase/                             # NEW: Database migrations
│   └── migrations/
│       └── 001_crypto_subscriptions.sql  # Tables + RLS policies
│
└── tests/                                # NEW: Test files
    ├── components/
    │   ├── PaymentModal.test.tsx
    │   └── AdminPanel.test.tsx
    └── lib/
        └── subscription.test.ts
```

**Structure Decision**: Existing **Web SPA** structure (Vite + React). Frontend-only with Supabase backend via REST API. All new payment/subscription code organized under `/components/{payment,subscription,admin}/`, `/lib/{subscription,blockchain}.ts`, and `/hooks/use{Subscription,PaymentSubmissions}.ts`. Database schema in `/supabase/migrations/` directory (new). No backend code needed - Supabase handles all database operations with RLS policies.

## Complexity Tracking

**Status**: N/A - No constitution violations requiring justification
