-- Initial database setup for Context8 Landing
-- Creates all tables for NextAuth + custom usage metrics

-- Users table - stores all user accounts
CREATE TABLE IF NOT EXISTS "user" (
  "id" text PRIMARY KEY,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "emailVerified" timestamp,
  "image" text,
  "password" text
);

-- Accounts table - stores OAuth provider accounts (Google, GitHub, etc.)
CREATE TABLE IF NOT EXISTS "account" (
  "userId" text NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  PRIMARY KEY ("provider", "providerAccountId"),
  CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Sessions table - stores active user sessions
CREATE TABLE IF NOT EXISTS "session" (
  "sessionToken" text PRIMARY KEY,
  "userId" text NOT NULL,
  "expires" timestamp NOT NULL,
  CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Verification tokens table - for email verification
CREATE TABLE IF NOT EXISTS "verificationToken" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- Usage metrics table - tracks API usage per user
CREATE TABLE IF NOT EXISTS "usage_metrics" (
  "id" text PRIMARY KEY,
  "userId" text NOT NULL,
  "endpoint" text NOT NULL,
  "timestamp" timestamp NOT NULL DEFAULT NOW(),
  "responseTimeMs" integer,
  "statusCode" integer,
  "ipAddress" text,
  CONSTRAINT "usage_metrics_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId");
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "usage_metrics_userId_idx" ON "usage_metrics"("userId");
CREATE INDEX IF NOT EXISTS "usage_metrics_timestamp_idx" ON "usage_metrics"("timestamp");

-- Verify tables were created
DO $$
BEGIN
  RAISE NOTICE 'Tables created successfully!';
  RAISE NOTICE 'Run \dt to see all tables';
END $$;
