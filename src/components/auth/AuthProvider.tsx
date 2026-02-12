import { AuthProvider as OidcAuthProvider } from 'react-oidc-context'
import { oidcConfig } from '../../lib/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <OidcAuthProvider {...oidcConfig}>{children}</OidcAuthProvider>
}
