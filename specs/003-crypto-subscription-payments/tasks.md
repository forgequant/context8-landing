# Tasks: Crypto Subscription Payment System

**Input**: Design documents from `/specs/003-crypto-subscription-payments/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL and NOT included per specification (no TDD requirement mentioned).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths included in descriptions

## Path Conventions

Project structure (post-restructure): `src/`, `public/`, `index.html` at repository root (Vite SPA)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and database setup

- [ ] T001 Install new dependencies: qrcode.react and date-fns via npm
- [ ] T002 Run Supabase migration from specs/003-crypto-subscription-payments/contracts/database.sql
- [ ] T003 Grant admin role to initial admin user(s) via Supabase SQL Editor
- [ ] T004 [P] Create src/types/subscription.ts from specs/003-crypto-subscription-payments/contracts/types.ts
- [ ] T005 [P] Create src/data/walletAddresses.ts with static payment addresses for Ethereum, Polygon, BSC

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and configurations needed by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 [P] Create src/lib/blockchain.ts with blockchain explorer URL generator functions
- [ ] T007 [P] Create src/lib/subscription.ts with validation and date calculation helpers
- [ ] T008 Update src/lib/supabase.ts to export typed Supabase client
- [ ] T009 Create src/hooks/useAuth.ts with admin role check (raw_user_meta_data.is_admin)
- [ ] T010 Update src/data/pricing.ts to reflect Pro plan at $8/month (was $10)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Pro Plan Purchase via Crypto (Priority: P1) 🎯 MVP

**Goal**: Users can upgrade to Pro by selecting blockchain, viewing payment address/QR, and submitting transaction hash

**Independent Test**: User clicks "Upgrade to Pro", selects Polygon, sees QR code, enters valid tx hash (0x...), submits successfully, sees "Payment pending verification" status on Dashboard

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create src/components/payment/ChainSelector.tsx for Ethereum/Polygon/BSC network selection
- [ ] T012 [P] [US1] Create src/components/payment/QRCodeDisplay.tsx with qrcode.react integration and wallet address display
- [ ] T013 [P] [US1] Create src/components/payment/TxHashInput.tsx with format validation (0x + 64 hex chars)
- [ ] T014 [US1] Create src/components/payment/PaymentModal.tsx integrating ChainSelector, QRCodeDisplay, TxHashInput
- [ ] T015 [US1] Create src/hooks/usePaymentSubmit.ts for submitting payment to Supabase payment_submissions table
- [ ] T016 [US1] Add "Upgrade to Pro" button in src/pages/Dashboard.tsx opening PaymentModal
- [ ] T017 [US1] Update src/pages/Dashboard.tsx to show payment pending status when user has pending submission

**Checkpoint**: User can complete entire payment flow from clicking upgrade to submitting tx hash. Payment stored in database with status="pending".

---

## Phase 4: User Story 2 - Admin Payment Verification (Priority: P1)

**Goal**: Admin can view pending payments, verify on blockchain explorers, approve/reject with notes

**Independent Test**: Admin logs in, navigates to /admin, sees pending payment from US1 test, clicks Etherscan/Polygonscan link, approves payment, user's subscription activates to Pro

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create src/components/admin/PaymentSubmissionRow.tsx displaying user email, chain, amount, tx hash with explorer link
- [ ] T019 [P] [US2] Create src/components/admin/VerificationModal.tsx with Approve/Reject buttons and notes textarea
- [ ] T020 [US2] Create src/hooks/usePaymentSubmissions.ts fetching pending payments with user email join
- [ ] T021 [US2] Create src/hooks/useVerifyPayment.ts for updating payment status and subscription activation
- [ ] T022 [US2] Create src/pages/Admin.tsx using PaymentSubmissionRow and VerificationModal components
- [ ] T023 [US2] Create src/components/admin/AdminRoute.tsx guard component checking user.user_metadata.is_admin
- [ ] T024 [US2] Add /admin route in src/App.tsx wrapped with AdminRoute guard
- [ ] T025 [US2] Verify database trigger activates subscription on payment approval (test via Supabase Dashboard)

**Checkpoint**: Admin can verify payments end-to-end. Approved payments activate Pro subscriptions automatically via database trigger.

---

## Phase 5: User Story 3 - Subscription Status Management (Priority: P2)

**Goal**: Users see current plan, expiration date, days remaining, payment history, renewal options

**Independent Test**: User with active Pro subscription (from US2 approval) views Dashboard, sees "Pro Plan - 29 days remaining", views payment history table showing approved transaction

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create src/components/subscription/SubscriptionStatus.tsx showing plan, start/end dates, days remaining
- [ ] T027 [P] [US3] Create src/components/subscription/RenewalReminder.tsx displaying warnings when <7 days remain
- [ ] T028 [P] [US3] Create src/components/subscription/PaymentHistory.tsx table of past payment_submissions for user
- [ ] T029 [US3] Create src/hooks/useSubscription.ts fetching active subscription with grace period logic (end_date + 48h)
- [ ] T030 [US3] Create src/hooks/usePaymentHistory.ts fetching user's payment_submissions ordered by submitted_at DESC
- [ ] T031 [US3] Update src/pages/Dashboard.tsx to integrate SubscriptionStatus, RenewalReminder, PaymentHistory components
- [ ] T032 [US3] Add expired subscription check in Dashboard redirecting to upgrade modal if expired (outside grace period)

**Checkpoint**: Users have complete visibility into subscription lifecycle. Renewal flow reuses US1 PaymentModal component.

---

## Phase 6: User Story 4 - Multi-Chain Payment Options (Priority: P2)

**Goal**: Users can switch between Ethereum, Polygon, BSC to optimize gas fees

**Independent Test**: User opens PaymentModal, switches from Ethereum to Polygon, sees different wallet address and Polygonscan link, switches to BSC, sees BSCScan link, all QR codes update correctly

### Implementation for User Story 4

- [ ] T033 [US4] Update src/components/payment/ChainSelector.tsx to show estimated gas fees per network
- [ ] T034 [US4] Update src/components/payment/PaymentModal.tsx to dynamically update address/QR/explorer when chain changes
- [ ] T035 [US4] Add network-specific warnings in PaymentModal about sending to correct chain. Display prominent warning: "⚠️ Warning: Sending funds to the wrong network will result in permanent loss. Double-check you selected [Ethereum/Polygon/BSC] in your wallet before sending payment." (prevent wrong-chain loss per FR-018)
- [ ] T036 [US4] Add mobile wallet deep-linking support when user taps QR code (opens wallet with pre-filled payment)
- [ ] T037 [US4] Update src/components/admin/PaymentSubmissionRow.tsx to show chain-specific explorer icons/badges
- [ ] T038 [US4] Verify all three blockchains (ETH, Polygon, BSC) work end-to-end with test transactions

**Checkpoint**: All three blockchain networks fully functional. Users can choose lowest-cost option.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories

- [ ] T039 [P] Add responsive design testing for mobile QR code scanning (US1, US4)
- [ ] T040 [P] Add loading states and error boundaries to all payment/admin components
- [ ] T041 [P] Add Vercel Analytics tracking for payment modal opens and submissions (privacy-compliant)
- [ ] T042 [P] Update README.md with crypto payment setup instructions from quickstart.md
- [ ] T043 Verify all RLS policies prevent unauthorized access (test with non-admin and logged-out users)
- [ ] T044 Configure and test email notifications for approved/rejected payments (Supabase Auth email templates). Example approved: "Your Pro subscription payment has been verified. Welcome to Pro!" Example rejected: "Payment verification failed: [reason]. Please resubmit with correct transaction." (per FR-014)
- [ ] T045 Add audit log view in Admin panel showing all verification actions with timestamps
- [ ] T046 Performance optimization: lazy-load Admin route and PaymentModal
- [ ] T047 Add wrong-chain submission tracking to validate SC-005 (log attempts where selected chain doesn't match tx hash chain)
- [ ] T048 Run end-to-end test suite if formal tests exist (npm test or vitest)
- [ ] T049 Run full quickstart.md validation (10-step manual test flow)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are P1 (MVP) - should be done first in sequence
  - US3 and US4 are P2 - can be done after MVP or in parallel
- **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Independent but logically follows US1 (needs test payment)
- **User Story 3 (P2)**: Can start after Foundational - Displays data created by US1/US2 but independently testable
- **User Story 4 (P2)**: Can start after Foundational - Enhances US1 but independently testable

### Within Each User Story

- Component tasks marked [P] can run in parallel (different files)
- Hooks before pages (pages import hooks)
- Integration tasks after component creation
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 Setup**: T001-T005 can all run in parallel (independent)
- **Phase 2 Foundational**: T006-T010 can all run in parallel (different files)
- **Phase 3 US1**: T011, T012, T013 can run in parallel (different component files)
- **Phase 4 US2**: T018, T019 can run in parallel (different component files)
- **Phase 5 US3**: T026, T027, T028 can run in parallel (different component files)
- **Phase 7 Polish**: T039, T040, T041, T042 can run in parallel (different concerns)

**Team Strategy**: After Foundational phase, US1 and US2 can be split across two developers, then US3 and US4 across two developers.

---

## Parallel Example: User Story 1

```bash
# Launch all US1 components together:
Task: "Create src/components/payment/ChainSelector.tsx"
Task: "Create src/components/payment/QRCodeDisplay.tsx"
Task: "Create src/components/payment/TxHashInput.tsx"

# Then integrate:
Task: "Create src/components/payment/PaymentModal.tsx" (integrates above)
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup (database + dependencies)
2. Complete Phase 2: Foundational (utilities + hooks)
3. Complete Phase 3: User Story 1 (payment flow)
4. Complete Phase 4: User Story 2 (admin verification)
5. **STOP and VALIDATE**: Test full payment flow end-to-end
6. Deploy to production with just Pro plan purchase functionality

**MVP Scope**: Users can upgrade to Pro with crypto, admins can verify payments. This is the core revenue-generating functionality.

### Incremental Delivery

1. MVP (US1 + US2) → Deploy → Validate with real users
2. Add US3 (Subscription Status) → Deploy → Improve user transparency
3. Add US4 (Multi-Chain Options) → Deploy → Reduce payment friction
4. Polish phase → Deploy → Production-ready

Each phase adds independent value without breaking previous functionality.

### Parallel Team Strategy

With 2 developers:

1. Both complete Setup + Foundational together (T001-T010)
2. Developer A: US1 payment flow (T011-T017)
3. Developer B: US2 admin panel (T018-T025)
4. Integration testing together
5. Developer A: US3, Developer B: US4 (parallel)
6. Both: Polish phase

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Database trigger (activate_subscription_on_payment_approval) handles subscription activation automatically
- Email notifications configured via Supabase Auth email templates + PostgreSQL trigger
- Wallet addresses must be configured in T005 before any payments can be accepted
- Admin role must be granted in T003 before Admin panel is accessible
