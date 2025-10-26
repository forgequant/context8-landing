# Animation Contracts: Context8 Landing Page

**Feature**: 002-frontend-rewrite-vite-react19
**Date**: 2025-10-26
**Purpose**: Define Framer Motion animation variants and accessibility requirements

## Overview

This document specifies all animation variants used throughout the Context8 landing page. All animations must respect the `prefers-reduced-motion` media query and maintain 60fps performance.

## Core Principles

1. **Performance First**: Only animate `transform` and `opacity` properties
2. **Accessibility**: Respect `prefers-reduced-motion: reduce`
3. **Consistency**: Use shared variants for common animations
4. **Subtlety**: Animations should enhance, not distract

## Animation Variants

### Fade In Animations

#### fadeInUp

**Purpose**: Element fades in while sliding up from below.

**Variant Definition**:
```typescript
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}
```

**Usage**:
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
>
  Content here
</motion.div>
```

**Performance**: Uses `transform: translateY()` (GPU-accelerated)

---

#### fadeIn

**Purpose**: Simple fade-in without movement.

**Variant Definition**:
```typescript
const fadeIn = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}
```

**Use Cases**: Subtle content reveals, overlay appearances

---

#### fadeInScale

**Purpose**: Element fades in while scaling from 95% to 100%.

**Variant Definition**:
```typescript
const fadeInScale = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]  // Custom cubic-bezier easing
    }
  }
}
```

**Use Cases**: Card animations, modal appearances

---

### Stagger Animations

#### staggerContainer

**Purpose**: Parent container that triggers staggered animations for children.

**Variant Definition**:
```typescript
const staggerContainer = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // 100ms between each child
      delayChildren: 0.2     // Wait 200ms before starting
    }
  }
}
```

**Usage**:
```tsx
<motion.ul
  initial="hidden"
  animate="visible"
  variants={staggerContainer}
>
  {items.map(item => (
    <motion.li key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

**Performance**: Children animate independently (no forced reflow)

---

#### staggerFast

**Purpose**: Faster stagger for long lists (50ms between items).

**Variant Definition**:
```typescript
const staggerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}
```

**Use Cases**: Feature lists, pricing tables with many rows

---

### Slide Animations

#### slideInLeft

**Purpose**: Element slides in from the left.

**Variant Definition**:
```typescript
const slideInLeft = {
  hidden: {
    x: -50,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}
```

**Use Cases**: Side-by-side content reveals (architecture diagram)

---

#### slideInRight

**Purpose**: Element slides in from the right.

**Variant Definition**:
```typescript
const slideInRight = {
  hidden: {
    x: 50,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}
```

**Use Cases**: Alternating content sections

---

### Scale Animations

#### scaleIn

**Purpose**: Element scales from 0% to 100% with spring physics.

**Variant Definition**:
```typescript
const scaleIn = {
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 1
    }
  }
}
```

**Use Cases**: Icon appearances, badge reveals, check marks

---

#### pulseScale

**Purpose**: Subtle pulsing animation (loop).

**Variant Definition**:
```typescript
const pulseScale = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}
```

**Use Cases**: CTA buttons, "New" badges (use sparingly)

---

### Typewriter Animations

#### typewriterCursor

**Purpose**: Blinking cursor animation.

**Variant Definition**:
```typescript
const typewriterCursor = {
  blink: {
    opacity: [1, 0, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'steps(2, end)'  // Step animation for sharp transitions
    }
  }
}
```

**CSS Alternative** (better performance for simple blink):
```css
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor {
  animation: cursor-blink 1s step-end infinite;
}
```

---

## Accessibility Integration

### useReducedMotion Hook

**Purpose**: Detect if user prefers reduced motion and disable animations.

**Implementation**:
```typescript
import { useEffect, useState } from 'react'

function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
```

**Usage**:
```tsx
function AnimatedSection({ children }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? {} : fadeInUp}
    >
      {children}
    </motion.div>
  )
}
```

---

## Scroll-Triggered Animations

### useInView Hook

**Purpose**: Trigger animations when element enters viewport.

**Implementation**:
```typescript
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function ScrollRevealSection({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,        // Animate only once
    margin: '-100px'   // Start animation 100px before entering viewport
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  )
}
```

---

## Performance Guidelines

### Do's ✅

- **Animate transform and opacity only**
  - `translateX/Y/Z`, `scale`, `rotate`, `opacity`
- **Use GPU acceleration**
  - Properties above are GPU-accelerated
- **Apply will-change sparingly**
  - Only during animation, remove after
- **Use CSS animations for simple loops**
  - Blinking cursors, subtle pulses
- **Implement stagger carefully**
  - Max 10-15 items, max 150ms delay between items

### Don'ts ❌

- **Don't animate layout properties**
  - Avoid: `width`, `height`, `top`, `left`, `margin`, `padding`
  - These trigger reflow/repaint (expensive)
- **Don't use infinite loops carelessly**
  - Infinite animations consume battery on mobile
- **Don't ignore prefers-reduced-motion**
  - Legal requirement (WCAG 2.1)
- **Don't animate too many elements at once**
  - Limit concurrent animations to 3-5 elements
- **Don't use heavy easing functions**
  - Stick to `easeOut`, `easeInOut`, or `linear`

---

## Timing Standards

| Animation Type | Duration | Easing | Use Case |
|----------------|----------|--------|----------|
| Micro-interactions | 150-250ms | easeOut | Hover states, focus |
| Entrance animations | 400-600ms | easeOut | Fade-in, slide-in |
| Exit animations | 200-300ms | easeIn | Modal close, toast dismiss |
| Stagger delay | 50-150ms | N/A | Sequential reveals |
| Page transitions | 600-800ms | easeInOut | Route changes (if applicable) |

---

## Variant Export Pattern

All animation variants should be exported from a central file for consistency:

```typescript
// src/lib/animations.ts
export const animations = {
  fadeIn,
  fadeInUp,
  fadeInScale,
  slideInLeft,
  slideInRight,
  scaleIn,
  pulseScale,
  staggerContainer,
  staggerFast,
  typewriterCursor
}

// Usage in components
import { animations } from '@/lib/animations'

<motion.div variants={animations.fadeInUp}>
  Content
</motion.div>
```

---

## Testing Animations

### Manual Testing Checklist

- [ ] Animations run at 60fps (check DevTools Performance tab)
- [ ] No jank or stuttering during scroll
- [ ] `prefers-reduced-motion` disables animations
- [ ] Animations complete even if user scrolls quickly
- [ ] No layout shifts (CLS score < 0.1)
- [ ] Touch interactions work smoothly on mobile
- [ ] Animations don't block user interaction

### Automated Testing

```typescript
// Test that component respects prefers-reduced-motion
import { render } from '@testing-library/react'
import { mockMatchMedia } from '@/test-utils'

describe('AnimatedComponent', () => {
  it('disables animations when prefers-reduced-motion is set', () => {
    mockMatchMedia('(prefers-reduced-motion: reduce)', true)
    const { container } = render(<AnimatedComponent />)

    // Assert no animation classes are applied
    expect(container.querySelector('[style*="transition"]')).toBeNull()
  })
})
```

---

## Summary

All animations follow these principles:
1. **Performance**: GPU-accelerated properties only
2. **Accessibility**: Respect `prefers-reduced-motion`
3. **Consistency**: Shared variants for common patterns
4. **Subtlety**: Enhance UX without distraction
5. **Measurability**: 60fps target, <0.1 CLS score

Animation variants are centralized in `/src/lib/animations.ts` for reusability and consistency across the application.
