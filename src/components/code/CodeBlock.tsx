import { HTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/cn'

interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  code: string
  language?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
}

export const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(
  ({
    className,
    code,
    language = 'python',
    showLineNumbers = true,
    showCopyButton = true,
    ...props
  }, ref) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    const lines = code.split('\n')

    return (
      <div className="relative group">
        <div className="bg-graphite-950 border border-graphite-800 border-b-0 rounded-t-lg px-4 py-2 flex items-center justify-between">
          <span className="text-terminal-muted text-sm font-mono">{language}</span>
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="text-terminal-muted hover:text-terminal-cyan transition-colors text-sm font-mono"
              aria-label="Copy code"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
        </div>

        <pre
          ref={ref}
          className={cn(
            'bg-graphite-900 border border-graphite-800 rounded-b-lg p-4 overflow-x-auto font-mono text-sm',
            className
          )}
          {...props}
        >
          <code className="text-terminal-text">
            {showLineNumbers ? (
              <div className="table">
                {lines.map((line, index) => (
                  <div key={index} className="table-row">
                    <span className="table-cell text-terminal-muted select-none pr-4 text-right">
                      {String(index + 1).padStart(2, ' ')}
                    </span>
                    <span className="table-cell">
                      {line || '\n'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    )
  }
)

CodeBlock.displayName = 'CodeBlock'
