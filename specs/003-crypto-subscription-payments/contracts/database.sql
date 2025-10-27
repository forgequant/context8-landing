-- Migration: 001_crypto_subscriptions.sql
-- Feature: Crypto Subscription Payment System
-- Date: 2025-10-27

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: subscriptions
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')),
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date) WHERE status = 'active';

-- ============================================================================
-- TABLE: payment_submissions
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')),
  tx_hash TEXT NOT NULL UNIQUE,
  chain TEXT NOT NULL CHECK (chain IN ('ethereum', 'polygon', 'bsc')),
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verification_notes TEXT
);

-- Indexes
CREATE INDEX idx_payment_submissions_user_id ON payment_submissions(user_id);
CREATE INDEX idx_payment_submissions_status ON payment_submissions(status);
CREATE INDEX idx_payment_submissions_submitted_at ON payment_submissions(submitted_at DESC);
CREATE UNIQUE INDEX idx_payment_submissions_tx_hash ON payment_submissions(tx_hash);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
ON subscriptions FOR SELECT
USING (
  (SELECT (raw_user_meta_data->>'is_admin')::boolean
   FROM auth.users
   WHERE id = auth.uid()) = true
);

-- Payment submissions policies
CREATE POLICY "Users can insert own payment submissions"
ON payment_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can view own payment submissions"
ON payment_submissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payment submissions"
ON payment_submissions FOR SELECT
USING (
  (SELECT (raw_user_meta_data->>'is_admin')::boolean
   FROM auth.users
   WHERE id = auth.uid()) = true
);

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

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Activate subscription on payment approval
CREATE OR REPLACE FUNCTION activate_subscription_on_payment_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'verified' AND OLD.status = 'pending' THEN
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

-- Function: Notify on payment status change
CREATE OR REPLACE FUNCTION notify_user_on_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
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

-- Function: Get pending payments with user emails (for admin panel)
CREATE OR REPLACE FUNCTION get_pending_payments_with_emails()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  plan TEXT,
  tx_hash TEXT,
  chain TEXT,
  amount NUMERIC,
  status TEXT,
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  verification_notes TEXT,
  user_email TEXT
) AS $$
BEGIN
  -- Check if user is admin
  IF NOT (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE auth.users.id = auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    ps.id,
    ps.user_id,
    ps.plan,
    ps.tx_hash,
    ps.chain,
    ps.amount,
    ps.status,
    ps.submitted_at,
    ps.verified_at,
    ps.verified_by,
    ps.verification_notes,
    u.email::TEXT as user_email
  FROM payment_submissions ps
  LEFT JOIN auth.users u ON ps.user_id = u.id
  WHERE ps.status = 'pending'
  ORDER BY ps.submitted_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
