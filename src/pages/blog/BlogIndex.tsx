import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const articles = [
  {
    slug: 'what-is-mcp',
    title: 'What is MCP (Model Context Protocol)? A Complete Guide',
    description: 'Learn how MCP enables AI assistants to securely connect to external data sources and why it matters for developers.',
    publishedAt: 'Dec 4, 2025',
    readTime: '8 min'
  },
  {
    slug: 'ai-crypto-data-integration',
    title: 'How to Connect Your AI to Real-Time Crypto Data',
    description: 'Step-by-step guide to giving your AI assistant access to live market prices, volume, and sentiment data.',
    publishedAt: 'Dec 4, 2025',
    readTime: '6 min'
  },
  {
    slug: 'mcp-vs-rest-api',
    title: 'MCP vs REST API: Which is Better for AI Integration?',
    description: 'Comparing Model Context Protocol with traditional REST APIs for building AI-powered applications.',
    publishedAt: 'Dec 4, 2025',
    readTime: '7 min'
  }
]

export function BlogIndex() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link to="/" className="text-lg font-extrabold tracking-tight flex items-center gap-2">
          <span className="text-terminal-cyan font-mono text-sm">&#9670;</span>
          <span>Context8</span>
        </Link>
        <Link
          to="/"
          className="text-sm text-terminal-muted hover:text-terminal-text transition-colors font-mono"
        >
          ← Back to home
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-terminal-text mb-4">
            Blog
          </h1>
          <p className="text-lg text-terminal-muted">
            Guides, tutorials, and insights about MCP, AI integration, and crypto data.
          </p>
        </motion.div>

        <div className="space-y-6">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className="block p-6 rounded-xl bg-graphite-900 border border-graphite-800 hover:border-terminal-cyan/30 transition-all group"
              >
                <div className="flex items-center gap-4 text-sm text-terminal-muted mb-3 font-mono">
                  <time>{article.publishedAt}</time>
                  <span>•</span>
                  <span>{article.readTime} read</span>
                </div>
                <h2 className="text-xl font-semibold text-terminal-text mb-2 group-hover:text-terminal-cyan transition-colors">
                  {article.title}
                </h2>
                <p className="text-terminal-muted">
                  {article.description}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-8 border-t border-graphite-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-terminal-muted">
          <span>© 2025 Context8</span>
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-terminal-text transition-colors">Home</Link>
            <a href="#" className="hover:text-terminal-text transition-colors">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
