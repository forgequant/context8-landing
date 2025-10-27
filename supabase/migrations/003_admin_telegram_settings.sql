-- Migration: Admin Telegram Settings
-- Stores admin's Telegram chat_id for notifications

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert telegram_chat_id placeholder
INSERT INTO admin_settings (key, value)
VALUES ('telegram_chat_id', '')
ON CONFLICT (key) DO NOTHING;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);

-- RLS policies (only service role can access)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Service role can manage admin settings" ON admin_settings;
CREATE POLICY "Service role can manage admin settings"
ON admin_settings
FOR ALL
USING (auth.uid() IS NOT NULL AND (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true);

-- Comment
COMMENT ON TABLE admin_settings IS 'Stores admin configuration including Telegram chat_id for notifications';
