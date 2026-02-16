import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth as useOidcAuth } from 'react-oidc-context'

export function AuthCallback() {
  const oidc = useOidcAuth()
  const navigate = useNavigate()
  const [localError, setLocalError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    // Only attempt callback handling when we actually have OIDC params.
    const params = new URLSearchParams(window.location.search)
    const hasCallbackParams = params.has('code') || params.has('error')
    if (!hasCallbackParams) return

    ;(async () => {
      try {
        const user = await oidc.signinRedirectCallback()
        if (cancelled) return

        const maybeState = user?.state as unknown
        const returnTo =
          typeof maybeState === 'object' && maybeState !== null && 'returnTo' in maybeState
            ? String((maybeState as { returnTo?: unknown }).returnTo ?? '/dashboard')
            : '/dashboard'

        navigate(returnTo.startsWith('/') ? returnTo : '/dashboard', { replace: true })
      } catch (err) {
        if (cancelled) return
        setLocalError(err instanceof Error ? err : new Error(String(err)))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [navigate, oidc])

  useEffect(() => {
    if (oidc.error || localError) {
      return
    }

    if (oidc.isAuthenticated) {
      const maybeState = oidc.user?.state as unknown
      const returnTo =
        typeof maybeState === 'object' && maybeState !== null && 'returnTo' in maybeState
          ? String((maybeState as { returnTo?: unknown }).returnTo ?? '/dashboard')
          : '/dashboard'
      navigate(returnTo.startsWith('/') ? returnTo : '/dashboard', { replace: true })
    }
  }, [oidc.isAuthenticated, oidc.error, oidc.user, navigate, localError])

  const err = localError ?? oidc.error
  if (err) {
    return (
      <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-graphite-900 rounded-lg border border-graphite-800 p-6">
          <p className="text-terminal-red text-sm font-semibold mb-2">Sign-in failed</p>
          <p className="text-terminal-muted text-xs leading-relaxed">
            {err.message}
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => navigate('/auth', { replace: true })}
              className="px-4 py-2 bg-terminal-cyan text-graphite-950 rounded text-sm font-semibold hover:bg-terminal-cyan/90 transition-all"
            >
              Back to sign-in
            </button>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="px-4 py-2 border border-graphite-800 rounded text-sm text-terminal-text hover:border-terminal-cyan/40 transition-all"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center">
      <p className="text-terminal-cyan">Completing sign-in...</p>
    </div>
  )
}
