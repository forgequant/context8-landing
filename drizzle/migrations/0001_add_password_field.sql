-- Add password field to user table for email/password authentication
-- Also add unique constraint on email

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "password" text;

-- Make email unique if not already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_email_unique'
  ) THEN
    ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE ("email");
  END IF;
END $$;
