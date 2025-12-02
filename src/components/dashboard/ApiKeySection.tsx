import { useState } from 'react'
import { useApiKey } from '../../hooks/useApiKey'

export function ApiKeySection() {
  const {
    apiKey,
    usage,
    loading,
    error,
    newKey,
    generateKey,
    revokeKey,
    clearNewKey
  } = useApiKey()

  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    await generateKey()
    setIsGenerating(false)
  }

  const handleCopy = async () => {
    if (newKey) {
      await navigator.clipboard.writeText(newKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRevoke = async () => {
    await revokeKey()
    setShowRevokeConfirm(false)
  }

  if (loading) {
    return (
      <div className="bg-graphite-900 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-graphite-800 rounded w-1/4 mb-4" />
        <div className="h-8 bg-graphite-800 rounded w-1/2" />
      </div>
    )
  }

  return (
    <div className="bg-graphite-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">API Key</h3>
        {usage && (
          <span className="text-xs text-terminal-muted">
            {usage.daily_usage}/{usage.daily_limit} requests today
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-terminal-red/10 border border-terminal-red/30 rounded text-sm text-terminal-red">
          {error}
        </div>
      )}

      {/* New key display (shown only once after generation) */}
      {newKey && (
        <div className="mb-4 p-4 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded">
          <p className="text-xs text-terminal-cyan mb-2">
            Save this key now - it won't be shown again!
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-graphite-950 px-3 py-2 rounded text-sm font-mono text-terminal-text break-all">
              {newKey}
            </code>
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-terminal-cyan text-graphite-950 rounded text-sm font-semibold hover:bg-terminal-cyan/90 transition-colors whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button
            onClick={clearNewKey}
            className="mt-3 text-xs text-terminal-muted hover:text-terminal-text transition-colors"
          >
            I've saved my key
          </button>
        </div>
      )}

      {/* Existing key display */}
      {apiKey && !newKey && (
        <div className="flex items-center justify-between">
          <div>
            <code className="bg-graphite-950 px-3 py-2 rounded text-sm font-mono text-terminal-muted">
              {apiKey.key_prefix}
            </code>
            {apiKey.last_used_at && (
              <p className="text-xs text-terminal-muted mt-2">
                Last used: {new Date(apiKey.last_used_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-3 py-2 bg-graphite-800 text-terminal-text rounded text-sm hover:bg-graphite-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Regenerate'}
            </button>
            <button
              onClick={() => setShowRevokeConfirm(true)}
              className="px-3 py-2 bg-terminal-red/10 text-terminal-red rounded text-sm hover:bg-terminal-red/20 transition-colors"
            >
              Revoke
            </button>
          </div>
        </div>
      )}

      {/* No key - generate button */}
      {!apiKey && !newKey && (
        <div className="text-center py-4">
          <p className="text-sm text-terminal-muted mb-4">
            Generate an API key to use Context8 MCP server
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-terminal-cyan text-graphite-950 rounded text-sm font-semibold hover:bg-terminal-cyan/90 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate API Key'}
          </button>
        </div>
      )}

      {/* Revoke confirmation */}
      {showRevokeConfirm && (
        <div className="fixed inset-0 bg-graphite-950/80 flex items-center justify-center z-50">
          <div className="bg-graphite-900 p-6 rounded-lg max-w-sm w-full mx-4">
            <h4 className="text-sm font-semibold mb-2">Revoke API Key?</h4>
            <p className="text-xs text-terminal-muted mb-4">
              This will immediately invalidate your current API key. You'll need to generate a new one to continue using the API.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRevokeConfirm(false)}
                className="px-3 py-2 bg-graphite-800 text-terminal-text rounded text-sm hover:bg-graphite-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                className="px-3 py-2 bg-terminal-red text-white rounded text-sm hover:bg-terminal-red/90 transition-colors"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage bar */}
      {usage && usage.daily_limit > 0 && (
        <div className="mt-4">
          <div className="h-1.5 bg-graphite-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                usage.daily_usage >= usage.daily_limit
                  ? 'bg-terminal-red'
                  : usage.daily_usage >= usage.daily_limit * 0.8
                    ? 'bg-yellow-500'
                    : 'bg-terminal-cyan'
              }`}
              style={{
                width: `${Math.min((usage.daily_usage / usage.daily_limit) * 100, 100)}%`
              }}
            />
          </div>
          <p className="text-xs text-terminal-muted mt-1">
            {usage.daily_limit === 2 ? 'Free plan' : 'Pro plan'} - resets daily at midnight UTC
          </p>
        </div>
      )}
    </div>
  )
}
