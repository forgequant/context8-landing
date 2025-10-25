import { FooterContent } from './types';

/**
 * Footer content
 *
 * Contains navigation links, social media, and copyright info
 * Organized by category for easy navigation
 */
export const footerContent: FooterContent = {
  logo: {
    src: '/images/logo.svg',
    alt: 'Context8 logo',
  },
  tagline: 'Real-time crypto intelligence for AI assistants',
  links: [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#solution' },
        { label: 'Data Sources', href: '/#data-sources' },
        { label: 'Integration', href: '/#integration' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Demo', href: '/#demo' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'Documentation', href: '/docs', external: false },
        { label: 'API Reference', href: '/docs/api', external: false },
        { label: 'Integration Guide', href: '/docs/integration', external: false },
        { label: 'GitHub', href: 'https://github.com/context8', external: true },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Status', href: '/status' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ],
  social: [
    {
      platform: 'twitter',
      href: 'https://twitter.com/context8',
      icon: 'twitter',
      ariaLabel: 'Follow us on Twitter',
    },
    {
      platform: 'github',
      href: 'https://github.com/context8',
      icon: 'github',
      ariaLabel: 'View our GitHub',
    },
    {
      platform: 'discord',
      href: 'https://discord.gg/context8',
      icon: 'message-circle',
      ariaLabel: 'Join our Discord',
    },
  ],
  copyright: `© ${new Date().getFullYear()} Context8. All rights reserved.`,
};
