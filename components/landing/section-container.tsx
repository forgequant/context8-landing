import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  size?: 'default' | 'narrow' | 'wide';
  spacing?: 'default' | 'compact' | 'spacious';
}

/**
 * Base section container component for landing page sections
 * Provides consistent spacing, max-width, and responsive padding
 */
export function SectionContainer({
  children,
  className,
  id,
  size = 'default',
  spacing = 'default',
}: SectionContainerProps) {
  const maxWidthClass = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-full',
  }[size];

  const spacingClass = {
    compact: 'py-8',
    default: 'py-16',
    spacious: 'py-24',
  }[spacing];

  return (
    <section
      id={id}
      className={cn(spacingClass, 'px-4 sm:px-6 lg:px-8', className)}
    >
      <div className={cn('mx-auto', maxWidthClass)}>{children}</div>
    </section>
  );
}
