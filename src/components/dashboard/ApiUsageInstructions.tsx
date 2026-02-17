import { useState } from 'react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-terminal-muted hover:text-terminal-cyan transition-colors p-1"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4 text-terminal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

function CodeBlock({ copyText, children }: { copyText: string; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <pre className="bg-graphite-950 border border-graphite-700 rounded-lg p-4 text-sm font-mono text-terminal-text overflow-x-auto">
        {children}
      </pre>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={copyText} />
      </div>
    </div>
  )
}

export function ApiUsageInstructions() {
  const baseUrl = 'https://api.context8.markets'
  const curlSignals = `curl ${baseUrl}/v1/signals \\\n  -H "Authorization: Bearer ctx8_sk_..." \\\n  -d '{"asset": "BTC", "modules": "all"}'`

  return (
    <div className="bg-graphite-900 rounded-xl border border-graphite-800 overflow-hidden">
      <div className="bg-graphite-800/50 px-6 py-4 border-b border-graphite-700">
        <h3 className="text-lg font-semibold text-terminal-text">
          API Usage (curl)
        </h3>
        <p className="text-sm text-terminal-muted mt-1">
          Use your API key as a Bearer token. JSON in, JSON out.
        </p>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 bg-graphite-950 rounded-lg border border-graphite-700 p-3">
          <div className="text-sm text-terminal-muted">Base URL</div>
          <div className="flex items-center gap-2">
            <code className="text-sm text-terminal-cyan font-mono">{baseUrl}</code>
            <CopyButton text={baseUrl} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-terminal-text">Signals</div>
            <span className="text-xs text-terminal-muted font-mono">POST /v1/signals</span>
          </div>
          <CodeBlock copyText={curlSignals}>
            {curlSignals}
          </CodeBlock>
          <p className="text-xs text-terminal-muted">
            Example request matches the landing page docs.
          </p>
        </div>
      </div>
    </div>
  )
}

