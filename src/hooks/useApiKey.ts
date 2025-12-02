import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface ApiKey {
  id: string
  key_prefix: string
  name: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

interface ApiUsage {
  daily_usage: number
  daily_limit: number
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState<ApiKey | null>(null)
  const [usage, setUsage] = useState<ApiUsage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string | null>(null)

  const fetchApiKey = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch active API key
      const { data: keyData, error: keyError } = await supabase
        .from('api_keys')
        .select('id, key_prefix, name, is_active, created_at, last_used_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (keyError && keyError.code !== 'PGRST116') {
        throw keyError
      }

      setApiKey(keyData)

      // Fetch usage stats
      const { data: usageData, error: usageError } = await supabase
        .rpc('get_daily_usage', { p_user_id: user.id })

      if (usageError) {
        console.error('Error fetching usage:', usageError)
      }

      const { data: limitData } = await supabase
        .rpc('get_user_rate_limit', { p_user_id: user.id })

      setUsage({
        daily_usage: usageData || 0,
        daily_limit: limitData || 2
      })

    } catch (err) {
      console.error('Error fetching API key:', err)
      setError('Failed to load API key')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApiKey()
  }, [fetchApiKey])

  const generateKey = useCallback(async () => {
    try {
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Generate a new API key locally
      const keyBytes = new Uint8Array(24)
      crypto.getRandomValues(keyBytes)
      const rawKey = 'ctx8_' + Array.from(keyBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      // Hash the key for storage
      const encoder = new TextEncoder()
      const data = encoder.encode(rawKey)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const keyHash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      // Deactivate existing keys
      await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('user_id', user.id)

      // Insert new key
      const { data: newKeyData, error: insertError } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          key_hash: keyHash,
          key_prefix: rawKey.substring(0, 12) + '...',
          name: 'Generated key',
          is_active: true
        })
        .select()
        .single()

      if (insertError) throw insertError

      setNewKey(rawKey)
      setApiKey({
        ...newKeyData,
        key_prefix: rawKey.substring(0, 12) + '...'
      })

      return rawKey
    } catch (err) {
      console.error('Error generating key:', err)
      setError('Failed to generate API key')
      return null
    }
  }, [])

  const revokeKey = useCallback(async () => {
    try {
      setError(null)
      if (!apiKey) return

      const { error: updateError } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', apiKey.id)

      if (updateError) throw updateError

      setApiKey(null)
      setNewKey(null)
    } catch (err) {
      console.error('Error revoking key:', err)
      setError('Failed to revoke API key')
    }
  }, [apiKey])

  const clearNewKey = useCallback(() => {
    setNewKey(null)
  }, [])

  return {
    apiKey,
    usage,
    loading,
    error,
    newKey,
    generateKey,
    revokeKey,
    clearNewKey,
    refresh: fetchApiKey
  }
}
