import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth as useOidcAuth } from 'react-oidc-context'

export function AuthCallback() {
  const oidc = useOidcAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (oidc.error) {
      navigate('/auth', { replace: true })
      return
    }

    if (oidc.isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [oidc.isAuthenticated, oidc.error, navigate])

  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center">
      <p className="text-terminal-cyan">Completing sign-in...</p>
    </div>
  )
}
