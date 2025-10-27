import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface TerminalWindowProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  showControls?: boolean
}

export const TerminalWindow = forwardRef<HTMLDivElement, TerminalWindowProps>(
  ({ className, title = 'context8-terminal', showControls = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden shadow-lg',
          className
        )}
        {...props}
      >
        {/* Terminal header */}
        <div className="bg-graphite-950 border-b border-graphite-800 px-4 py-2 flex items-center gap-3">
          {showControls && (
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-terminal-red" aria-hidden="true" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true" />
              <div className="w-3 h-3 rounded-full bg-terminal-green" aria-hidden="true" />
            </div>
          )}
          <span className="text-terminal-muted text-sm font-mono">{title}</span>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm">
          {children}
        </div>
      </div>
    )
  }
)

TerminalWindow.displayName = 'TerminalWindow'
