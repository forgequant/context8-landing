-- Migration: 005_api_keys_and_usage.sql
-- Feature: API Keys and Usage Tracking for Context8 MCP
-- Date: 2025-12-02

-- ============================================================================
-- TABLE: api_keys
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,  -- SHA-256 hash of the API key
  key_prefix TEXT NOT NULL,       -- First 8 chars for identification (ctx8_xxx)
  name TEXT DEFAULT 'Default',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash) WHERE is_active = true;
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);

-- ============================================================================
-- TABLE: api_usage
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  request_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique constraint for daily aggregation per user/endpoint
  CONSTRAINT unique_daily_usage UNIQUE (user_id, endpoint, request_date)
);

-- Indexes
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_request_date ON api_usage(request_date);
CREATE INDEX idx_api_usage_user_date ON api_usage(user_id, request_date);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- API Keys policies
CREATE POLICY "Users can view own api_keys"
ON api_keys FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api_keys"
ON api_keys FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own api_keys"
ON api_keys FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own api_keys"
ON api_keys FOR DELETE
USING (auth.uid() = user_id);

-- API Usage policies
CREATE POLICY "Users can view own api_usage"
ON api_usage FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert/update usage (for MCP server)
CREATE POLICY "Service can manage api_usage"
ON api_usage FOR ALL
USING (auth.role() = 'service_role');

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Get user's daily request count
CREATE OR REPLACE FUNCTION get_daily_usage(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(request_count), 0)
  INTO total_count
  FROM api_usage
  WHERE user_id = p_user_id
    AND request_date = CURRENT_DATE;

  RETURN total_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's rate limit based on subscription
CREATE OR REPLACE FUNCTION get_user_rate_limit(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  user_plan TEXT;
BEGIN
  SELECT COALESCE(s.plan, 'free')
  INTO user_plan
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status = 'active'
    AND s.end_date > NOW()
  ORDER BY s.end_date DESC
  LIMIT 1;

  -- Free: 2 req/day, Pro: 20 req/day
  IF user_plan = 'pro' THEN
    RETURN 20;
  ELSE
    RETURN 2;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user can make request
CREATE OR REPLACE FUNCTION can_make_request(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  max_requests INTEGER;
BEGIN
  current_usage := get_daily_usage(p_user_id);
  max_requests := get_user_rate_limit(p_user_id);

  RETURN current_usage < max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Increment usage (upsert)
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_api_key_id UUID,
  p_endpoint TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO api_usage (user_id, api_key_id, endpoint, request_date, request_count)
  VALUES (p_user_id, p_api_key_id, p_endpoint, CURRENT_DATE, 1)
  ON CONFLICT (user_id, endpoint, request_date)
  DO UPDATE SET
    request_count = api_usage.request_count + 1,
    api_key_id = COALESCE(p_api_key_id, api_usage.api_key_id);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Validate API key and get user info
CREATE OR REPLACE FUNCTION validate_api_key(p_key_hash TEXT)
RETURNS TABLE (
  user_id UUID,
  api_key_id UUID,
  plan TEXT,
  daily_limit INTEGER,
  daily_usage INTEGER,
  can_request BOOLEAN
) AS $$
DECLARE
  v_user_id UUID;
  v_api_key_id UUID;
  v_plan TEXT;
  v_limit INTEGER;
  v_usage INTEGER;
BEGIN
  -- Get API key info
  SELECT ak.user_id, ak.id
  INTO v_user_id, v_api_key_id
  FROM api_keys ak
  WHERE ak.key_hash = p_key_hash
    AND ak.is_active = true;

  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Update last_used_at
  UPDATE api_keys SET last_used_at = NOW() WHERE id = v_api_key_id;

  -- Get plan
  SELECT COALESCE(s.plan, 'free')
  INTO v_plan
  FROM subscriptions s
  WHERE s.user_id = v_user_id
    AND s.status = 'active'
    AND s.end_date > NOW()
  ORDER BY s.end_date DESC
  LIMIT 1;

  IF v_plan IS NULL THEN
    v_plan := 'free';
  END IF;

  -- Get limits
  v_limit := CASE WHEN v_plan = 'pro' THEN 20 ELSE 2 END;
  v_usage := get_daily_usage(v_user_id);

  RETURN QUERY SELECT
    v_user_id,
    v_api_key_id,
    v_plan,
    v_limit,
    v_usage,
    (v_usage < v_limit);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: Generate API key on Pro activation
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_api_key_on_pro_activation()
RETURNS TRIGGER AS $$
DECLARE
  existing_key_count INTEGER;
BEGIN
  -- Only trigger when subscription becomes active with pro plan
  IF NEW.status = 'active' AND NEW.plan = 'pro' THEN
    -- Check if user already has an API key
    SELECT COUNT(*) INTO existing_key_count
    FROM api_keys
    WHERE user_id = NEW.user_id AND is_active = true;

    -- If no active key exists, we'll need to generate one
    -- Note: The actual key generation happens in the application layer
    -- This trigger just ensures the record exists with a placeholder
    IF existing_key_count = 0 THEN
      -- Insert a placeholder that will be updated by the application
      -- The application will generate the actual key and update key_hash
      INSERT INTO api_keys (user_id, key_hash, key_prefix, name)
      VALUES (
        NEW.user_id,
        'pending_' || encode(gen_random_bytes(16), 'hex'),
        'ctx8_...',
        'Auto-generated Pro key'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_generate_api_key_on_pro
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW
WHEN (NEW.status = 'active' AND NEW.plan = 'pro')
EXECUTE FUNCTION generate_api_key_on_pro_activation();
