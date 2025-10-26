import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface TerminalOutputProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
}

export const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'text-terminal-text',
      success: 'text-terminal-green',
      error: 'text-terminal-red',
      warning: 'text-yellow-500',
      info: 'text-terminal-cyan'
    }

    return (
      <div
        ref={ref}
        className={cn('font-mono text-sm whitespace-pre-wrap', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TerminalOutput.displayName = 'TerminalOutput'
