import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface AdminRouteProps {
  children: ReactNode
}

/**
 * Route guard component that restricts access to admin users only
 * Checks user.user_metadata.is_admin flag from Supabase Auth
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin } = useAuth()

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center">
        <p className="text-terminal-cyan">Checking permissions...</p>
      </div>
    )
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Redirect to dashboard if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // Render protected content if admin
  return <>{children}</>
}
