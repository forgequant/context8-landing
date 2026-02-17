import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-terminal-cyan focus:ring-offset-2 focus:ring-offset-graphite-950'

    const variantStyles = {
      primary: 'bg-terminal-cyan text-graphite-950 hover:bg-terminal-cyan/90 active:bg-terminal-cyan/80',
      secondary: 'bg-terminal-green text-graphite-950 hover:bg-terminal-green/90 active:bg-terminal-green/80',
      outline: 'border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/10 active:bg-terminal-cyan/20',
      ghost: 'text-terminal-text hover:bg-graphite-800 active:bg-graphite-700'
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
