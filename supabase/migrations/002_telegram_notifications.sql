-- Migration: Telegram Notifications for Admin
-- Triggers notification when new payment is submitted

-- Note: Requires http extension for making HTTP calls to Edge Functions
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Function to notify admin via Telegram when new payment arrives
CREATE OR REPLACE FUNCTION notify_admin_new_payment()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  webhook_secret TEXT;
  payload JSONB;
  user_email TEXT;
BEGIN
  -- Get user email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.user_id;

  -- Build payload
  payload := jsonb_build_object(
    'type', 'INSERT',
    'record', jsonb_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'user_email', COALESCE(user_email, 'Unknown'),
      'plan', NEW.plan,
      'chain', NEW.chain,
      'amount', NEW.amount,
      'tx_hash', NEW.tx_hash,
      'submitted_at', NEW.submitted_at
    )
  );

  -- Hardcoded Edge Function URL (project-specific)
  function_url := 'https://yfahpblxugjtbollpudv.supabase.co/functions/v1/telegram-notify-admin';

  -- Webhook secret - set this in Supabase Edge Functions environment variables
  -- We'll pass it from the function itself, so just use a placeholder here
  webhook_secret := 'internal-trigger';

  -- Call Edge Function asynchronously (don't block transaction)
  PERFORM extensions.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || webhook_secret
    ),
    body := payload
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Failed to send Telegram notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on payment_submissions
DROP TRIGGER IF EXISTS trigger_notify_admin_payment ON payment_submissions;
CREATE TRIGGER trigger_notify_admin_payment
AFTER INSERT ON payment_submissions
FOR EACH ROW
EXECUTE FUNCTION notify_admin_new_payment();

-- Comment
COMMENT ON FUNCTION notify_admin_new_payment() IS 'Sends Telegram notification to admin when new payment is submitted';
COMMENT ON TRIGGER trigger_notify_admin_payment ON payment_submissions IS 'Triggers Telegram notification on new payment submission';
