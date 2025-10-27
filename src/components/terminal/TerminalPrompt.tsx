import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface TerminalPromptProps extends HTMLAttributes<HTMLDivElement> {
  user?: string
  path?: string
  showCursor?: boolean
}

export const TerminalPrompt = forwardRef<HTMLDivElement, TerminalPromptProps>(
  ({ className, user = 'user', path = '~', showCursor = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start gap-2 font-mono', className)}
        {...props}
      >
        <span className="text-terminal-green select-none">
          {user}@context8
        </span>
        <span className="text-terminal-muted select-none">:</span>
        <span className="text-terminal-cyan select-none">{path}</span>
        <span className="text-terminal-muted select-none">$</span>
        <span className="text-terminal-text flex-1">
          {children}
          {showCursor && (
            <span className="inline-block w-2 h-4 bg-terminal-cyan ml-1 animate-cursor-blink" aria-hidden="true" />
          )}
        </span>
      </div>
    )
  }
)

TerminalPrompt.displayName = 'TerminalPrompt'
