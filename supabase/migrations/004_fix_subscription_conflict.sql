-- Migration 004: Fix ON CONFLICT Error for Subscription Upsert
-- Issue: Payment approval fails because activate_subscription_on_payment_approval()
-- uses ON CONFLICT (user_id) WHERE status = 'active' but no matching unique index exists
--
-- Solution: Add partial unique index to enforce one active subscription per user

-- Create unique partial index for active subscriptions
-- This ensures each user can only have ONE active subscription at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_unique_active_user
ON subscriptions(user_id) WHERE status = 'active';

-- This index enables the ON CONFLICT clause in activate_subscription_on_payment_approval()
-- which uses: ON CONFLICT (user_id) WHERE status = 'active'
