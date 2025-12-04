import { BlogLayout } from '../BlogLayout'

export function WhatIsMcp() {
  return (
    <BlogLayout
      title="What is MCP (Model Context Protocol)? A Complete Guide"
      description="Learn how MCP enables AI assistants to securely connect to external data sources and why it matters for developers."
      publishedAt="Dec 4, 2025"
      readTime="8 min"
    >
      <p className="text-lg text-terminal-muted leading-relaxed mb-8">
        Model Context Protocol (MCP) is an open standard that allows AI assistants like Claude, GPT, and others to securely connect to external data sources. Think of it as a universal adapter that lets your AI talk to databases, APIs, and services without exposing credentials or compromising security.
      </p>

      <h2 className="text-2xl font-semibold text-terminal-text mt-12 mb-4">
        Why MCP Matters
      </h2>
      <p className="text-terminal-muted leading-relaxed mb-6">
        Before MCP, connecting an AI to external data required custom integrations, API wrappers, and constant maintenance. Each AI client needed its own implementation, and developers had to handle authentication, rate limiting, and data formatting separately.
      </p>
      <p className="text-terminal-muted leading-relaxed mb-6">
        MCP standardizes this. One protocol, many clients. Write your integration once, and it works with Claude Desktop, Cursor, and any other MCP-compatible client.
      </p>

      <h2 className="text-2xl font-semibold text-terminal-text mt-12 mb-4">
        How MCP Works
      </h2>
      <p className="text-terminal-muted leading-relaxed mb-6">
        MCP operates on a client-server model:
      </p>
      <ul className="list-none space-y-3 mb-6">
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan mt-1">1.</span>
          <span><strong className="text-terminal-text">MCP Server</strong> — Exposes data or functionality (like Context8 for crypto data)</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan mt-1">2.</span>
          <span><strong className="text-terminal-text">MCP Client</strong> — The AI application that consumes the data (Claude, Cursor, etc.)</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan mt-1">3.</span>
          <span><strong className="text-terminal-text">Protocol</strong> — Standardized communication format between them</span>
        </li>
      </ul>
      <p className="text-terminal-muted leading-relaxed mb-6">
        When you ask Claude "What's the current BTC price?", the MCP client recognizes this needs external data, calls the appropriate MCP server, and incorporates the response into the AI's answer.
      </p>

      <h2 className="text-2xl font-semibold text-terminal-text mt-12 mb-4">
        MCP vs Traditional APIs
      </h2>
      <div className="bg-graphite-900 rounded-xl border border-graphite-800 p-6 mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-graphite-800">
              <th className="text-left py-3 text-terminal-text">Feature</th>
              <th className="text-left py-3 text-terminal-text">MCP</th>
              <th className="text-left py-3 text-terminal-text">REST API</th>
            </tr>
          </thead>
          <tbody className="text-terminal-muted">
            <tr className="border-b border-graphite-800">
              <td className="py-3">AI-native</td>
              <td className="py-3 text-terminal-green">Yes</td>
              <td className="py-3 text-terminal-muted">No</td>
            </tr>
            <tr className="border-b border-graphite-800">
              <td className="py-3">Authentication</td>
              <td className="py-3">OAuth built-in</td>
              <td className="py-3">Custom per API</td>
            </tr>
            <tr className="border-b border-graphite-800">
              <td className="py-3">Context awareness</td>
              <td className="py-3 text-terminal-green">Yes</td>
              <td className="py-3 text-terminal-muted">No</td>
            </tr>
            <tr>
              <td className="py-3">Cross-client</td>
              <td className="py-3 text-terminal-green">Universal</td>
              <td className="py-3">Requires wrappers</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-terminal-text mt-12 mb-4">
        Getting Started with MCP
      </h2>
      <p className="text-terminal-muted leading-relaxed mb-6">
        To use an MCP server, you need:
      </p>
      <ol className="list-none space-y-3 mb-6">
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan font-mono">01</span>
          <span>An MCP-compatible client (Claude Desktop, Cursor, etc.)</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan font-mono">02</span>
          <span>The MCP server URL (e.g., <code className="text-terminal-cyan bg-graphite-900 px-1.5 py-0.5 rounded">https://api.context8.markets</code>)</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan font-mono">03</span>
          <span>OAuth authentication (usually Google or GitHub)</span>
        </li>
      </ol>

      <div className="bg-graphite-900 rounded-xl border border-graphite-800 overflow-hidden mb-6">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-graphite-800 bg-graphite-900/50">
          <span className="w-3 h-3 rounded-full bg-terminal-red/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-terminal-green/60" />
          <span className="text-xs text-terminal-muted ml-2">mcp-config.json</span>
        </div>
        <pre className="p-6 text-sm overflow-x-auto">
          <code className="text-terminal-muted">
{`{
  "servers": {
    "context8": {
      "url": "https://api.context8.markets",
      "auth": "oauth"
    }
  }
}`}
          </code>
        </pre>
      </div>

      <h2 className="text-2xl font-semibold text-terminal-text mt-12 mb-4">
        Use Cases for MCP
      </h2>
      <p className="text-terminal-muted leading-relaxed mb-6">
        MCP shines in scenarios where AI needs real-time or specialized data:
      </p>
      <ul className="list-none space-y-3 mb-6">
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-green">•</span>
          <span><strong className="text-terminal-text">Market data</strong> — Real-time prices, volume, sentiment for crypto/stocks</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-green">•</span>
          <span><strong className="text-terminal-text">Documentation</strong> — Up-to-date docs that change frequently</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-green">•</span>
          <span><strong className="text-terminal-text">Internal tools</strong> — Company databases, CRMs, analytics</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-green">•</span>
          <span><strong className="text-terminal-text">Code repositories</strong> — Live codebase context for development</span>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-terminal-text mt-12 mb-4">
        Security Considerations
      </h2>
      <p className="text-terminal-muted leading-relaxed mb-6">
        MCP was designed with security in mind:
      </p>
      <ul className="list-none space-y-3 mb-6">
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan">→</span>
          <span><strong className="text-terminal-text">OAuth-first</strong> — No API keys stored in configs</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan">→</span>
          <span><strong className="text-terminal-text">Scoped access</strong> — Servers define what data they expose</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan">→</span>
          <span><strong className="text-terminal-text">Rate limiting</strong> — Built into the protocol</span>
        </li>
        <li className="flex items-start gap-3 text-terminal-muted">
          <span className="text-terminal-cyan">→</span>
          <span><strong className="text-terminal-text">Audit logging</strong> — Track what data AI accessed</span>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-terminal-text mt-12 mb-4">
        The Future of MCP
      </h2>
      <p className="text-terminal-muted leading-relaxed mb-6">
        As AI assistants become more prevalent, the need for standardized data access grows. MCP is positioned to become the USB of AI integrations — a universal standard that just works.
      </p>
      <p className="text-terminal-muted leading-relaxed mb-6">
        Major players are already adopting it. Anthropic's Claude uses MCP natively. Development tools like Cursor support it. And the ecosystem of MCP servers is expanding rapidly.
      </p>

      <div className="bg-graphite-900/50 rounded-xl border border-terminal-cyan/20 p-6 mt-12">
        <h3 className="text-lg font-semibold text-terminal-text mb-2">
          TL;DR
        </h3>
        <p className="text-terminal-muted">
          MCP is an open protocol that lets AI assistants securely access external data. It's like OAuth for AI — standardized, secure, and universal. If you're building AI-powered applications that need real-time data, MCP is the way to go.
        </p>
      </div>
    </BlogLayout>
  )
}
