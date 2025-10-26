# Google OAuth Setup Guide

## 1. Create Google OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen
6. Create **Web application** credentials

## 2. Configure Authorized URLs

**Authorized JavaScript origins:**
```
http://localhost:5173
https://your-domain.com
```

**Authorized redirect URIs:**
```
http://localhost:5173/auth/callback
https://your-domain.com/auth/callback
```

## 3. Get Credentials

After creation, you'll receive:
- **Client ID**: `YOUR_CLIENT_ID.apps.googleusercontent.com`
- **Client Secret**: `YOUR_CLIENT_SECRET`

## 4. Environment Variables

Create `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
VITE_GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

## 5. Update Auth.tsx

In `src/pages/Auth.tsx`, update `handleOAuthFlow` function:

```typescript
const handleOAuthFlow = (provider: 'google' | 'github') => {
  setStep('authenticating')

  if (provider === 'google') {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
    const scope = 'email profile'
    const state = Math.random().toString(36).substring(7) // CSRF protection

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`

    // Save state to localStorage for verification
    localStorage.setItem('oauth_state', state)

    // Redirect to Google
    window.location.href = authUrl
  }
}
```

## 6. Create Callback Handler

Create `src/pages/AuthCallback.tsx`:

```typescript
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const savedState = localStorage.getItem('oauth_state')

      // Verify state to prevent CSRF
      if (state !== savedState) {
        console.error('Invalid state parameter')
        navigate('/auth')
        return
      }

      // Exchange code for tokens
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        })

        const data = await response.json()

        // Save tokens
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)

        // Clean up
        localStorage.removeItem('oauth_state')

        // Redirect to dashboard
        navigate('/dashboard')
      } catch (error) {
        console.error('Authentication failed:', error)
        navigate('/auth')
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center">
      <div className="text-center">
        <p className="text-terminal-cyan text-lg mb-2">Processing authentication...</p>
        <p className="text-terminal-muted text-sm">Please wait</p>
      </div>
    </div>
  )
}
```

## 7. Add Callback Route

Update `src/App.tsx`:

```typescript
import { AuthCallback } from './pages/AuthCallback'

<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
```

## 8. Backend API Endpoint

Create backend endpoint `/api/auth/google`:

```python
# FastAPI example
from fastapi import FastAPI, HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token
import requests as http_requests

@app.post("/api/auth/google")
async def google_auth(data: dict):
    code = data.get("code")

    # Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    response = http_requests.post(token_url, data=token_data)
    tokens = response.json()

    # Verify ID token
    id_info = id_token.verify_oauth2_token(
        tokens['id_token'],
        requests.Request(),
        GOOGLE_CLIENT_ID
    )

    # Get user info
    user_email = id_info['email']
    user_name = id_info['name']

    # Create/update user in database
    # Return your app's tokens

    return {
        "access_token": "your_jwt_token",
        "refresh_token": "your_refresh_token",
        "user": {"email": user_email, "name": user_name}
    }
```

## 9. Database Integration

Example user model (SQLAlchemy):

```python
from sqlalchemy import Column, String, DateTime
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String)
    google_id = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
```

## 10. Protected Routes

Add authentication check:

```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/auth')
      return
    }

    // Verify token with backend
    fetch('/api/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      if (!res.ok) {
        localStorage.removeItem('access_token')
        navigate('/auth')
      }
    })
  }, [navigate])
}

// In Dashboard.tsx
export function Dashboard() {
  useAuth() // Protect route
  // ... rest of component
}
```

## Security Notes

- Never expose Client Secret in frontend code
- Always verify state parameter to prevent CSRF
- Use HTTPS in production
- Implement token refresh logic
- Store tokens securely (httpOnly cookies preferred)
- Add rate limiting to prevent abuse
- Implement proper session management
