# Feature Specification: Crypto Subscription Payment System

**Feature Branch**: `003-crypto-subscription-payments`
**Created**: 2025-10-27
**Status**: Draft
**Input**: User description: "Manual crypto subscription payment system with stablecoins (USDT/USDC) on multiple chains (Ethereum/Polygon/BSC), admin verification workflow, and one-time payment model for Pro plan upgrades"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pro Plan Purchase via Crypto (Priority: P1)

A free-tier user wants to upgrade to Pro plan ($8/month) by paying with cryptocurrency. They select their preferred blockchain network, send USDT or USDC to the displayed payment address, submit their transaction hash, and wait for admin verification to activate their subscription.

**Why this priority**: Core monetization flow that directly generates revenue. Without this, no users can upgrade to paid plans.

**Independent Test**: User can complete entire payment flow from clicking "Upgrade to Pro" to receiving confirmation that payment was submitted. Value delivered: user has clear payment instructions and knows their payment is being processed.

**Acceptance Scenarios**:

1. **Given** user is logged in with free plan, **When** they click "Upgrade to Pro", **Then** they see payment modal with blockchain selection options (Ethereum, Polygon, BSC)
2. **Given** user selects Polygon network, **When** modal displays payment information, **Then** they see wallet address, QR code, exact amount (8 USDC), and transaction hash input field
3. **Given** user sent 8 USDC to payment address, **When** they paste valid transaction hash and submit, **Then** system confirms submission and shows "Payment pending verification" status
4. **Given** user has pending payment, **When** they view Dashboard, **Then** they see payment status as "Pending" with estimated verification time
5. **Given** admin verifies transaction, **When** verification is approved, **Then** user's plan automatically updates to Pro and they receive access to Pro features

---

### User Story 2 - Admin Payment Verification (Priority: P1)

An admin needs to verify pending crypto payments by checking blockchain explorers to confirm transaction validity (correct amount, correct address, confirmed on-chain), then approve or reject the payment to activate or deny user subscriptions.

**Why this priority**: Required for P1 to function - payments cannot be activated without verification process. This is the trust and security layer.

**Independent Test**: Admin can log into admin panel, see list of pending payments, click to verify on blockchain explorer, and approve/reject with notes. Value delivered: complete manual verification workflow prevents fraud.

**Acceptance Scenarios**:

1. **Given** admin is logged in, **When** they navigate to Admin Panel (/admin), **Then** they see list of all pending payment submissions with user email, amount, chain, tx hash, and submission timestamp
2. **Given** admin clicks "Verify" on a submission, **When** system opens blockchain explorer link, **Then** explorer shows transaction with correct recipient address and amount
3. **Given** admin confirms transaction is valid, **When** they click "Approve", **Then** user's subscription activates immediately and status changes to "Active"
4. **Given** admin finds transaction invalid, **When** they click "Reject" with reason, **Then** user receives notification and can resubmit with correct transaction
5. **Given** transaction has insufficient confirmations, **When** admin views it, **Then** system shows warning and suggests waiting for more confirmations

---

### User Story 3 - Subscription Status Management (Priority: P2)

Users need to view their current subscription status, see when it expires, check payment history, and understand what happens when subscription expires. They should be able to renew before expiration.

**Why this priority**: Important for user retention and transparency, but system can function without it initially (manual communication can substitute).

**Independent Test**: User can view complete subscription lifecycle information on Dashboard without making any changes. Value delivered: transparency and self-service information.

**Acceptance Scenarios**:

1. **Given** user has active Pro subscription, **When** they view Dashboard, **Then** they see plan name, start date, end date, days remaining, and "Renew" button
2. **Given** subscription is expiring in 7 days, **When** user logs in, **Then** they see prominent reminder to renew subscription
3. **Given** subscription expired, **When** user accesses Pro features, **Then** they are redirected to upgrade page with message explaining expiration
4. **Given** user has payment history, **When** they view Subscription tab, **Then** they see table of all past payments with dates, amounts, chains, and transaction hashes

---

### User Story 4 - Multi-Chain Payment Options (Priority: P2)

Users can choose between multiple blockchain networks (Ethereum, Polygon, BSC) when paying for subscriptions, allowing them to optimize for gas fees and use their preferred wallet/exchange.

**Why this priority**: Improves conversion rate by reducing payment friction, but single-chain support is sufficient for MVP launch.

**Independent Test**: User can select each blockchain option and see different payment addresses and relevant explorer links. Value delivered: flexibility to choose lowest-cost network.

**Acceptance Scenarios**:

1. **Given** user opens payment modal, **When** they see blockchain options, **Then** Ethereum, Polygon, and BSC are displayed with estimated gas fees
2. **Given** user selects BSC, **When** payment details load, **Then** BSC wallet address is shown with BSC-specific QR code and BSCScan explorer link
3. **Given** user switches from Ethereum to Polygon, **When** network changes, **Then** all payment details update (address, QR code, explorer) without closing modal
4. **Given** user on mobile, **When** they tap QR code, **Then** their wallet app opens with pre-filled payment details

---

### Edge Cases

- What happens when user submits duplicate transaction hash? System rejects with error message "Transaction already submitted"
- What happens when user submits invalid transaction hash format? System validates format before submission and shows inline error
- What happens when blockchain network is experiencing congestion? System shows warning about delayed confirmations and suggests alternative networks
- What happens when user's subscription expires while they have pending payment? Grace period of 48 hours to verify payment before access is revoked
- What happens when user sends wrong amount (e.g., 7 USDC instead of 8 USDC)? Admin can reject with note explaining shortfall, user can submit difference as new transaction
- What happens when user sends payment to wrong chain's address? Transaction is lost; system shows prominent warnings about network selection before payment
- What happens when admin account is compromised? All approval actions are logged with timestamps and admin ID for audit trail
- What happens when blockchain explorer API is down? Admin can manually verify on blockchain explorer website, system provides fallback explorer links

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support USDT and USDC stablecoin payments for Pro plan upgrades
- **FR-002**: System MUST provide unique payment addresses for Ethereum mainnet, Polygon, and Binance Smart Chain
- **FR-003**: System MUST display QR codes for each payment address to enable mobile wallet scanning
- **FR-004**: System MUST validate transaction hash format before allowing submission (64-character hexadecimal with 0x prefix)
- **FR-005**: System MUST prevent duplicate transaction hash submissions across all users
- **FR-006**: System MUST store payment submissions with user ID, plan type, transaction hash, blockchain network, amount, submission timestamp, and verification status
- **FR-007**: System MUST provide admin interface accessible only to users with admin role
- **FR-008**: Admin interface MUST display all pending payment submissions sorted by submission time (oldest first)
- **FR-009**: Admin interface MUST provide direct links to blockchain explorers (Etherscan, Polygonscan, BSCScan) for each transaction
- **FR-010**: Admin MUST be able to approve or reject payment submissions with optional notes
- **FR-011**: System MUST automatically activate Pro subscription when payment is approved, setting start date to approval timestamp
- **FR-012**: Pro subscription MUST be valid for exactly 30 days from activation
- **FR-013**: System MUST display subscription status on user Dashboard showing plan type, start date, end date, and renewal options
- **FR-014**: System MUST send email notification to user when payment is approved or rejected
- **FR-015**: System MUST log all admin approval/rejection actions with admin ID, timestamp, and action details for audit trail
- **FR-016**: System MUST restrict Pro features to users with active (non-expired) Pro subscriptions
- **FR-017**: System MUST allow users to submit new payment for renewal when subscription is active (extending current subscription by 30 days)
- **FR-018**: Payment modal MUST display network-specific warnings about sending to correct chain to prevent loss of funds

### Key Entities

- **Subscription**: Represents user's paid plan status with plan type (free/pro), start date, end date, status (active/expired/cancelled), and linked user account
- **Payment Submission**: Represents crypto payment attempt with transaction hash, blockchain network, stablecoin type (USDT/USDC), amount in USD, submission timestamp, verification status (pending/verified/rejected), verifying admin ID, and verification notes
- **Static Wallet Addresses**: Configuration of payment addresses per blockchain network, stored securely and displayed to users during checkout
- **Admin Action Log**: Audit trail of all payment verification actions with admin user, timestamp, action type (approve/reject), affected payment submission, and reason/notes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete payment submission (from clicking upgrade to submitting tx hash) in under 5 minutes
- **SC-002**: Admin can verify and approve/reject payment in under 3 minutes per transaction
- **SC-003**: System successfully prevents duplicate transaction submissions with 100% accuracy
- **SC-004**: 95% of valid payments are verified and approved within 24 hours of submission
- **SC-005**: Zero user funds lost due to wrong-chain transactions after implementing network warnings
- **SC-006**: Payment submission interface displays correctly on mobile devices (responsive design) with QR code scanning support
- **SC-007**: Admin panel loads and displays all pending payments in under 2 seconds
- **SC-008**: System maintains complete audit trail for all payment verifications (100% of actions logged)
- **SC-009**: Users clearly understand subscription status and expiration dates (measured by support ticket reduction)
- **SC-010**: Blockchain explorer integration works reliably with 99% uptime for transaction verification links

## Assumptions

- Static wallet addresses for each blockchain will be provided by project owner and kept secure
- Admin users will check admin panel regularly (at least once per 24 hours) to verify pending payments
- Stablecoin price remains at $1 USD (system uses fixed USDC/USDT amounts, not dynamic pricing)
- Users sending payments are familiar with basic crypto wallet operations and understand gas fees
- Blockchain explorers (Etherscan, Polygonscan, BSCScan) remain available and free to use for verification
- Email service is already configured in application for sending subscription notifications
- Pro plan pricing is fixed at $8/month and does not require dynamic pricing updates
- One-time payment model is acceptable (no recurring automated payments in MVP)
- Grace period for expired subscriptions with pending payments is 48 hours
- Supabase database is used for storing subscriptions and payment submissions with Row Level Security policies

## Out of Scope

- Automated blockchain transaction verification via on-chain APIs (manual admin verification only)
- Support for cryptocurrencies other than USDT and USDC stablecoins
- Support for blockchain networks beyond Ethereum, Polygon, and BSC
- Recurring automatic subscription payments (users must manually renew each month)
- Refund processing for rejected or disputed payments
- Dynamic pricing based on cryptocurrency market rates
- Multi-currency support (pricing only in USD)
- Integration with centralized payment gateways like Coinbase Commerce or NOWPayments
- Affiliate or referral codes for subscription discounts
- Tiered Pro plans (only single Pro plan at $8/month)
- Subscription pausing or freezing functionality
- Bulk payment verification tools for admins (one-by-one verification only)
- White-label or custom branded payment experience
