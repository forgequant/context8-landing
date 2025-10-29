export function MCPInstructions() {
  return (
    <div className="bg-graphite-900 rounded-lg p-6 border border-graphite-700">
      <h3 className="text-lg font-semibold mb-4 text-terminal-cyan">
        Connect to Context8 via Claude Code
      </h3>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-terminal-muted mb-2">
            Context8 provides an MCP server for seamless integration with Claude Code.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-terminal-text">Quick Setup:</p>
          <ol className="list-decimal list-inside space-y-1 text-terminal-muted">
            <li>Install Context8 CLI: <code className="bg-graphite-950 px-2 py-0.5 rounded text-terminal-cyan">npm install -g context8</code></li>
            <li>Configure MCP server in your Claude Code settings</li>
            <li>Add Context8 server configuration</li>
            <li>Start using real-time crypto data in your AI workflows</li>
          </ol>
        </div>

        <div className="p-3 bg-graphite-950 rounded border border-graphite-700 font-mono text-xs overflow-x-auto">
          <div className="text-terminal-muted mb-1"># Add to claude_desktop_config.json:</div>
          <pre className="text-terminal-text">{`{
  "mcpServers": {
    "context8": {
      "command": "context8",
      "args": ["mcp"],
      "env": {
        "CONTEXT8_API_KEY": "your-api-key"
      }
    }
  }
}`}</pre>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-200">
            <p className="font-medium">Pro subscribers get full API access</p>
            <p className="mt-1 text-blue-300/80">
              Your API key will be available here after upgrading to Pro.
            </p>
          </div>
        </div>

        <div>
          <a
            href="https://docs.context8.io/mcp-integration"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-terminal-cyan hover:underline text-sm"
          >
            View full documentation →
          </a>
        </div>
      </div>
    </div>
  )
}
