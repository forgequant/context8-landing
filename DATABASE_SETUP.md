# Database Setup Guide

## Aiven PostgreSQL Connection

### 1. Get your Aiven connection string

From your Aiven console, copy the PostgreSQL connection string. It should look like:

```
postgresql://username:password@hostname:port/database?sslmode=require
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Aiven database URL:

```env
DATABASE_URL="postgresql://your-aiven-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### 3. Generate NextAuth secret

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `.env.local`.

### 4. Run database migrations

Apply the schema to your Aiven database:

```bash
# Generate migration files (if schema changed)
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations manually
psql "$DATABASE_URL" < drizzle/migrations/0001_add_password_field.sql
```

### 5. Verify tables

Connect to your Aiven database and verify the tables:

```sql
\dt  -- List tables

-- Should see:
-- user
-- account
-- session
-- verificationToken
-- usage_metrics
```

### 6. Test locally

```bash
npm run dev
```

Visit http://localhost:3000/login and test:
- Email/password registration
- Email/password login
- Google OAuth (if configured)

## Deployment to Vercel

### 1. Add environment variables in Vercel

Go to your project settings → Environment Variables and add:

```
DATABASE_URL=your-aiven-connection-string
NEXTAUTH_URL=https://context8.markets
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
```

### 2. Deploy

```bash
git add .
git commit -m "feat: add email/password authentication with Aiven PostgreSQL"
git push origin main
vercel --prod
```

## Database Schema

### Users Table

```sql
CREATE TABLE "user" (
  "id" text PRIMARY KEY,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "emailVerified" timestamp,
  "image" text,
  "password" text  -- Hashed with bcrypt
);
```

### Authentication Flow

1. **Registration** (`POST /api/auth/register`)
   - Validates email/password
   - Checks for existing email
   - Hashes password with bcrypt (10 rounds)
   - Inserts user into database
   - Auto-logs in user

2. **Login** (NextAuth Credentials provider)
   - Validates email/password
   - Queries database for user
   - Compares password with bcrypt
   - Creates JWT session

3. **Google OAuth** (NextAuth Google provider)
   - Uses Drizzle adapter to store sessions
   - Creates user if doesn't exist
   - Links account to user

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Email uniqueness constraint
- ✅ SQL injection protection (Drizzle ORM)
- ✅ HTTPS required for Aiven connection
- ✅ JWT session tokens
- ✅ Password minimum length (8 characters)
- ✅ Error messages don't leak user existence

## Troubleshooting

### Connection refused

Make sure your IP is whitelisted in Aiven console.

### SSL errors

Ensure `?sslmode=require` is in your connection string.

### Migration errors

If tables already exist, you may need to manually add the password column:

```sql
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "password" text;
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE ("email");
```
