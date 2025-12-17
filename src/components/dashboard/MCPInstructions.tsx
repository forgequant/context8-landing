import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
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

function CodeBlock({ children, copyText }: { children: React.ReactNode; copyText: string }) {
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

function StepNumber({ num }: { num: number }) {
  return (
    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-terminal-cyan text-graphite-950 flex items-center justify-center text-sm font-bold">
      {num}
    </span>
  )
}

export function MCPInstructions() {
  const [showClaude, setShowClaude] = useState(false)

  return (
    <div className="bg-graphite-900 rounded-xl border border-graphite-800 overflow-hidden">
      {/* Header */}
      <div className="bg-graphite-800/50 px-6 py-4 border-b border-graphite-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-terminal-text">
            Connect Context8 to ChatGPT
          </h3>
          <span className="px-3 py-1 bg-terminal-cyan/20 text-terminal-cyan text-xs font-medium rounded-full border border-terminal-cyan/30">
            Recommended
          </span>
        </div>
        <p className="text-sm text-terminal-muted mt-1">
          Add real-time crypto market data to your AI workflows
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Maintenance Notice - Compact */}
        <div className="flex items-center gap-3 p-3 bg-terminal-red/10 border border-terminal-red/30 rounded-lg">
          <span className="text-terminal-red">⚠️</span>
          <div>
            <span className="text-terminal-red text-sm font-medium">API under maintenance until Dec 20</span>
            <span className="text-terminal-muted text-sm ml-2">• Instructions will work after</span>
          </div>
        </div>

        {/* Step 1 */}
        <div className="flex gap-4">
          <StepNumber num={1} />
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-terminal-text">Enable Developer Mode</h4>
            <p className="text-sm text-terminal-muted">
              In ChatGPT: <span className="text-terminal-text">Settings → Advanced → Developer Mode</span>
            </p>
            <p className="text-xs text-terminal-muted/80 italic">
              Requires ChatGPT Plus, Pro, Team, or Enterprise
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <StepNumber num={2} />
          <div className="flex-1 space-y-3">
            <h4 className="font-semibold text-terminal-text">Create Custom Connector</h4>
            <p className="text-sm text-terminal-muted">
              Go to: <span className="text-terminal-text">Settings → Applications and Connectors → Create</span>
            </p>

            <div className="bg-graphite-950 rounded-lg border border-graphite-700 divide-y divide-graphite-700">
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-terminal-muted">Name</span>
                <code className="text-sm text-terminal-cyan font-mono">Context8 Crypto</code>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-terminal-muted">Description</span>
                <code className="text-sm text-terminal-text font-mono">Real-time crypto market data</code>
              </div>
              <div className="flex items-center justify-between p-3 gap-4">
                <span className="text-sm text-terminal-muted flex-shrink-0">MCP Server URL</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-terminal-cyan font-mono">https://api.context8.markets/sse</code>
                  <CopyButton text="https://api.context8.markets/sse" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-terminal-muted">Authentication</span>
                <code className="text-sm text-terminal-green font-mono">None required</code>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <StepNumber num={3} />
          <div className="flex-1 space-y-3">
            <h4 className="font-semibold text-terminal-text">Use in Chat</h4>
            <p className="text-sm text-terminal-muted">Type this in any ChatGPT conversation:</p>

            <CodeBlock copyText="@Context8 Crypto generate market report for BTCUSDT">
              <span className="text-terminal-cyan">@Context8 Crypto</span> generate market report for BTCUSDT
            </CodeBlock>

            <p className="text-xs text-terminal-muted">
              Returns: price, orderbook, liquidity, volume profile, order flow, anomalies, market health
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-graphite-700 pt-6">
          {/* Claude Desktop Toggle */}
          <button
            onClick={() => setShowClaude(!showClaude)}
            className="w-full flex items-center justify-between p-3 bg-graphite-800/50 hover:bg-graphite-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-terminal-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-sm font-medium text-terminal-text">Claude Desktop Setup</span>
              <span className="text-xs text-terminal-muted">(Advanced)</span>
            </div>
            <motion.svg
              animate={{ rotate: showClaude ? 180 : 0 }}
              className="w-5 h-5 text-terminal-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          <AnimatePresence>
            {showClaude && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  <p className="text-sm text-terminal-muted">
                    Add to your <code className="text-terminal-cyan">claude_desktop_config.json</code>:
                  </p>
                  <CodeBlock copyText={`{
  "mcpServers": {
    "context8": {
      "command": "npx",
      "args": ["-y", "context8-mcp"],
      "env": {
        "CONTEXT8_API_KEY": "YOUR_KEY"
      }
    }
  }
}`}>
{`{
  "mcpServers": {
    "context8": {
      "command": "npx",
      "args": ["-y", "context8-mcp"],
      "env": {
        "CONTEXT8_API_KEY": "YOUR_KEY"
      }
    }
  }
}`}
                  </CodeBlock>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pro Notice */}
        <div className="flex items-start gap-3 p-4 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-terminal-cyan/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-terminal-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-terminal-cyan">Pro subscribers get full API access</p>
            <p className="text-xs text-terminal-muted mt-1">
              API key available in the section above after upgrade
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
