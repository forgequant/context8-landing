-- Migration: 006_daily_reports.sql
-- Feature: Daily Market Reports Storage
-- Date: 2025-12-18

-- ============================================================================
-- TABLE: daily_reports
-- Stores generated daily market reports for display on /reports/daily
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Report identification
  report_date DATE NOT NULL UNIQUE,

  -- Key metrics (displayed at top)
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Example: {
  --   "unique_creators": 249766,
  --   "unique_creators_change": -7.1,
  --   "market_sentiment": 82,
  --   "market_sentiment_change": 1.5,
  --   "defi_engagements": 53000000,
  --   "defi_engagements_change": -19,
  --   "ai_creators": null,
  --   "ai_creators_change": -9.7
  -- }

  -- Executive summary bullet points
  executive_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [
  --   {"direction": "down", "text": "Social activity cooled — unique creators down 7.1%"},
  --   {"direction": "up", "text": "Market sentiment remains bullish at 82%"}
  -- ]

  -- Active narratives/themes
  narratives JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [
  --   {"title": "Memecoins", "status": "hot", "description": "..."},
  --   {"title": "DeFi 2.0", "status": "cold", "description": "..."}
  -- ]

  -- Top movers table data
  top_movers JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [
  --   {"symbol": "BTC", "change_24h": 2.3, "change_7d": 5.1, "social": "High", "sentiment": 85, "comment": "..."},
  --   {"symbol": "ETH", "change_24h": -1.2, "change_7d": 3.2, "social": "Medium", "sentiment": 72, "comment": "..."}
  -- ]

  -- Top influencers/KOLs data
  influencers JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [
  --   {"name": "@cryptowizard", "followers": 125000, "engagement": 4.2, "sentiment": "bullish", "focus": ["BTC", "ETH"]}
  -- ]

  -- Risk indicators
  risks JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [
  --   {"level": "medium", "label": "Market volatility elevated"},
  --   {"level": "low", "label": "Exchange reserves stable"}
  -- ]

  -- Full raw data from LunarCrush API (for debugging/reprocessing)
  raw_data JSONB,

  -- Report metadata
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_daily_reports_date ON daily_reports(report_date DESC);
CREATE INDEX idx_daily_reports_status ON daily_reports(status) WHERE status = 'published';
CREATE INDEX idx_daily_reports_generated ON daily_reports(generated_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can read published reports (public page)
CREATE POLICY "Anyone can view published reports"
ON daily_reports FOR SELECT
USING (status = 'published');

-- Admins can view all reports
CREATE POLICY "Admins can view all reports"
ON daily_reports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
    AND raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Service role can manage all reports (for Edge Functions)
CREATE POLICY "Service can manage reports"
ON daily_reports FOR ALL
USING (auth.role() = 'service_role');

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Get latest published report
CREATE OR REPLACE FUNCTION get_latest_report()
RETURNS daily_reports AS $$
  SELECT *
  FROM daily_reports
  WHERE status = 'published'
  ORDER BY report_date DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function: Get report by date
CREATE OR REPLACE FUNCTION get_report_by_date(p_date DATE)
RETURNS daily_reports AS $$
  SELECT *
  FROM daily_reports
  WHERE report_date = p_date
    AND status = 'published';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function: Publish report
CREATE OR REPLACE FUNCTION publish_report(p_report_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE daily_reports
  SET
    status = 'published',
    published_at = NOW(),
    updated_at = NOW()
  WHERE id = p_report_id
    AND status = 'draft';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: Update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_daily_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_daily_reports_timestamp
BEFORE UPDATE ON daily_reports
FOR EACH ROW
EXECUTE FUNCTION update_daily_reports_updated_at();

-- ============================================================================
-- SAMPLE DATA (for testing - remove in production)
-- ============================================================================

-- Insert a sample report (optional, can be removed)
-- INSERT INTO daily_reports (
--   report_date,
--   metrics,
--   executive_summary,
--   narratives,
--   top_movers,
--   risks,
--   status
-- ) VALUES (
--   CURRENT_DATE,
--   '{"unique_creators": 249766, "market_sentiment": 82, "defi_engagements": 53000000}'::jsonb,
--   '[{"direction": "down", "text": "Social activity cooled"}]'::jsonb,
--   '[{"title": "Memecoins", "status": "hot"}]'::jsonb,
--   '[{"symbol": "BTC", "change_24h": 2.3}]'::jsonb,
--   '[{"level": "medium", "label": "Volatility elevated"}]'::jsonb,
--   'draft'
-- );
