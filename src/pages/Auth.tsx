import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { ZITADEL_CLIENT_ID, ZITADEL_PROJECT_ID } from '../lib/auth'

const C = {
  bg: '#0C0A08',
  surface: '#161210',
  border: '#2E2A24',
  borderHover: '#443E36',
  text: '#E8E0D4',
  textSecondary: '#9A9080',
  textMuted: '#6B6358',
  accent: '#C49A3C',
  accentDim: 'rgba(196,154,60,0.12)',
  bull: '#4CAF78',
  bear: '#C94D4D',
  radius: '6px',
} as const

const font = {
  sans: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

export function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, login } = useAuth()
  const [signInError, setSignInError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const oidcMisconfigured =
    ZITADEL_CLIENT_ID === 'placeholder' || ZITADEL_PROJECT_ID === 'placeholder'
  const oidcMisconfiguredMessage =
    'OAuth is not configured for local development. ' +
    'Set VITE_ZITADEL_CLIENT_ID and VITE_ZITADEL_PROJECT_ID in .env.local (or your environment) and restart the dev server.'
  const returnTo =
    (location.state as { returnTo?: string } | null)?.returnTo ?? '/dashboard'
  const safeReturnTo = returnTo.startsWith('/') ? returnTo : '/dashboard'

  // Auto-redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(safeReturnTo, { replace: true })
    }
  }, [isAuthenticated, navigate, safeReturnTo])

  const handleSignIn = async () => {
    setSignInError(null)
    if (oidcMisconfigured) {
      setSignInError(oidcMisconfiguredMessage)
      return
    }

    setIsSigningIn(true)
    try {
      await login(safeReturnTo)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setSignInError(
        `Sign-in failed: ${msg}. ` +
          `If you're running locally, check VITE_ZITADEL_AUTHORITY is reachable.`,
      )
      setIsSigningIn(false)
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: C.bg,
          color: C.text,
          fontFamily: font.sans,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              border: `2px solid ${C.border}`,
              borderTopColor: C.accent,
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ margin: 0, fontFamily: font.mono, fontSize: '0.8125rem', color: C.textSecondary }}>
            Checking authentication…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: font.sans, WebkitFontSmoothing: 'antialiased' }}>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 56,
          borderBottom: `1px solid ${C.border}`,
          background: 'rgba(12,10,8,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 800,
            fontSize: '0.95rem',
            color: C.text,
            textDecoration: 'none',
          }}
        >
          <span style={{ color: C.accent, fontFamily: font.mono, fontWeight: 600, fontSize: '0.85rem' }}>&#9670;</span>
          Context8
        </a>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: C.textSecondary,
            background: 'transparent',
            padding: '7px 12px',
            borderRadius: C.radius,
            border: `1px solid ${C.border}`,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderHover)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
        >
          Back to landing
        </button>
      </nav>

      <main style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px 4px 8px',
                background: C.accentDim,
                border: '1px solid rgba(196,154,60,0.2)',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: C.accent,
                marginBottom: 18,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, animation: 'pulse 2s ease-in-out infinite' }} />
              Secure sign-in
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.12, margin: 0 }}>
              Authenticate to access
              <br />
              Daily Disagree and API keys
            </h1>
            <p style={{ marginTop: 12, marginBottom: 0, color: C.textSecondary, fontSize: '1rem', lineHeight: 1.6 }}>
              We use OIDC. You will be redirected to our secure login provider and returned here after sign-in.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            style={{
              marginTop: 28,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: C.radius,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div style={{ fontFamily: font.mono, fontSize: '0.6875rem', fontWeight: 700, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Authentication
              </div>
              <div style={{ fontFamily: font.mono, fontSize: '0.6875rem', color: C.textMuted }}>
                api.context8.markets
              </div>
            </div>

            {oidcMisconfigured ? (
              <div
                role="alert"
                style={{
                  marginTop: 12,
                  marginBottom: 12,
                  fontFamily: font.mono,
                  fontSize: '0.75rem',
                  color: C.bear,
                  background: 'rgba(201,77,77,0.08)',
                  border: '1px solid rgba(201,77,77,0.25)',
                  borderRadius: C.radius,
                  padding: 12,
                  lineHeight: 1.5,
                }}
              >
                {oidcMisconfiguredMessage}
              </div>
            ) : null}

            {signInError ? (
              <div
                role="alert"
                style={{
                  marginTop: 12,
                  marginBottom: 12,
                  fontFamily: font.mono,
                  fontSize: '0.75rem',
                  color: C.bear,
                  background: 'rgba(201,77,77,0.08)',
                  border: '1px solid rgba(201,77,77,0.25)',
                  borderRadius: C.radius,
                  padding: 12,
                  lineHeight: 1.5,
                }}
              >
                {signInError}
              </div>
            ) : null}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSignIn}
              disabled={isSigningIn || oidcMisconfigured}
              style={{
                width: '100%',
                marginTop: 6,
                padding: '12px 16px',
                background: C.accent,
                color: C.bg,
                fontFamily: font.sans,
                fontSize: '0.875rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: C.radius,
                cursor: isSigningIn || oidcMisconfigured ? 'not-allowed' : 'pointer',
                opacity: isSigningIn || oidcMisconfigured ? 0.6 : 1,
              }}
            >
              {isSigningIn ? 'Redirecting…' : 'Sign In / Register'}
            </motion.button>

            <div style={{ marginTop: 12, fontFamily: font.mono, fontSize: '0.75rem', color: C.textMuted, lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.bull }}>●</span>
                <span>After sign-in, you will be redirected to your dashboard.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
