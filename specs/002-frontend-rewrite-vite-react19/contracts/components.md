# Component Contracts: Context8 Landing Page

**Feature**: 002-frontend-rewrite-vite-react19
**Date**: 2025-10-26
**Purpose**: Define component interfaces, props, and API contracts

## Overview

This document specifies the public API for all reusable components in the Context8 landing page. Each component contract includes:
- Component purpose and responsibility
- Props interface with types and default values
- Usage examples
- Accessibility requirements
- Performance considerations

## Terminal Components

### TypeWriter

**Purpose**: Renders text with typewriter animation effect, typing one character at a time.

**Props Interface**:
```typescript
interface TypeWriterProps {
  text: string                    // REQUIRED: Text to type out
  speed?: number                  // Optional: ms per character (default: 30)
  onComplete?: () => void         // Optional: Callback when typing finishes
  cursor?: boolean                // Optional: Show blinking cursor (default: true)
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<TypeWriter
  text="CONTEXT8 — REAL-TIME CRYPTO CONTEXT SERVER"
  speed={25}
  onComplete={() => console.log('Typing complete')}
  className="text-4xl font-mono text-terminal-text"
/>
```

**Accessibility**:
- Respect `prefers-reduced-motion` - instantly show full text if user prefers reduced motion
- Ensure text is readable with sufficient color contrast (4.5:1 minimum)

**Performance**:
- Use `requestAnimationFrame` or `setTimeout` for animation loop
- Clean up timers on component unmount

---

### Cursor

**Purpose**: Renders a blinking cursor character (▌).

**Props Interface**:
```typescript
interface CursorProps {
  blinking?: boolean              // Optional: Enable blinking animation (default: true)
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<Cursor blinking={true} className="text-terminal-cyan" />
```

**Accessibility**:
- Disable blinking if `prefers-reduced-motion: reduce`
- Use ARIA hidden if purely decorative: `aria-hidden="true"`

---

### TerminalWindow

**Purpose**: Wraps content in a terminal-style container with optional header and command prompt.

**Props Interface**:
```typescript
interface TerminalWindowProps {
  children: React.ReactNode       // REQUIRED: Terminal content
  title?: string                  // Optional: Terminal window title (e.g., "context8-terminal")
  showHeader?: boolean            // Optional: Show terminal header bar (default: true)
  prompt?: string                 // Optional: Command prompt (e.g., "$ ")
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<TerminalWindow title="context8-server" showHeader={true} prompt="$ ">
  <TypeWriter text="context8 connect --mcp chatgpt" />
</TerminalWindow>
```

**Accessibility**:
- Use semantic HTML (`<pre>` for code content)
- Add `role="region"` and `aria-label` for screen readers

---

## Code Components

### CodeBlock

**Purpose**: Displays syntax-highlighted code with optional title and line numbers.

**Props Interface**:
```typescript
interface CodeBlockProps {
  code: string                    // REQUIRED: Code content (multi-line string)
  language: string                // REQUIRED: Syntax language (yaml, typescript, bash, etc.)
  title?: string                  // Optional: Title above code block
  showLineNumbers?: boolean       // Optional: Display line numbers (default: false)
  highlightLines?: number[]       // Optional: Line numbers to highlight (e.g., [1, 5, 10])
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<CodeBlock
  language="yaml"
  title="MCP Configuration"
  code={`servers:
  context8:
    transport: https
    url: https://api.context8.markets/mcp`}
  showLineNumbers={true}
  highlightLines={[3]}
/>
```

**Accessibility**:
- Ensure sufficient color contrast for syntax highlighting
- Provide keyboard-accessible copy button
- Use `<pre><code>` semantic HTML

**Performance**:
- Consider lazy-loading syntax highlighting library
- Memoize highlighted output with `useMemo`

---

### ASCIIDiagram

**Purpose**: Renders ASCII art diagrams with proper formatting and optional caption.

**Props Interface**:
```typescript
interface ASCIIDiagramProps {
  content: string                 // REQUIRED: ASCII art content (multi-line string)
  title?: string                  // Optional: Diagram title
  description?: string            // Optional: Caption/explanation
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<ASCIIDiagram
  title="Architecture Overview"
  description="Data flows from sources through MCP server to your AI"
  content={`[Binance]  [CoinGecko]  [On-Chain]
       \\         |            /
           [ Context8 MCP ]
                 |
             [ Your AI ]`}
/>
```

**Accessibility**:
- Provide `alt` text or `aria-label` describing the diagram structure
- Consider supplementing with a text-based explanation

---

## UI Components

### LivePriceWidget

**Purpose**: Displays animated cryptocurrency price tickers with real-time updates (mock data).

**Props Interface**:
```typescript
interface LivePriceWidgetProps {
  prices: CryptoPrice[]           // REQUIRED: Array of crypto prices
  updateInterval?: number         // Optional: Update frequency in ms (default: 5000)
  showChange?: boolean            // Optional: Display 24h change (default: true)
  compact?: boolean               // Optional: Compact layout for mobile (default: false)
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<LivePriceWidget
  prices={mockPrices}
  updateInterval={5000}
  showChange={true}
  className="bg-graphite-900 border-b border-terminal-cyan/20"
/>
```

**Accessibility**:
- Use `aria-live="polite"` for price updates
- Ensure color alone isn't used to convey positive/negative change (use + / - symbols)

**Performance**:
- Use `useCallback` for update logic
- Implement smooth fade transitions (not jarring jumps)
- Clean up interval on unmount

---

### ScrollReveal

**Purpose**: Wrapper component that fades in children when scrolled into view.

**Props Interface**:
```typescript
interface ScrollRevealProps {
  children: React.ReactNode       // REQUIRED: Content to reveal
  direction?: 'up' | 'down' | 'left' | 'right'  // Optional: Slide direction (default: 'up')
  delay?: number                  // Optional: Animation delay in seconds (default: 0)
  once?: boolean                  // Optional: Animate only once (default: true)
  threshold?: number              // Optional: Intersection threshold 0-1 (default: 0.1)
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<ScrollReveal direction="up" delay={0.2} once={true}>
  <FeaturesSection />
</ScrollReveal>
```

**Accessibility**:
- Respect `prefers-reduced-motion` - skip animation if user prefers reduced motion
- Ensure content is still visible/accessible if JavaScript fails

**Performance**:
- Use `IntersectionObserver` API (efficient scroll detection)
- Disconnect observer after animation completes (if `once={true}`)

---

### AnimatedList

**Purpose**: Renders list items with staggered fade-in animations.

**Props Interface**:
```typescript
interface AnimatedListProps {
  items: React.ReactNode[]        // REQUIRED: Array of list items
  staggerDelay?: number           // Optional: ms between item animations (default: 100)
  direction?: 'up' | 'down'       // Optional: Slide direction (default: 'up')
  className?: string              // Optional: Additional Tailwind classes
  itemClassName?: string          // Optional: Classes for each item
}
```

**Usage Example**:
```tsx
<AnimatedList
  items={features.map(f => <FeatureItem key={f.id} {...f} />)}
  staggerDelay={150}
  direction="up"
/>
```

**Accessibility**:
- Use semantic list elements (`<ul>`, `<ol>`, `<li>`)
- Disable stagger animation if `prefers-reduced-motion`

---

### Button

**Purpose**: Styled button component with consistent styling and accessibility.

**Props Interface**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'  // Button style variant
  size?: 'sm' | 'md' | 'lg'                                // Button size
  children: React.ReactNode                                // Button content
  className?: string                                       // Additional Tailwind classes
  asChild?: boolean                                        // Render as child element (for links)
}
```

**Usage Example**:
```tsx
<Button variant="primary" size="lg" onClick={handleSignup}>
  Start Free (OAuth)
</Button>

<Button variant="outline" size="md" asChild>
  <a href="/docs">Read Docs</a>
</Button>
```

**Accessibility**:
- Focus visible with high-contrast ring
- Keyboard accessible (Enter/Space)
- Minimum touch target size: 44x44px (mobile)

---

## Section Components

### HeroSection

**Purpose**: Main hero section with terminal-style typewriter animation.

**Props Interface**:
```typescript
interface HeroSectionProps {
  title: string                   // REQUIRED: Main headline (types out)
  subtitle?: string               // Optional: Subheadline
  ctaText?: string                // Optional: CTA button text
  ctaLink?: string                // Optional: CTA button destination
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<HeroSection
  title="CONTEXT8 — REAL-TIME CRYPTO CONTEXT SERVER"
  subtitle="LLM-ready, minimal, deterministic. Plug one URL."
  ctaText="Start free (OAuth)"
  ctaLink="/auth/login"
/>
```

---

### FeaturesSection

**Purpose**: Displays animated checklist of Context8 features.

**Props Interface**:
```typescript
interface FeaturesSectionProps {
  features: Feature[]             // REQUIRED: Array of features to display
  title?: string                  // Optional: Section title
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<FeaturesSection
  title="Features"
  features={features}
/>
```

---

### PricingSection

**Purpose**: Pricing comparison table (Free vs Pro).

**Props Interface**:
```typescript
interface PricingSectionProps {
  tiers: PricingTier[]            // REQUIRED: Pricing tiers
  title?: string                  // Optional: Section title
  subtitle?: string               // Optional: Section subtitle
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<PricingSection
  title="Pricing"
  subtitle="Free — core prices (Binance), basic limits | Pro — $29/mo — full sources"
  tiers={pricingTiers}
/>
```

---

## Layout Components

### Page

**Purpose**: Root page wrapper with consistent layout and dark theme.

**Props Interface**:
```typescript
interface PageProps {
  children: React.ReactNode       // REQUIRED: Page content
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<Page>
  <HeroSection {...heroProps} />
  <FeaturesSection {...featuresProps} />
  <PricingSection {...pricingProps} />
</Page>
```

---

### Section

**Purpose**: Section container with consistent spacing and background variants.

**Props Interface**:
```typescript
interface SectionProps {
  children: React.ReactNode       // REQUIRED: Section content
  id?: string                     // Optional: HTML id for anchor links
  background?: 'default' | 'elevated'  // Optional: Background variant
  className?: string              // Optional: Additional Tailwind classes
}
```

**Usage Example**:
```tsx
<Section id="features" background="elevated">
  <h2>Features</h2>
  <FeaturesList />
</Section>
```

---

## Component API Summary

| Component | Required Props | Optional Props | Key Feature |
|-----------|---------------|----------------|-------------|
| TypeWriter | `text` | `speed`, `onComplete`, `cursor` | Character-by-character typing |
| Cursor | None | `blinking` | Animated blinking cursor |
| TerminalWindow | `children` | `title`, `showHeader`, `prompt` | Terminal container |
| CodeBlock | `code`, `language` | `title`, `showLineNumbers`, `highlightLines` | Syntax highlighting |
| ASCIIDiagram | `content` | `title`, `description` | ASCII art display |
| LivePriceWidget | `prices` | `updateInterval`, `showChange`, `compact` | Animated price tickers |
| ScrollReveal | `children` | `direction`, `delay`, `once`, `threshold` | Scroll-triggered animation |
| AnimatedList | `items` | `staggerDelay`, `direction` | Staggered list animations |
| Button | `children` | `variant`, `size`, `asChild` | Consistent button styling |
| HeroSection | `title` | `subtitle`, `ctaText`, `ctaLink` | Terminal hero animation |
| FeaturesSection | `features` | `title` | Feature checklist |
| PricingSection | `tiers` | `title`, `subtitle` | Pricing table |
| Page | `children` | None | Root page wrapper |
| Section | `children` | `id`, `background` | Section container |

All components support `className` prop for extending Tailwind styles.
