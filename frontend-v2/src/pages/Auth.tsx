import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

type AuthMethod = 'google' | 'github' | 'email'
type Step = 'method' | 'username' | 'password' | 'authenticating'

export function Auth() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('method')
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null)
  const [methodInput, setMethodInput] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayPassword, setDisplayPassword] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])

  const handleMethodSelect = (e: React.FormEvent) => {
    e.preventDefault()
    const choice = methodInput.trim()

    if (choice === '1') {
      setAuthMethod('google')
      handleOAuthFlow('google')
    } else if (choice === '2') {
      setAuthMethod('github')
      handleOAuthFlow('github')
    } else if (choice === '3') {
      setAuthMethod('email')
      setStep('username')
    }
  }

  const handleOAuthFlow = async (provider: 'google' | 'github') => {
    setStep('authenticating')

    const { supabase } = await import('../lib/supabase')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      console.error('OAuth error:', error)
      alert(`Authentication failed: ${error.message}`)
      setStep('method')
      return
    }

    // OAuth will redirect automatically
  }

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setStep('password')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setStep('authenticating')

    const { supabase } = await import('../lib/supabase')

    // Try to sign in first
    let { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password
    })

    // If user doesn't exist, sign them up
    if (error && error.message.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: username,
        password: password,
        options: {
          data: {
            full_name: username.split('@')[0] // Use email prefix as name
          }
        }
      })

      if (signUpError) {
        console.error('Sign up error:', signUpError)
        alert(`Sign up failed: ${signUpError.message}`)
        setStep('password')
        return
      }

      data = signUpData
    } else if (error) {
      console.error('Sign in error:', error)
      alert(`Sign in failed: ${error.message}`)
      setStep('password')
      return
    }

    // Redirect to dashboard
    navigate('/dashboard')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setDisplayPassword('•'.repeat(value.length))
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
          <p className="text-sm text-terminal-muted">OAuth Authentication</p>
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
              <p className="text-terminal-green text-sm mb-6">✓ Connected to api.context8.markets</p>

              <p className="text-terminal-muted text-sm mb-4"># Choose authentication method:</p>
              <p className="text-sm mb-6">
                <span className="text-terminal-cyan">[1]</span> Google OAuth
                <br />
                <span className="text-terminal-cyan">[2]</span> GitHub OAuth
                <br />
                <span className="text-terminal-cyan">[3]</span> Email/Password
              </p>

              {/* Method selection */}
              {step === 'method' && (
                <form onSubmit={handleMethodSelect}>
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-cyan">$</span>
                    <span className="text-terminal-muted">Select option:</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={methodInput}
                      onChange={(e) => setMethodInput(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-terminal-text caret-terminal-cyan"
                      autoComplete="off"
                      spellCheck="false"
                      maxLength={1}
                    />
                    <span className="text-terminal-cyan animate-pulse">_</span>
                  </div>
                </form>
              )}

              {/* Username input */}
              {step === 'username' && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-terminal-muted">
                    <span className="text-terminal-cyan">$</span>
                    <span>Select option:</span>
                    <span className="text-terminal-text">1</span>
                  </div>
                  <form onSubmit={handleUsernameSubmit}>
                    <div className="flex items-center gap-2">
                      <span className="text-terminal-cyan">$</span>
                      <span className="text-terminal-muted">login:</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-terminal-text caret-terminal-cyan"
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <span className="text-terminal-cyan animate-pulse">_</span>
                    </div>
                  </form>
                </div>
              )}

              {/* Password input */}
              {step === 'password' && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-terminal-muted">
                    <span className="text-terminal-cyan">$</span>
                    <span>Select option:</span>
                    <span className="text-terminal-text">1</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-terminal-muted">
                    <span className="text-terminal-cyan">$</span>
                    <span>login:</span>
                    <span className="text-terminal-text">{username}</span>
                  </div>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="flex items-center gap-2">
                      <span className="text-terminal-cyan">$</span>
                      <span className="text-terminal-muted">password:</span>
                      <input
                        ref={inputRef}
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="flex-1 bg-transparent outline-none text-terminal-text caret-terminal-cyan"
                        autoComplete="off"
                        style={{ fontFamily: 'monospace' }}
                      />
                      <span className="text-terminal-cyan animate-pulse">_</span>
                    </div>
                  </form>
                </div>
              )}

              {/* Authenticating state */}
              {step === 'authenticating' && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-terminal-muted">
                    <span className="text-terminal-cyan">$</span>
                    <span>Select option:</span>
                    <span className="text-terminal-text">
                      {authMethod === 'google' ? '1' : authMethod === 'github' ? '2' : '3'}
                    </span>
                  </div>

                  {authMethod === 'email' && (
                    <>
                      <div className="flex items-center gap-2 mb-3 text-terminal-muted">
                        <span className="text-terminal-cyan">$</span>
                        <span>login:</span>
                        <span className="text-terminal-text">{username}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4 text-terminal-muted">
                        <span className="text-terminal-cyan">$</span>
                        <span>password:</span>
                        <span className="text-terminal-text">{displayPassword}</span>
                      </div>
                    </>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-terminal-cyan text-sm"
                  >
                    {authMethod === 'google' && (
                      <>
                        <p className="mb-2">→ Redirecting to Google OAuth...</p>
                        <p className="text-terminal-green">✓ Opening authorization window</p>
                      </>
                    )}
                    {authMethod === 'github' && (
                      <>
                        <p className="mb-2">→ Redirecting to GitHub OAuth...</p>
                        <p className="text-terminal-green">✓ Opening authorization window</p>
                      </>
                    )}
                    {authMethod === 'email' && (
                      <>
                        <p className="mb-2">→ Authenticating...</p>
                        <p className="text-terminal-green">✓ Access granted</p>
                      </>
                    )}
                    <p className="text-terminal-muted mt-2">Redirecting to dashboard...</p>
                  </motion.div>
                </div>
              )}

              {/* Instructions */}
              {step === 'method' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 text-xs text-terminal-muted"
                >
                  <p>Enter 1, 2, or 3 and press Enter</p>
                  <p className="mt-2">All methods are enabled</p>
                </motion.div>
              )}

              {step === 'username' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 text-xs text-terminal-muted"
                >
                  <p>Enter your email and press Enter</p>
                  <p className="mt-2">New users will be auto-registered</p>
                </motion.div>
              )}

              {step === 'password' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-xs text-terminal-muted"
                >
                  <p>Press Enter to authenticate</p>
                </motion.div>
              )}
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
            ← Back to landing
          </button>
        </motion.div>
      </div>
    </div>
  )
}
