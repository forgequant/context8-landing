import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CTAButton as CTAButtonType } from '@/lib/constants/types';
import { cn } from '@/lib/utils';

interface CTAButtonProps extends CTAButtonType {
  className?: string;
}

/**
 * Reusable CTA button component for landing page
 * Supports multiple variants, icons, and sizes
 * Uses shadcn/ui Button component under the hood
 */
export function CTAButton({
  text,
  href,
  variant,
  icon,
  size = 'md',
  ariaLabel,
  className,
}: CTAButtonProps) {
  const buttonVariant = {
    primary: 'default',
    secondary: 'secondary',
    ghost: 'ghost',
    outline: 'outline',
  }[variant] as 'default' | 'secondary' | 'ghost' | 'outline';

  const buttonSize = {
    sm: 'sm',
    md: 'default',
    lg: 'lg',
  }[size] as 'sm' | 'default' | 'lg';

  // Determine if link is external
  const isExternal = href.startsWith('http');

  const buttonContent = (
    <>
      {text}
      {icon === 'arrow-right' && <ArrowRight className="ml-2 h-4 w-4" />}
    </>
  );

  if (isExternal) {
    return (
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={className}
        aria-label={ariaLabel || text}
        asChild
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {buttonContent}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      className={className}
      aria-label={ariaLabel || text}
      asChild
    >
      <Link href={href}>{buttonContent}</Link>
    </Button>
  );
}
