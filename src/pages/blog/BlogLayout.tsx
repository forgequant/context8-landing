import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface BlogLayoutProps {
  children: ReactNode
  title: string
  description: string
  publishedAt: string
  readTime: string
}

export function BlogLayout({ children, title, description, publishedAt, readTime }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text">
      <header className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link to="/" className="text-lg font-extrabold tracking-tight flex items-center gap-2">
          <span className="text-terminal-cyan font-mono text-sm">&#9670;</span>
          <span>Context8</span>
        </Link>
        <Link
          to="/blog"
          className="text-sm text-terminal-muted hover:text-terminal-text transition-colors font-mono"
        >
          ← All articles
        </Link>
      </header>

      <article className="max-w-4xl mx-auto px-6 pb-16">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 text-sm text-terminal-muted mb-4 font-mono">
            <time>{publishedAt}</time>
            <span>•</span>
            <span>{readTime} read</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-terminal-text mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-terminal-muted">
            {description}
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-terminal max-w-none"
        >
          {children}
        </motion.div>
      </article>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-2xl bg-graphite-900 border border-graphite-800 text-center">
          <h3 className="text-xl font-semibold text-terminal-text mb-3">
            Ready to try Context8?
          </h3>
          <p className="text-terminal-muted mb-6">
            Connect your AI to real-time crypto data in under 60 seconds.
          </p>
          <Link
            to="/auth"
            className="inline-block bg-terminal-cyan text-graphite-950 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-terminal-cyan/90 transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="max-w-4xl mx-auto px-6 py-8 border-t border-graphite-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-terminal-muted">
          <span>© 2025 Context8</span>
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-terminal-text transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-terminal-text transition-colors">Blog</Link>
            <a href="#" className="hover:text-terminal-text transition-colors">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
