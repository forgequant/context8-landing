export function MCPInstructions() {
  return (
    <div className="bg-graphite-900 rounded-lg p-6 border border-graphite-700">
      <h3 className="text-lg font-semibold mb-4 text-terminal-cyan">
        Connect Context8 to ChatGPT
      </h3>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-terminal-muted mb-2">
            Add real-time crypto market data to your ChatGPT workflows with our API integration.
          </p>
        </div>

        {/* ChatGPT Integration - Primary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-terminal-text">ChatGPT Integration</span>
            <span className="px-2 py-0.5 bg-terminal-cyan/20 text-terminal-cyan text-xs rounded border border-terminal-cyan/30">Recommended</span>
          </div>

          <ol className="list-decimal list-inside space-y-2 text-terminal-muted">
            <li>Go to ChatGPT → Settings → Personalization → Custom Instructions</li>
            <li className="ml-6 mt-1">
              <span className="text-terminal-text">Add this URL to "Custom Instructions":</span>
              <div className="mt-2 p-3 bg-graphite-950 rounded border border-graphite-700 font-mono text-xs">
                <code className="text-terminal-cyan break-all">
                  https://api.context8.io/v1/crypto?symbols=BTC,ETH,SOL&apikey=YOUR_API_KEY
                </code>
              </div>
            </li>
            <li>ChatGPT will automatically fetch live crypto prices when discussing markets</li>
          </ol>
        </div>

        {/* Claude Desktop - Secondary */}
        <details className="group">
          <summary className="cursor-pointer text-terminal-text font-medium hover:text-terminal-cyan transition-colors list-none flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Claude Desktop (Advanced)
          </summary>
          <div className="mt-3 ml-6 space-y-2">
            <p className="text-terminal-muted text-xs">
              For developers using Claude Desktop with MCP servers:
            </p>
            <div className="p-3 bg-graphite-950 rounded border border-graphite-700 font-mono text-xs overflow-x-auto">
              <pre className="text-terminal-text">{`# Add to claude_desktop_config.json:
{
  "mcpServers": {
    "context8": {
      "command": "npx",
      "args": ["-y", "context8-mcp"],
      "env": {
        "CONTEXT8_API_KEY": "YOUR_KEY"
      }
    }
  }
}`}</pre>
            </div>
          </div>
        </details>

        <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-200">
            <p className="font-medium">Pro subscribers get full API access</p>
            <p className="mt-1 text-blue-300/80">
              Your API key: <code className="bg-blue-900/30 px-2 py-0.5 rounded">c8_live_xxxxx</code> (available after upgrade)
            </p>
          </div>
        </div>

        <div>
          <a
            href="/docs/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-terminal-cyan hover:underline text-sm"
          >
            View API documentation →
          </a>
        </div>
      </div>
    </div>
  )
}
