# Data Model: Crypto Subscription Payment System

**Feature**: 003-crypto-subscription-payments
**Phase**: 1 - Design & Contracts
**Date**: 2025-10-27

## Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase managed)
│─────────────────│
│ id (uuid) PK    │
│ email           │
│ user_metadata   │ ← Contains is_admin flag
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────────────┐
│   subscriptions         │
│─────────────────────────│
│ id (uuid) PK            │
│ user_id (uuid) FK       │──┐
│ plan (text)             │  │
│ status (text)           │  │
│ start_date (timestamptz)│  │
│ end_date (timestamptz)  │  │
│ created_at (timestamptz)│  │
└─────────────────────────┘  │
                             │
                             │ Referenced by
                             │
┌────────────────────────────▼─────┐
│   payment_submissions             │
│──────────────────────────────────│
│ id (uuid) PK                      │
│ user_id (uuid) FK                 │
│ plan (text)                       │
│ tx_hash (text) UNIQUE             │
│ chain (text)                      │
│ amount (numeric)                  │
│ status (text)                     │
│ submitted_at (timestamptz)        │
│ verified_at (timestamptz)         │
│ verified_by (uuid) FK → users     │
│ verification_notes (text)         │
└───────────────────────────────────┘
```

## Entities

### 1. `subscriptions`

**Purpose**: Stores active and historical user subscription records

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique subscription identifier |
| `user_id` | uuid | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | Owner of subscription |
| `plan` | text | NOT NULL, CHECK (plan IN ('free', 'pro')) | Plan type |
| `status` | text | NOT NULL, CHECK (status IN ('active', 'expired', 'cancelled')) | Current status |
| `start_date` | timestamptz | NOT NULL | Subscription activation date |
| `end_date` | timestamptz | NOT NULL | Expiration date (30 days from start for pro) |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | Record creation timestamp |

**Indexes**:
```sql
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date) WHERE status = 'active';
```

**Validation Rules**:
- `plan = 'pro'` → `end_date` must be exactly 30 days after `start_date`
- `plan = 'free'` → `end_date` is NULL or far future (9999-12-31)
- Only one `active` subscription per `user_id` at a time

**State Transitions**:
```
                    ┌─────────────┐
                    │   pending   │ (not in table, just payment_submissions)
                    └──────┬──────┘
                           │ admin approves payment
                           ▼
                    ┌─────────────┐
              ┌─────│   active    │
              │     └──────┬──────┘
              │            │ end_date passes
              │            ▼
              │     ┌─────────────┐
              │     │   expired   │
              │     └──────┬──────┘
              │            │ user cancels or renews
              └────────────▼
                    ┌─────────────┐
                    │  cancelled  │
                    └─────────────┘
```

### 2. `payment_submissions`

**Purpose**: Records all crypto payment attempts, pending and processed

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique submission ID |
| `user_id` | uuid | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | User who submitted payment |
| `plan` | text | NOT NULL, CHECK (plan IN ('free', 'pro')) | Intended subscription plan |
| `tx_hash` | text | NOT NULL, UNIQUE | Blockchain transaction hash |
| `chain` | text | NOT NULL, CHECK (chain IN ('ethereum', 'polygon', 'bsc')) | Blockchain network |
| `amount` | numeric(10,2) | NOT NULL | Amount in USD (e.g., 8.00) |
| `status` | text | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending', 'verified', 'rejected')) | Verification status |
| `submitted_at` | timestamptz | NOT NULL, DEFAULT now() | User submission time |
| `verified_at` | timestamptz | NULL | Admin verification time |
| `verified_by` | uuid | NULL, REFERENCES auth.users(id) | Admin who verified |
| `verification_notes` | text | NULL | Admin's rejection reason or notes |

**Indexes**:
```sql
CREATE INDEX idx_payment_submissions_user_id ON payment_submissions(user_id);
CREATE INDEX idx_payment_submissions_status ON payment_submissions(status);
CREATE INDEX idx_payment_submissions_submitted_at ON payment_submissions(submitted_at DESC);
CREATE UNIQUE INDEX idx_payment_submissions_tx_hash ON payment_submissions(tx_hash);
```

**Validation Rules**:
- `tx_hash` must match pattern `^0x[a-fA-F0-9]{64}$` (enforced client-side + CHECK constraint)
- `status = 'verified'` → `verified_at` and `verified_by` must NOT be NULL
- `status = 'rejected'` → `verification_notes` should NOT be NULL
- `amount` matches plan pricing (8.00 for 'pro')

**State Transitions**:
```
    ┌─────────────┐
    │   pending   │ (initial state on user submission)
    └──────┬──────┘
           │
      ┌────┴────┐
      │         │
      ▼         ▼
┌───────────┐ ┌───────────┐
│ verified  │ │ rejected  │ (admin decision)
└───────────┘ └───────────┘
```

### 3. `auth.users` (Supabase managed)

**Purpose**: User authentication and profile (managed by Supabase Auth)

**Relevant Fields** (read-only from Supabase):
- `id` (uuid): User unique identifier
- `email` (text): User email address
- `raw_user_meta_data` (jsonb): Contains `is_admin` flag for admin users

**Admin Check**:
```sql
SELECT (raw_user_meta_data->>'is_admin')::boolean AS is_admin
FROM auth.users
WHERE id = '<user_id>';
```

## Row Level Security (RLS) Policies

### `subscriptions` table

**Policy 1: Users can view their own subscriptions**
```sql
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);
```

**Policy 2: Admins can view all subscriptions**
```sql
CREATE POLICY "Admins can view all subscriptions"
ON subscriptions FOR SELECT
USING (
  (SELECT (raw_user_meta_data->>'is_admin')::boolean
   FROM auth.users
   WHERE id = auth.uid()) = true
);
```

**Policy 3: System can insert subscriptions** (via PostgreSQL function only)
```sql
CREATE POLICY "System can insert subscriptions"
ON subscriptions FOR INSERT
WITH CHECK (false); -- No direct inserts, only via trigger/function
```

### `payment_submissions` table

**Policy 1: Users can insert their own payment submissions**
```sql
CREATE POLICY "Users can insert own payment submissions"
ON payment_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');
```

**Policy 2: Users can view their own payment submissions**
```sql
CREATE POLICY "Users can view own payment submissions"
ON payment_submissions FOR SELECT
USING (auth.uid() = user_id);
```

**Policy 3: Admins can view all payment submissions**
```sql
CREATE POLICY "Admins can view all payment submissions"
ON payment_submissions FOR SELECT
USING (
  (SELECT (raw_user_meta_data->>'is_admin')::boolean
   FROM auth.users
   WHERE id = auth.uid()) = true
);
```

**Policy 4: Admins can update payment submissions** (verify/reject only)
```sql
CREATE POLICY "Admins can update payment submissions"
ON payment_submissions FOR UPDATE
USING (
  (SELECT (raw_user_meta_data->>'is_admin')::boolean
   FROM auth.users
   WHERE id = auth.uid()) = true
)
WITH CHECK (
  verified_by = auth.uid() AND
  status IN ('verified', 'rejected') AND
  verified_at IS NOT NULL
);
```

## Database Functions & Triggers

### Function: Activate Subscription on Payment Approval

```sql
CREATE OR REPLACE FUNCTION activate_subscription_on_payment_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'verified' AND OLD.status = 'pending' THEN
    -- Insert or update subscription
    INSERT INTO subscriptions (user_id, plan, status, start_date, end_date)
    VALUES (
      NEW.user_id,
      NEW.plan,
      'active',
      NOW(),
      NOW() + INTERVAL '30 days'
    )
    ON CONFLICT (user_id) WHERE status = 'active'
    DO UPDATE SET
      plan = EXCLUDED.plan,
      end_date = GREATEST(subscriptions.end_date, NOW()) + INTERVAL '30 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_activate_subscription
AFTER UPDATE ON payment_submissions
FOR EACH ROW
WHEN (NEW.status = 'verified' AND OLD.status = 'pending')
EXECUTE FUNCTION activate_subscription_on_payment_approval();
```

**Logic**:
- On payment approval, creates new subscription or extends existing one
- If user has active subscription, extends it by 30 more days (renewal)
- Uses `SECURITY DEFINER` to bypass RLS for system operations

### Function: Notify User on Payment Status Change

```sql
CREATE OR REPLACE FUNCTION notify_user_on_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    -- Trigger Supabase email (implementation via Supabase webhooks/functions)
    PERFORM pg_notify(
      'payment_status_changed',
      json_build_object(
        'user_id', NEW.user_id,
        'status', NEW.status,
        'notes', NEW.verification_notes
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_payment_status
AFTER UPDATE ON payment_submissions
FOR EACH ROW
WHEN (NEW.status != OLD.status)
EXECUTE FUNCTION notify_user_on_payment_status();
```

## Data Integrity Constraints

### Uniqueness
- ✅ `payment_submissions.tx_hash` is UNIQUE (prevents duplicate submissions)
- ✅ `subscriptions.user_id` + `status='active'` via partial unique index

### Referential Integrity
- ✅ `subscriptions.user_id` → `auth.users.id` (CASCADE DELETE)
- ✅ `payment_submissions.user_id` → `auth.users.id` (CASCADE DELETE)
- ✅ `payment_submissions.verified_by` → `auth.users.id` (SET NULL on delete)

### Check Constraints
- ✅ `subscriptions.plan` IN ('free', 'pro')
- ✅ `subscriptions.status` IN ('active', 'expired', 'cancelled')
- ✅ `payment_submissions.plan` IN ('free', 'pro')
- ✅ `payment_submissions.chain` IN ('ethereum', 'polygon', 'bsc')
- ✅ `payment_submissions.status` IN ('pending', 'verified', 'rejected')
- ✅ `payment_submissions.amount` > 0

## Sample Queries

### Get user's active subscription
```sql
SELECT *
FROM subscriptions
WHERE user_id = $1
  AND status = 'active'
  AND end_date > NOW()
LIMIT 1;
```

### Get pending payment submissions for admin
```sql
SELECT
  ps.*,
  u.email AS user_email
FROM payment_submissions ps
JOIN auth.users u ON ps.user_id = u.id
WHERE ps.status = 'pending'
ORDER BY ps.submitted_at ASC;
```

### Check if user has Pro access (including grace period)
```sql
SELECT EXISTS (
  SELECT 1
  FROM subscriptions
  WHERE user_id = $1
    AND plan = 'pro'
    AND status = 'active'
    AND end_date + INTERVAL '48 hours' > NOW()
) AS has_pro_access;
```

### Get user's payment history
```sql
SELECT *
FROM payment_submissions
WHERE user_id = $1
ORDER BY submitted_at DESC;
```

## Migration Strategy

**File**: `supabase/migrations/001_crypto_subscriptions.sql`

**Execution Order**:
1. Create tables with constraints
2. Create indexes
3. Enable RLS on both tables
4. Create RLS policies
5. Create functions and triggers
6. Insert default data (if any)

**Rollback Plan**:
```sql
DROP TRIGGER IF EXISTS trigger_notify_payment_status ON payment_submissions;
DROP TRIGGER IF EXISTS trigger_activate_subscription ON payment_submissions;
DROP FUNCTION IF EXISTS notify_user_on_payment_status();
DROP FUNCTION IF EXISTS activate_subscription_on_payment_approval();
DROP TABLE IF EXISTS payment_submissions;
DROP TABLE IF EXISTS subscriptions;
```
