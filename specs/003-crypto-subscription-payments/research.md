# Research: Crypto Subscription Payment System

**Feature**: 003-crypto-subscription-payments
**Phase**: 0 - Outline & Research
**Date**: 2025-10-27

## Overview

This document consolidates research findings and technical decisions for implementing the manual cryptocurrency subscription payment system.

## Key Decisions

### 1. QR Code Library Selection

**Decision**: Use `qrcode.react` v4.x

**Rationale**:
- Lightweight (7.3KB gzipped)
- React 19 compatible
- SVG/Canvas rendering options
- Active maintenance (last updated 2024)
- Simple API: `<QRCodeSVG value={address} size={256} />`

**Alternatives Considered**:
- `react-qr-code` - Similar but larger bundle
- `qrcode.js` + manual React wrapper - More complexity
- `html5-qrcode` - Scanner focused, not generator

**Implementation**: Use SVG rendering for crisp display on all screens, 256x256px default size.

### 2. Date Manipulation Library

**Decision**: Use `date-fns` v3.x

**Rationale**:
- Tree-shakeable (only import needed functions)
- TypeScript native
- Immutable date handling
- Well-documented
- Needed for: subscription expiration calculations, "days remaining" display, renewal reminders

**Alternatives Considered**:
- `dayjs` - Similar size but less TypeScript support
- Native Date object - More verbose, error-prone for complex calculations
- `moment.js` - Deprecated, large bundle

**Functions Needed**: `addDays`, `differenceInDays`, `format`, `isBefore`, `isAfter`

### 3. Blockchain Explorer Integration

**Decision**: Static URL templates per network, no API calls

**Rationale**:
- Free (no API keys)
- Reliable (direct links to explorers)
- Simple implementation (string templates)
- User familiar with explorer UIs

**URL Templates**:
```typescript
const EXPLORER_URLS = {
  ethereum: (txHash: string) => `https://etherscan.io/tx/${txHash}`,
  polygon: (txHash: string) => `https://polygonscan.com/tx/${txHash}`,
  bsc: (txHash: string) => `https://bscscan.com/tx/${txHash}`
}
```

**Alternatives Considered**:
- Etherscan API - Rate limited (5 calls/sec free), adds complexity
- Web3.js on-chain verification - Requires RPC nodes, async, complex
- Blockchain.com API - Limited network support

### 4. Transaction Hash Validation

**Decision**: Client-side regex validation only

**Pattern**: `/^0x[a-fA-F0-9]{64}$/`

**Rationale**:
- Fast client-side feedback
- Prevents obvious typos
- Admin verifies actual validity on-chain
- No need for complex on-chain validation in MVP

**Implementation**:
```typescript
const isValidTxHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}
```

### 5. Wallet Address Storage

**Decision**: Static addresses in TypeScript constants file

**Rationale**:
- Simple (no database table)
- Easy to update (code change + deploy)
- Version controlled
- No dynamic generation complexity

**Structure**:
```typescript
// frontend-v2/src/data/walletAddresses.ts
export const WALLET_ADDRESSES = {
  ethereum: {
    usdt: '0x...',  // ERC-20 USDT
    usdc: '0x...'   // ERC-20 USDC
  },
  polygon: {
    usdt: '0x...',  // Polygon USDT
    usdc: '0x...'   // Polygon USDC
  },
  bsc: {
    usdt: '0x...',  // BSC USDT
    usdc: '0x...'   // BSC USDC
  }
} as const
```

**Security Note**: Addresses are public anyway (displayed to users). Private keys stay offline/hardware wallet.

### 6. Admin Role Management

**Decision**: Use Supabase user metadata field `is_admin`

**Rationale**:
- Built into Supabase Auth
- Checked via `user.user_metadata.is_admin === true`
- Set manually via Supabase Dashboard SQL:
  ```sql
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
  WHERE email = 'admin@example.com';
  ```
- RLS policies can check this metadata
- No separate admin table needed

**Alternatives Considered**:
- Separate `admins` table - More complex, requires joins
- Hardcoded email list - Not scalable
- Supabase roles - Requires custom claims setup

### 7. Email Notifications

**Decision**: Use Supabase Auth email templates + custom triggers

**Rationale**:
- Supabase has built-in email service (SendGrid/Resend integration)
- Can trigger emails via PostgreSQL functions
- Free tier: 30k emails/month
- Simple template system

**Implementation**: PostgreSQL function + trigger on `payment_submissions` status change:
```sql
CREATE OR REPLACE FUNCTION notify_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'verified' THEN
    PERFORM notify_user_payment_approved(NEW.user_id);
  ELSIF NEW.status = 'rejected' THEN
    PERFORM notify_user_payment_rejected(NEW.user_id, NEW.verification_notes);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Alternatives Considered**:
- Frontend email trigger - Less reliable, can be bypassed
- Third-party service (SendGrid direct) - More complexity
- No emails - Poor UX

### 8. Subscription Expiration Check

**Decision**: Client-side check on Dashboard load + database query

**Implementation**:
```typescript
const checkSubscriptionStatus = async (userId: string) => {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gte('end_date', new Date().toISOString())
    .single()

  return subscription // null if expired
}
```

**Rationale**:
- Simple SQL query
- No cron jobs needed for MVP
- Checked on each page load (acceptable for low traffic)
- Future: background job to mark expired subscriptions

### 9. Grace Period Handling

**Decision**: 48-hour grace period after expiration

**Implementation**: Check `end_date + 48 hours` instead of exact `end_date` for access:
```typescript
const hasActiveSubscription = (subscription: Subscription) => {
  const graceEndDate = addDays(new Date(subscription.end_date), 2)
  return isBefore(new Date(), graceEndDate)
}
```

**Rationale**:
- Accounts for payment verification delays
- Good UX - users don't lose access immediately
- Clearly communicated in UI

### 10. Duplicate Transaction Prevention

**Decision**: Database UNIQUE constraint on `tx_hash` column

**Implementation**:
```sql
CREATE TABLE payment_submissions (
  id UUID PRIMARY KEY,
  tx_hash TEXT NOT NULL UNIQUE,  -- Prevents duplicates
  ...
);
```

**Rationale**:
- Database-level enforcement (most reliable)
- Returns clear error to client
- No race conditions
- Simple to implement

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 19.2 | UI components |
| Build | Vite | 7.x | Dev server + bundler |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Animation | Framer Motion | 12.x | Modal animations |
| Routing | React Router | 7.x | Client-side routing |
| Backend | Supabase | Latest | PostgreSQL + Auth + RLS |
| QR Codes | qrcode.react | 4.x | Payment address QR |
| Dates | date-fns | 3.x | Subscription calculations |
| Hosting | Vercel | N/A | Static site deployment |

## Best Practices Applied

### Security
- ✅ All endpoints require OAuth (Supabase RLS)
- ✅ Admin role check via user metadata
- ✅ Transaction hash validation prevents injection
- ✅ UNIQUE constraint prevents double-spending claims
- ✅ Private keys never in codebase (static addresses only)

### Performance
- ✅ Tree-shakeable dependencies (date-fns)
- ✅ Lazy-loaded admin route (`React.lazy`)
- ✅ SVG QR codes (smaller than canvas)
- ✅ Client-side validation reduces server load
- ✅ Database indexes on frequently queried columns

### UX
- ✅ Mobile-responsive QR codes for wallet scanning
- ✅ Clear error messages for invalid tx hashes
- ✅ Network warnings to prevent wrong-chain sends
- ✅ Real-time blockchain explorer links for verification
- ✅ Email notifications for payment status updates

### Maintainability
- ✅ TypeScript for type safety
- ✅ Modular component structure
- ✅ Reusable hooks (useSubscription, usePaymentSubmissions)
- ✅ Database migrations in version control
- ✅ Static wallet addresses (easy to update)

## Open Questions (None Remaining)

All technical decisions finalized. Ready for Phase 1 (Data Model & Contracts).
