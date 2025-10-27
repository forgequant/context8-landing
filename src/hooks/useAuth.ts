import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

/**
 * Authentication hook with admin role check
 *
 * Returns current user, loading state, admin status, and sign out function
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Check if user has admin role from user metadata
  const isAdmin = user?.user_metadata?.is_admin === true

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, loading, isAdmin, signOut }
}
