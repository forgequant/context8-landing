'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  once?: boolean;
}

/**
 * Scroll Reveal Component
 *
 * Wraps content with scroll-triggered animations
 * Automatically triggers animation when element enters viewport
 *
 * @param children - Content to animate
 * @param className - Additional CSS classes
 * @param delay - Animation delay in seconds (default: 0)
 * @param direction - Animation direction (default: 'up')
 * @param duration - Animation duration in seconds (default: 0.6)
 * @param once - Animate only once (default: true)
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
    none: {},
  };

  const initial = {
    opacity: 0,
    ...directionOffset[direction],
  };

  const animate = isInView
    ? {
        opacity: 1,
        x: 0,
        y: 0,
      }
    : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
