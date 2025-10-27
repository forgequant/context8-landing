# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: context8
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to you
5. Wait for project to be created (~2 minutes)

## 2. Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Configure Environment

Create `.env` file in `frontend-v2/`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Set Up Database Tables

Go to **SQL Editor** in Supabase dashboard and run:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create usage_metrics table
CREATE TABLE IF NOT EXISTS public.usage_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  response_time_ms INTEGER,
  status_code INTEGER,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on usage_metrics
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for usage_metrics
CREATE POLICY "Users can view their own metrics"
  ON public.usage_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
  ON public.usage_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_usage_metrics_user_id ON public.usage_metrics(user_id);
CREATE INDEX idx_usage_metrics_timestamp ON public.usage_metrics(timestamp);
```

## 5. Configure Google OAuth (Optional)

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google** provider
3. Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
4. Add authorized redirect URI:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
5. Paste Google Client ID and Secret in Supabase

## 6. Configure Email Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set **Site URL**: `http://localhost:5174`
5. Add redirect URLs:
   ```
   http://localhost:5174/**
   https://your-domain.com/**
   ```

## 7. Test Connection

Create a test file `frontend-v2/test-supabase.ts`:

```typescript
import { supabase } from './src/lib/supabase'

async function testConnection() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Connection failed:', error)
  } else {
    console.log('Connection successful!')
    console.log('Session:', data)
  }
}

testConnection()
```

Run: `npx tsx test-supabase.ts`

## 8. Usage in Code

### Sign Up with Email

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})
```

### Sign In with Email

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign In with Google

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:5174/auth/callback'
  }
})
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### Listen to Auth Changes

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

## 9. Security Best Practices

- ✅ Never commit `.env` file
- ✅ Use Row Level Security (RLS) policies
- ✅ Validate user input on frontend
- ✅ Use `anon` key only (never `service_role` key in frontend)
- ✅ Enable email confirmation for production
- ✅ Set up password requirements
- ✅ Add rate limiting

## 10. Production Deployment

1. Add production URL to **Site URL** in Supabase
2. Update redirect URLs
3. Enable email confirmation
4. Set up custom SMTP (optional)
5. Configure password recovery
6. Add MFA (optional)

## Troubleshooting

### "Invalid API key"
- Check `.env` file has correct keys
- Restart dev server after changing `.env`

### "User already registered"
- Check Supabase dashboard → Authentication → Users
- Delete test user or use different email

### "Email not confirmed"
- Check email inbox (including spam)
- Disable email confirmation in development
- Or use magic link instead

### CORS errors
- Add your domain to allowed origins in Supabase settings
