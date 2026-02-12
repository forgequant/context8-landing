import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { SubscriptionTier } from '../../lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredTier?: SubscriptionTier
  requiredRole?: string
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredTier,
  requiredRole,
  fallbackPath = '/auth',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasTier, hasRole } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center">
        <p className="text-terminal-cyan">Authenticating...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ returnTo: location.pathname }} replace />
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />
  }

  if (requiredTier && !hasTier(requiredTier)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
