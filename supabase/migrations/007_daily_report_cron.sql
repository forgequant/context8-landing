-- Migration: 007_daily_report_cron.sql
-- Feature: Scheduled Daily Report Generation
-- Date: 2025-12-18

-- ============================================================================
-- SETUP INSTRUCTIONS
-- ============================================================================
--
-- 1. Enable extensions in Supabase Dashboard:
--    Database → Extensions → Enable "pg_cron" and "pg_net"
--
-- 2. Set the project URL in database settings:
--    Run this in SQL Editor (replace with your actual project URL):
--
--    ALTER DATABASE postgres SET app.settings.supabase_url = 'https://YOUR-PROJECT-REF.supabase.co';
--
-- 3. Set the webhook secret:
--    ALTER DATABASE postgres SET app.settings.webhook_secret = 'YOUR_WEBHOOK_SECRET';
--
-- 4. Run this migration
--
-- 5. Verify jobs are scheduled:
--    SELECT * FROM cron.job;
--
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTION: Call Edge Function via pg_net
-- ============================================================================

CREATE OR REPLACE FUNCTION call_edge_function(
  function_name TEXT,
  payload JSONB DEFAULT '{}'::jsonb
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  project_url TEXT;
  webhook_secret TEXT;
  request_id BIGINT;
BEGIN
  -- Get settings
  project_url := current_setting('app.settings.supabase_url', true);
  webhook_secret := current_setting('app.settings.webhook_secret', true);

  -- Validate configuration
  IF project_url IS NULL OR project_url = '' THEN
    RAISE EXCEPTION 'app.settings.supabase_url is not configured. Run: ALTER DATABASE postgres SET app.settings.supabase_url = ''https://your-project.supabase.co'';';
  END IF;

  -- Make HTTP POST request to Edge Function
  SELECT net.http_post(
    url := project_url || '/functions/v1/' || function_name,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(webhook_secret, 'internal-trigger')
    ),
    body := payload
  ) INTO request_id;

  RETURN request_id;
END;
$$;

-- ============================================================================
-- CRON JOB: Generate Daily Report
-- ============================================================================

-- Schedule: Every day at 06:00 UTC (morning report)
-- This gives time for overnight trading data to be aggregated

-- Remove existing job if it exists (for idempotency)
DO $$
BEGIN
  PERFORM cron.unschedule('generate-daily-report');
EXCEPTION WHEN OTHERS THEN
  -- Job doesn't exist, ignore
END;
$$;

-- Create the scheduled job
SELECT cron.schedule(
  'generate-daily-report',           -- job name
  '0 6 * * *',                       -- cron expression: 06:00 UTC daily
  $$SELECT call_edge_function('generate-daily-report', '{}'::jsonb);$$
);

-- ============================================================================
-- CRON JOB: Send Daily Report (with auto-publish)
-- ============================================================================

-- Schedule: Every day at 06:30 UTC (30 min after generation)
-- This gives time for the report to be generated

-- Remove existing job if it exists
DO $$
BEGIN
  PERFORM cron.unschedule('send-daily-report');
EXCEPTION WHEN OTHERS THEN
  -- Job doesn't exist, ignore
END;
$$;

-- Create the scheduled job
SELECT cron.schedule(
  'send-daily-report',               -- job name
  '30 6 * * *',                      -- cron expression: 06:30 UTC daily
  $$SELECT call_edge_function('send-daily-report', '{"auto_publish": true}'::jsonb);$$
);

-- ============================================================================
-- ALTERNATIVE: Direct SQL-based report generation trigger
-- ============================================================================

-- If Edge Functions are not available, you can use a simpler approach
-- that just marks reports for processing

CREATE OR REPLACE FUNCTION trigger_daily_report_generation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today DATE := CURRENT_DATE;
  existing_report_id UUID;
BEGIN
  -- Check if today's report already exists
  SELECT id INTO existing_report_id
  FROM daily_reports
  WHERE report_date = today;

  IF existing_report_id IS NOT NULL THEN
    RAISE NOTICE 'Report for % already exists: %', today, existing_report_id;
    RETURN;
  END IF;

  -- Insert a placeholder report that will be populated by Edge Function
  INSERT INTO daily_reports (
    report_date,
    metrics,
    executive_summary,
    narratives,
    top_movers,
    influencers,
    risks,
    status
  ) VALUES (
    today,
    '{}'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    'draft'
  );

  RAISE NOTICE 'Created placeholder report for %', today;
END;
$$;

-- ============================================================================
-- MONITORING: View scheduled jobs
-- ============================================================================

-- Query to check cron job status:
-- SELECT * FROM cron.job;

-- Query to check recent job runs:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION call_edge_function IS
  'Helper function to call Supabase Edge Functions from pg_cron jobs';

COMMENT ON FUNCTION trigger_daily_report_generation IS
  'Creates a placeholder daily report entry if one does not exist for today';
