import { Link } from 'react-router-dom'

export function ApiDocs() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12">
        <Link to="/dashboard" className="text-sm text-terminal-cyan hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-terminal-cyan mb-2">Context8 API</h1>
        <p className="text-terminal-muted">Real-time cryptocurrency market data API</p>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Getting Started */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            Getting Started
          </h2>
          <div className="space-y-3 text-sm">
            <p className="text-terminal-muted">
              Context8 API provides real-time crypto market data. Pro subscribers get an API key to access live prices, 24h changes, and volume data.
            </p>
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
              <p className="text-terminal-text font-medium mb-2">Base URL:</p>
              <code className="text-terminal-cyan">https://api.context8.io/v1</code>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            Authentication
          </h2>
          <div className="space-y-3 text-sm">
            <p className="text-terminal-muted">
              Include your API key in the query string:
            </p>
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <code className="text-terminal-text">
                ?apikey=<span className="text-terminal-cyan">c8_live_your_api_key</span>
              </code>
            </div>
            <p className="text-yellow-300/80 text-xs">
              ⚠️ Keep your API key secure. Don't expose it in client-side code or public repositories.
            </p>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            Endpoints
          </h2>

          {/* Crypto Prices */}
          <div className="space-y-6">
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-5">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs font-bold mr-2">
                  GET
                </span>
                <code className="text-terminal-cyan text-sm">/crypto</code>
              </div>

              <p className="text-terminal-muted text-sm mb-4">
                Get real-time cryptocurrency prices and market data
              </p>

              {/* Parameters */}
              <div className="mb-4">
                <p className="text-terminal-text font-medium text-sm mb-2">Query Parameters:</p>
                <div className="space-y-2 text-xs">
                  <div className="flex gap-3">
                    <code className="text-terminal-cyan min-w-[100px]">symbols</code>
                    <span className="text-terminal-muted">Comma-separated list of symbols (e.g., BTC,ETH,SOL)</span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-terminal-cyan min-w-[100px]">apikey</code>
                    <span className="text-terminal-muted">Your API key (required)</span>
                  </div>
                </div>
              </div>

              {/* Example Request */}
              <div className="mb-4">
                <p className="text-terminal-text font-medium text-sm mb-2">Example Request:</p>
                <div className="bg-graphite-950 border border-graphite-700 rounded p-3 font-mono text-xs overflow-x-auto">
                  <code className="text-terminal-text">
                    curl https://api.context8.io/v1/crypto?symbols=BTC,ETH,SOL&apikey=<span className="text-terminal-cyan">YOUR_KEY</span>
                  </code>
                </div>
              </div>

              {/* Example Response */}
              <div>
                <p className="text-terminal-text font-medium text-sm mb-2">Example Response:</p>
                <div className="bg-graphite-950 border border-graphite-700 rounded p-3 font-mono text-xs overflow-x-auto">
                  <pre className="text-terminal-text">{`{
  "success": true,
  "data": [
    {
      "symbol": "BTC",
      "price": 98234.50,
      "change_24h": 2.34,
      "volume_24h": 45234567890
    },
    {
      "symbol": "ETH",
      "price": 3456.78,
      "change_24h": -0.56,
      "volume_24h": 23456789012
    }
  ],
  "timestamp": "2025-10-29T10:30:00Z"
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            Rate Limits
          </h2>
          <div className="space-y-3 text-sm">
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-terminal-cyan font-medium">Pro Plan:</span>
                <span className="text-terminal-text">60 requests per minute</span>
              </div>
              <p className="text-terminal-muted text-xs">
                If you exceed the rate limit, you'll receive a 429 status code. Wait 60 seconds before retrying.
              </p>
            </div>
          </div>
        </section>

        {/* ChatGPT Integration */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            ChatGPT Custom Connector
          </h2>
          <div className="space-y-4 text-sm">
            <p className="text-terminal-muted">
              Connect Context8 to ChatGPT using Custom Connectors (requires ChatGPT Plus/Pro/Team/Enterprise):
            </p>

            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="font-medium text-blue-200 mb-2">Step 1: Enable Developer Mode</p>
                <p className="text-blue-300/80 text-xs">
                  ChatGPT → Settings → Advanced → Enable "Developer Mode"
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="font-medium text-blue-200 mb-2">Step 2: Create Custom Connector</p>
                <p className="text-blue-300/80 text-xs mb-3">
                  Settings → Applications and Connectors → Create
                </p>
                <div className="bg-graphite-950 border border-graphite-700 rounded p-3 space-y-2 text-xs">
                  <div className="flex gap-2">
                    <span className="text-terminal-muted min-w-[120px]">Name:</span>
                    <code className="text-terminal-cyan">Context8 Crypto</code>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-terminal-muted min-w-[120px]">Description:</span>
                    <code className="text-terminal-text">Real-time crypto market data</code>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-terminal-muted min-w-[120px]">MCP Server URL:</span>
                    <code className="text-terminal-cyan">https://api.context8.io/mcp</code>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-terminal-muted min-w-[120px]">Authentication:</span>
                    <code className="text-terminal-cyan">No authentication</code>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="font-medium text-blue-200 mb-2">Step 3: Use in Chat</p>
                <div className="bg-graphite-950 border border-graphite-700 rounded p-3 font-mono text-xs">
                  <code className="text-terminal-cyan">@Context8 Crypto get BTC, ETH, SOL prices</code>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-xs">
              <p className="font-medium text-yellow-200">Note:</p>
              <p className="text-yellow-300/80 mt-1">
                Custom Connectors require a paid ChatGPT plan. Free users can access the API directly via REST.
              </p>
            </div>
          </div>
        </section>

        {/* Error Codes */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            Error Codes
          </h2>
          <div className="space-y-2 text-sm">
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-3 flex gap-3">
              <code className="text-terminal-cyan font-bold">400</code>
              <span className="text-terminal-muted">Bad Request - Invalid parameters</span>
            </div>
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-3 flex gap-3">
              <code className="text-terminal-cyan font-bold">401</code>
              <span className="text-terminal-muted">Unauthorized - Invalid or missing API key</span>
            </div>
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-3 flex gap-3">
              <code className="text-terminal-cyan font-bold">429</code>
              <span className="text-terminal-muted">Too Many Requests - Rate limit exceeded</span>
            </div>
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-3 flex gap-3">
              <code className="text-terminal-cyan font-bold">500</code>
              <span className="text-terminal-muted">Internal Server Error - Contact support</span>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="pb-12">
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            Support
          </h2>
          <div className="space-y-3 text-sm">
            <p className="text-terminal-muted">
              Need help? Contact us:
            </p>
            <div className="flex gap-4 text-terminal-cyan">
              <a href="mailto:support@context8.io" className="hover:underline">support@context8.io</a>
              <span className="text-terminal-muted">•</span>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
