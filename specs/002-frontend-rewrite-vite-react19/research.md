# Research: Context8 Landing Page - Modern Frontend Rewrite

**Feature**: 002-frontend-rewrite-vite-react19
**Date**: 2025-10-26
**Purpose**: Resolve technical unknowns and establish best practices for Vite + React 19 + Tailwind v4 + Framer Motion stack

## Phase 0: Technology Research & Best Practices

### 1. Vite 6.0+ Setup & Configuration

**Decision**: Use Vite 6.x with React template and TypeScript

**Rationale**:
- Vite 6.0 provides instant server start with ES modules (no bundling in dev)
- Hot Module Replacement (HMR) is significantly faster than webpack-based solutions
- Built-in TypeScript support without additional configuration
- Optimized production builds with Rollup under the hood
- Tree-shaking and code-splitting work out of the box

**Best Practices**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for React 19
      fastRefresh: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Enable minification
    minify: 'esbuild',
    // Generate sourcemaps for debugging
    sourcemap: false,
    // Chunk size warnings
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion']
        }
      }
    }
  }
})
```

**Alternatives Considered**:
- **Next.js**: Rejected due to unnecessary complexity for static site
- **Parcel**: Rejected due to less mature ecosystem and plugin support
- **webpack**: Rejected due to slower dev experience and configuration complexity

### 2. React 19 Features & Patterns

**Decision**: Use React 19 with modern patterns (hooks, function components, concurrent features)

**Rationale**:
- React 19 introduces improved concurrent rendering for smoother animations
- New `use` hook for async data loading (though not needed for mock data)
- Better TypeScript inference for props and state
- Automatic batching for all state updates improves performance
- Server Components support (not used in static site, but future-proof)

**Best Practices**:
- Use function components exclusively (no class components)
- Leverage hooks for state management (`useState`, `useEffect`, `useRef`)
- Extract custom hooks for reusable logic (`useTypewriter`, `useScrollReveal`)
- Use `React.memo()` for expensive components that re-render frequently
- Implement `useCallback` and `useMemo` judiciously (only when profiling shows benefit)

**Pattern Example**:
```typescript
// Custom hook for typewriter effect
function useTypewriter(text: string, speed: number = 30) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1))
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [displayText, text, speed])

  return { displayText, isComplete }
}
```

**Alternatives Considered**:
- **React 18**: Rejected to ensure we're using the latest features
- **Preact**: Rejected due to potential compatibility issues with Framer Motion

### 3. Tailwind CSS v4 Configuration

**Decision**: Use Tailwind CSS 4.x with JIT compiler and custom dark theme

**Rationale**:
- Tailwind v4 has improved performance with native CSS layer support
- JIT (Just-In-Time) compiler generates styles on-demand, reducing bundle size
- Built-in dark mode support with `class` strategy
- Custom design tokens can be defined in config for brand consistency
- Excellent IDE support with IntelliSense

**Configuration**:
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Use class-based dark mode (always dark for this project)
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0B0C0E', // Background
          900: '#121317',
          800: '#1A1C21'
        },
        terminal: {
          text: '#E6E8EC',      // Primary text
          muted: '#B1B5C1',     // Secondary text
          cyan: '#7DD3FC',      // Accent color
          green: '#4ADE80',     // Success/positive
          red: '#F87171'        // Error/negative
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
} satisfies Config
```

**Alternatives Considered**:
- **Vanilla CSS**: Rejected due to maintenance overhead and lack of utility-first benefits
- **CSS-in-JS (styled-components)**: Rejected due to runtime cost and bundle size impact
- **CSS Modules**: Rejected due to less productive workflow compared to utilities

### 4. Framer Motion Animation Patterns

**Decision**: Use Framer Motion 12.x for all animations with performance-conscious patterns

**Rationale**:
- Declarative animation syntax integrates seamlessly with React
- Hardware-accelerated transforms and opacity changes
- Built-in scroll-triggered animations with `useInView` hook
- Gesture support (drag, tap, hover) for interactive elements
- Excellent TypeScript support with typed variants

**Best Practices**:
- Animate only `transform` and `opacity` properties for 60fps performance
- Use `variants` for reusable animation definitions
- Implement `useReducedMotion` hook to respect accessibility preferences
- Leverage `useInView` for scroll-triggered animations (lazy animation)
- Use `layout` prop for automatic layout animations

**Pattern Example**:
```typescript
// Animation variants definition
const fadeInUpVariants = {
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

// Usage in component
function Section({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={prefersReducedMotion ? {} : fadeInUpVariants}
    >
      {children}
    </motion.section>
  )
}
```

**Performance Guidelines**:
- Avoid animating layout properties (`width`, `height`, `top`, `left`)
- Prefer `transform: translateY()` over `top` or `margin-top`
- Use `will-change` sparingly and only during animation
- Implement stagger delays for sequential animations (max 150ms between items)
- Disable animations when `prefers-reduced-motion: reduce` is set

**Alternatives Considered**:
- **React Spring**: Rejected due to steeper learning curve and less TypeScript support
- **GSAP**: Rejected due to licensing concerns (GreenSock license) and imperative API
- **CSS Animations**: Rejected due to lack of React integration and gesture support

### 5. TypeScript Configuration

**Decision**: Strict TypeScript with modern ESNext features

**Configuration**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Best Practices**:
- Enable `strict` mode for maximum type safety
- Use explicit return types for exported functions
- Leverage TypeScript's utility types (`Partial`, `Pick`, `Omit`, `Record`)
- Define component prop interfaces explicitly
- Avoid `any` type; use `unknown` when type is truly unknown

### 6. Performance Optimization Strategies

**Decision**: Implement aggressive code-splitting, lazy loading, and bundle optimization

**Strategies**:

1. **Code Splitting**:
   - Split vendor chunks (React, Framer Motion)
   - Lazy-load route components (if multi-page in future)
   - Dynamic imports for heavy components

2. **Image Optimization**:
   - Use WebP format with PNG fallback
   - Implement lazy loading for below-the-fold images
   - Responsive images with `srcset` and `sizes`

3. **Font Loading**:
   - Use `font-display: swap` to avoid FOIT (Flash of Invisible Text)
   - Subset fonts to include only used characters
   - Preload critical fonts in HTML `<head>`

4. **Bundle Size**:
   - Tree-shake unused code
   - Minify JavaScript and CSS
   - Gzip/Brotli compression on server
   - Target bundle size: <200KB gzipped

5. **Runtime Performance**:
   - Memoize expensive computations with `useMemo`
   - Debounce scroll event handlers
   - Use `requestAnimationFrame` for animation loops
   - Implement virtualization for long lists (not needed for landing page)

### 7. Accessibility (A11Y) Best Practices

**Decision**: Meet WCAG 2.1 AA standards with progressive enhancement

**Requirements**:
- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels for interactive elements without visible text
- Keyboard navigation for all interactive elements (Tab, Enter, Space)
- Focus indicators visible and high-contrast
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Respect `prefers-reduced-motion` for animations
- Skip-to-content link for keyboard users
- Alt text for all images

**Pattern Example**:
```typescript
// Accessible button with keyboard support
function Button({ children, onClick, ...props }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="focus:outline-none focus:ring-2 focus:ring-terminal-cyan"
      {...props}
    >
      {children}
    </button>
  )
}
```

### 8. Testing Strategy

**Decision**: Unit tests with Vitest, E2E tests with Playwright

**Rationale**:
- **Vitest**: Fast, Vite-native test runner with Jest-compatible API
- **Playwright**: Cross-browser E2E testing with excellent debugging tools
- **React Testing Library**: Component testing best practices (user-centric queries)

**Test Coverage Goals**:
- Unit tests: Custom hooks, utility functions, data transformations
- Component tests: User interactions, conditional rendering, accessibility
- E2E tests: Critical user journeys, responsive design, animation behavior

**Pattern Example**:
```typescript
// Unit test for useTypewriter hook
import { renderHook, act } from '@testing-library/react'
import { useTypewriter } from './useTypewriter'

describe('useTypewriter', () => {
  it('types text character by character', async () => {
    const { result } = renderHook(() => useTypewriter('Hello', 10))

    expect(result.current.displayText).toBe('')

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 60))
    })

    expect(result.current.displayText).toHaveLength(5)
    expect(result.current.isComplete).toBe(true)
  })
})
```

## Summary of Research Findings

| Area | Decision | Key Benefit |
|------|----------|-------------|
| Build Tool | Vite 6.x | Instant dev server, optimized builds |
| Framework | React 19 | Latest features, concurrent rendering |
| Styling | Tailwind CSS v4 | Utility-first, dark theme support |
| Animations | Framer Motion 12.x | Declarative, performant, accessible |
| TypeScript | Strict mode, ESNext | Type safety, better DX |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E |
| Performance | Code-splitting, lazy loading | <200KB bundle, <1.5s FCP |
| Accessibility | WCAG 2.1 AA, progressive enhancement | Inclusive, keyboard-friendly |

All technical unknowns have been resolved. Ready to proceed to Phase 1 (Design & Contracts).
