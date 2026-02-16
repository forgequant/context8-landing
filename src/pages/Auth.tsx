import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { ZITADEL_CLIENT_ID, ZITADEL_PROJECT_ID } from '../lib/auth'

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
      <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-terminal-cyan text-sm">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-2xl mb-2">
            <span className="text-terminal-cyan">context8</span>
            <span className="text-terminal-text">&gt;_</span>
          </h1>
          <p className="text-sm text-terminal-muted">Secure Authentication</p>
        </motion.div>

        {/* Auth container - flat style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-graphite-900 rounded-lg border border-graphite-800 p-6 min-h-[300px]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-terminal-muted text-sm mb-4"># Connecting to Context8 MCP Server...</p>
            <p className="text-terminal-green text-sm mb-6">Connected to api.context8.markets</p>

            <p className="text-terminal-muted text-sm mb-6"># Authenticate to access your dashboard and API keys.</p>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-terminal-cyan">$</span>
              <span className="text-terminal-muted">auth --method=oidc</span>
            </div>

            {oidcMisconfigured ? (
              <div
                role="alert"
                className="mb-4 text-xs text-terminal-red bg-graphite-950/50 border border-terminal-red/30 rounded-md p-3"
              >
                {oidcMisconfiguredMessage}
              </div>
            ) : null}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignIn}
              disabled={isSigningIn || oidcMisconfigured}
              className="w-full py-3 bg-terminal-cyan text-graphite-950 rounded-lg text-sm font-semibold hover:bg-terminal-cyan/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSigningIn ? 'Redirecting...' : 'Sign In / Register'}
            </motion.button>

            {signInError ? (
              <div
                role="alert"
                className="mt-4 text-xs text-terminal-red bg-graphite-950/50 border border-terminal-red/30 rounded-md p-3"
              >
                {signInError}
              </div>
            ) : null}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-xs text-terminal-muted"
            >
              <p>You will be redirected to our secure login page.</p>
              <p className="mt-2">New users are automatically registered on first sign-in.</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate('/')}
            className="text-sm text-terminal-muted hover:text-terminal-cyan transition-colors"
          >
            Back to landing
          </button>
        </motion.div>
      </div>
    </div>
  )
}
