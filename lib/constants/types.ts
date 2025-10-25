// TypeScript interfaces for Context8 landing page content
// Generated from data-model.md

// ============================================================================
// CTA Button
// ============================================================================
export interface CTAButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'outline';
  icon?: string; // Lucide icon name
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

// ============================================================================
// Hero Section
// ============================================================================
export interface TrustBadge {
  icon: string;
  label: string;
}

export interface HeroContent {
  headline: {
    main: string;
    emphasis?: string;
  };
  subheadline: string;
  description: string;
  cta: {
    primary: CTAButton;
    secondary?: CTAButton;
  };
  visual?: {
    type: 'illustration' | 'screenshot' | 'animation' | 'none';
    src?: string;
    alt: string;
  };
  badges?: TrustBadge[];
}

// ============================================================================
// Problem Statement Section
// ============================================================================
export interface ProblemPoint {
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface ProblemContent {
  sectionTitle: string;
  headline: string;
  problems: ProblemPoint[];
  visual?: {
    type: 'before-after' | 'comparison' | 'illustration';
    src: string;
    alt: string;
  };
}

// ============================================================================
// Solution Overview Section
// ============================================================================
export interface BenefitPoint {
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface SolutionContent {
  sectionTitle: string;
  headline: string;
  description: string;
  benefits: BenefitPoint[];
  visual?: {
    type: 'diagram' | 'flow-chart' | 'screenshot';
    src: string;
    alt: string;
  };
}

// ============================================================================
// Data Sources Section
// ============================================================================
export interface DataSource {
  id: string;
  name: string;
  logo: {
    src: string;
    alt: string;
  };
  category: 'price' | 'news' | 'onchain' | 'sentiment';
  updateFrequency: string;
  updateFrequencyMs: number;
  metrics: string[];
  reliability: {
    uptime: number;
    label: string;
  };
}

export interface DataSourcesContent {
  sectionTitle: string;
  headline: string;
  description?: string;
  sources: DataSource[];
}

// ============================================================================
// Integration Section
// ============================================================================
export interface CompatibleTool {
  id: string;
  name: string;
  logo: {
    src: string;
    alt: string;
  };
  status: 'supported' | 'beta' | 'coming-soon';
}

export interface OAuthProvider {
  id: string;
  name: string;
  icon: string; // Lucide icon or custom logo
}

export interface IntegrationContent {
  sectionTitle: string;
  headline: string;
  description: string;
  compatibleTools: CompatibleTool[];
  oauth: {
    headline: string;
    description: string;
    providers: OAuthProvider[];
  };
  documentation: {
    label: string;
    href: string;
  };
}

// ============================================================================
// Demo Section
// ============================================================================
export interface DemoContent {
  sectionTitle: string;
  headline: string;
  description?: string;
  demoType: 'static' | 'interactive' | 'video';
  demo: {
    query: string;
    response: string; // Markdown formatted
    timestamp?: string;
  };
  cta?: CTAButton;
}

// ============================================================================
// Pricing Section
// ============================================================================
export interface PricingFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingPlan {
  id: 'free' | 'pro';
  name: string;
  price: {
    amount: number;
    period: 'month' | 'year' | null;
    display: string;
  };
  description: string;
  features: PricingFeature[];
  cta: CTAButton;
  highlight?: boolean;
}

export interface PricingContent {
  sectionTitle: string;
  headline: string;
  description?: string;
  plans: PricingPlan[];
  comparisonNote?: string;
}

// ============================================================================
// Trust Signals Section
// ============================================================================
export interface StatusIndicator {
  label: string;
  status: 'operational' | 'degraded' | 'down';
  uptime?: number;
  latency?: number;
  link?: string;
}

export interface SocialProof {
  metric: string;
  label: string;
  icon?: string;
}

export interface Testimonial {
  quote: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
}

export interface MetricDisplay {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'stable';
}

export type TrustSignalContent =
  | { type: 'status'; content: StatusIndicator }
  | { type: 'social-proof'; content: SocialProof }
  | { type: 'testimonial'; content: Testimonial }
  | { type: 'metric'; content: MetricDisplay };

export interface TrustSignalsContent {
  sectionTitle: string;
  headline: string;
  signals: TrustSignalContent[];
}

// ============================================================================
// Footer
// ============================================================================
export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: 'twitter' | 'github' | 'discord' | 'linkedin';
  href: string;
  icon: string; // Lucide icon name
  ariaLabel: string;
}

export interface FooterContent {
  logo: {
    src: string;
    alt: string;
  };
  tagline?: string;
  links: FooterLinkGroup[];
  social?: SocialLink[];
  copyright: string;
}

// ============================================================================
// Main Landing Page Content Type
// ============================================================================
export interface LandingPageContent {
  hero: HeroContent;
  problem: ProblemContent;
  solution: SolutionContent;
  dataSources: DataSourcesContent;
  integration: IntegrationContent;
  demo: DemoContent;
  pricing: PricingContent;
  trustSignals: TrustSignalsContent;
  footer: FooterContent;
}
