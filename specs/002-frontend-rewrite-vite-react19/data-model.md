# Data Model: Context8 Landing Page

**Feature**: 002-frontend-rewrite-vite-react19
**Date**: 2025-10-26
**Purpose**: Define data structures, component interfaces, and state management for the landing page

## Overview

This document defines the TypeScript interfaces and data structures used throughout the landing page. Since this is a static site with mock data, there are no database schemas or API contracts—only in-memory data structures.

## Core Data Structures

### 1. Mock Price Data

Represents cryptocurrency market prices for the live price widget.

```typescript
interface CryptoPrice {
  symbol: string          // e.g., "BTC", "ETH", "SOL"
  name: string            // e.g., "Bitcoin", "Ethereum"
  price: number           // Current price in USD
  change24h: number       // 24-hour price change percentage (-100 to +∞)
  lastUpdate: Date        // Timestamp of last mock update
}

// Example data
const mockPrices: CryptoPrice[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67345.00,
    change24h: 3.2,
    lastUpdate: new Date('2025-10-26T14:35:00Z')
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3210.50,
    change24h: 0.8,
    lastUpdate: new Date('2025-10-26T14:35:00Z')
  }
]
```

**Validation Rules**:
- `symbol` must be uppercase, 2-5 characters
- `price` must be positive number
- `change24h` can be negative (price drop) or positive (price increase)
- `lastUpdate` must be valid ISO8601 date

### 2. Feature Metadata

Represents each Context8 feature displayed in the features section.

```typescript
interface Feature {
  id: string              // Unique identifier (kebab-case)
  title: string           // Feature name (e.g., "Live price feeds")
  description: string     // Short description (max 100 chars)
  tier: 'free' | 'pro'    // Availability tier
  icon?: string           // Optional emoji or icon identifier
}

// Example data
const features: Feature[] = [
  {
    id: 'live-price-feeds',
    title: 'Live price feeds',
    description: 'Real-time cryptocurrency prices from Binance and CoinGecko',
    tier: 'free',
    icon: '📊'
  },
  {
    id: 'on-chain-metrics',
    title: 'On-chain metrics',
    description: 'Network activity, addresses, transaction volume, gas fees',
    tier: 'pro',
    icon: '⛓️'
  }
]
```

**Validation Rules**:
- `id` must be unique, kebab-case format
- `title` max 50 characters
- `description` max 100 characters
- `tier` must be either 'free' or 'pro'

### 3. Pricing Tier

Represents subscription plan details for the pricing comparison table.

```typescript
interface PricingTier {
  id: 'free' | 'pro'              // Plan identifier
  name: string                    // Display name
  price: number                   // Monthly price in USD (0 for free)
  currency: string                // Currency code (e.g., "USD")
  requestsPerDay: number          // Daily request limit
  supportLevel: string            // Support type (e.g., "community", "priority")
  features: PricingFeature[]      // List of included features
  ctaText: string                 // Call-to-action button text
  ctaLink: string                 // CTA button destination URL
  highlighted?: boolean           // Whether to visually highlight this tier
}

interface PricingFeature {
  text: string                    // Feature description
  included: boolean               // Whether feature is included
  tooltip?: string                // Optional explanation tooltip
}

// Example data
const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    requestsPerDay: 100,
    supportLevel: 'Community',
    features: [
      { text: 'Live price feeds', included: true },
      { text: 'Basic news aggregation', included: true },
      { text: 'On-chain metrics', included: false },
      { text: 'Social sentiment', included: false },
      { text: 'Priority support', included: false }
    ],
    ctaText: 'Start Free (OAuth)',
    ctaLink: '/auth/login'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    currency: 'USD',
    requestsPerDay: 1000,
    supportLevel: 'Priority (<24h)',
    features: [
      { text: 'Live price feeds', included: true },
      { text: 'Full news sources', included: true },
      { text: 'On-chain metrics', included: true },
      { text: 'Social sentiment', included: true },
      { text: 'Priority support', included: true }
    ],
    ctaText: 'Upgrade to Pro',
    ctaLink: '/auth/login?plan=pro',
    highlighted: true
  }
]
```

**Validation Rules**:
- `price` must be non-negative number
- `requestsPerDay` must be positive integer
- `features` array must not be empty
- `ctaLink` must be valid relative or absolute URL

### 4. Code Example

Represents integration code snippets for the integration section.

```typescript
interface CodeExample {
  id: string                    // Unique identifier
  title: string                 // Example title (e.g., "MCP Connection")
  language: string              // Syntax highlighting language (e.g., "yaml", "typescript")
  code: string                  // Code content (multi-line string)
  description?: string          // Optional explanation
  section: 'connection' | 'authentication' | 'query' | 'response'
}

// Example data
const codeExamples: CodeExample[] = [
  {
    id: 'mcp-connection',
    title: 'MCP Connection',
    language: 'yaml',
    section: 'connection',
    description: 'Add Context8 to your MCP configuration',
    code: `# ~/.mcp/config.yaml
servers:
  context8:
    transport: https
    url: https://api.context8.markets/mcp
    token: $CONTEXT8_TOKEN`
  },
  {
    id: 'query-example',
    title: 'Query Example',
    language: 'bash',
    section: 'query',
    description: 'Request a crypto briefing',
    code: `$ context8 query btc/usdt --metrics price sentiment onchain
> price: $111,384.00 (+0.14%)
> sentiment: 72/100 (positive)
> onchain: 3 whale accumulations detected`
  }
]
```

**Validation Rules**:
- `language` must be valid syntax highlighting language (yaml, typescript, bash, json, etc.)
- `code` must not be empty
- `section` determines where example appears on page

### 5. ASCII Diagram

Represents the architecture diagram shown in the integration section.

```typescript
interface ASCIIDiagram {
  id: string                    // Unique identifier
  title: string                 // Diagram title
  content: string               // ASCII art content (multi-line string)
  description?: string          // Optional caption
}

// Example data
const architectureDiagram: ASCIIDiagram = {
  id: 'architecture-overview',
  title: 'Context8 Architecture',
  description: 'Data flows from multiple sources through the MCP server to your AI assistant',
  content: `
[Binance]  [CoinGecko]  [On-Chain]  [Sentiment]
     \\          |            |             /
              [ Context8 MCP Server ]
                       |
                   [ Your AI ]
            (ChatGPT, Claude, Cursor)
  `
}
```

**Validation Rules**:
- `content` must be non-empty string
- Use consistent spacing for visual alignment
- Keep width under 80 characters for mobile readability

## Component Prop Interfaces

### Terminal Components

```typescript
// TypeWriter component props
interface TypeWriterProps {
  text: string                          // Text to type out
  speed?: number                        // Typing speed in ms per character (default: 30)
  onComplete?: () => void               // Callback when typing completes
  className?: string                    // Additional CSS classes
}

// Cursor component props
interface CursorProps {
  blinking?: boolean                    // Whether cursor blinks (default: true)
  className?: string                    // Additional CSS classes
}

// TerminalHero component props
interface TerminalHeroProps {
  lines: string[]                       // Lines of text to type sequentially
  speed?: number                        // Typing speed
  showCursor?: boolean                  // Show blinking cursor (default: true)
  className?: string                    // Additional CSS classes
}
```

### Code Components

```typescript
// CodeBlock component props
interface CodeBlockProps {
  code: string                          // Code content
  language: string                      // Syntax highlighting language
  title?: string                        // Optional title above code block
  showLineNumbers?: boolean             // Show line numbers (default: false)
  highlightLines?: number[]             // Line numbers to highlight
  className?: string                    // Additional CSS classes
}

// ASCIIDiagram component props
interface ASCIIDiagramProps {
  content: string                       // ASCII art content
  title?: string                        // Optional title
  description?: string                  // Optional caption
  className?: string                    // Additional CSS classes
}
```

### Section Components

```typescript
// ScrollReveal component props (wrapper for fade-in animations)
interface ScrollRevealProps {
  children: React.ReactNode             // Content to reveal
  direction?: 'up' | 'down' | 'left' | 'right'  // Slide direction (default: 'up')
  delay?: number                        // Animation delay in seconds
  once?: boolean                        // Animate only once (default: true)
  className?: string                    // Additional CSS classes
}

// Section component props (layout wrapper)
interface SectionProps {
  children: React.ReactNode             // Section content
  id?: string                           // HTML id for anchor links
  className?: string                    // Additional CSS classes
  background?: 'default' | 'elevated'   // Background variant
}

// LivePriceWidget component props
interface LivePriceWidgetProps {
  prices: CryptoPrice[]                 // Array of crypto prices to display
  updateInterval?: number               // Mock update interval in ms (default: 5000)
  className?: string                    // Additional CSS classes
}

// PricingTable component props
interface PricingTableProps {
  tiers: PricingTier[]                  // Pricing tiers to display
  highlightedTier?: 'free' | 'pro'      // Which tier to highlight
  className?: string                    // Additional CSS classes
}
```

## Animation Variants

Framer Motion animation variants used throughout the application.

```typescript
// Fade in from bottom
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

// Stagger children animations
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1  // 100ms between each child
    }
  }
}

// Scale in (for icons, badges)
const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  }
}

// Slide in from left
const slideInLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}
```

## State Management

Since this is a simple landing page, state management uses local React state (useState) and custom hooks. No global state management library (Redux, Zustand) is needed.

**State Locations**:
- **Mock price updates**: Managed in `usePriceAnimation` hook
- **Typewriter animation**: Managed in `useTypewriter` hook
- **Scroll visibility**: Managed in `useScrollReveal` hook (uses IntersectionObserver)
- **Reduced motion preference**: Managed in `useReducedMotion` hook (reads media query)

**Example Hook**:
```typescript
function usePriceAnimation(initialPrices: CryptoPrice[], intervalMs: number = 5000) {
  const [prices, setPrices] = useState(initialPrices)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prevPrices =>
        prevPrices.map(price => ({
          ...price,
          price: price.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
          change24h: price.change24h + (Math.random() - 0.5) * 0.5,
          lastUpdate: new Date()
        }))
      )
    }, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])

  return prices
}
```

## Data Validation

All data structures should be validated at runtime using TypeScript type guards or a validation library like Zod (if needed).

```typescript
// Type guard example
function isCryptoPrice(obj: unknown): obj is CryptoPrice {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'symbol' in obj && typeof obj.symbol === 'string' &&
    'name' in obj && typeof obj.name === 'string' &&
    'price' in obj && typeof obj.price === 'number' &&
    'change24h' in obj && typeof obj.change24h === 'number' &&
    'lastUpdate' in obj && obj.lastUpdate instanceof Date
  )
}
```

## Summary

All data structures are defined with TypeScript interfaces for type safety. Mock data is centralized in `/src/data` directory for easy updates. Component prop interfaces ensure consistent API across the application. Animation variants are reusable and performance-optimized. No complex state management is needed—React's built-in hooks are sufficient for this static landing page.
