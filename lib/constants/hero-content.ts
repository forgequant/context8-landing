import { HeroContent } from './types';

/**
 * Hero section content for Context8 landing page
 *
 * Targets all 3 audiences: AI developers, crypto traders, analysts (FR-010)
 * Value proposition: Real-time crypto data for AI assistants
 */
export const heroContent: HeroContent = {
  headline: {
    main: 'Real-Time Crypto Data for Your AI Assistant',
    emphasis: 'Real-Time',
  },
  subheadline: 'Transform ChatGPT, Claude & Cursor into crypto-aware analysts',
  description:
    "Context8 provides live market data, news, and on-chain metrics directly to your LLM. No more outdated information. No API wrestling. Just ask.",
  cta: {
    primary: {
      text: 'Get Started Free',
      href: '/login',
      variant: 'primary',
      icon: 'arrow-right',
      size: 'lg',
    },
    secondary: {
      text: 'View Demo',
      href: '#demo',
      variant: 'ghost',
      size: 'lg',
    },
  },
  visual: {
    type: 'illustration',
    src: '/images/hero-illustration.svg',
    alt: 'Context8 MCP server connecting AI assistants to live crypto data',
  },
  badges: [
    {
      icon: 'users',
      label: 'Trusted by 500+ developers',
    },
    {
      icon: 'clock',
      label: 'Updated every 60 seconds',
    },
  ],
};
