import { useEffect } from 'react'
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { oidcConfig } from '../../lib/auth'
import { queryClient } from '../../lib/queryClient'

function LogoutCacheClearer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      // oidc-client-ts removes the user key on logout; detect that across tabs
      if (e.key !== null && e.key.startsWith('oidc.') && e.newValue === null) {
        queryClient.clear()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return <>{children}</>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <OidcAuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <LogoutCacheClearer>{children}</LogoutCacheClearer>
      </QueryClientProvider>
    </OidcAuthProvider>
  )
}
