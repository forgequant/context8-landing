import { IntegrationContent } from './types';

/**
 * Integration section content
 *
 * Highlights MCP compatibility (FR-006) and OAuth security (FR-007):
 * - Compatible tools: ChatGPT, Claude, Cursor
 * - OAuth providers: Google, GitHub
 * - 3-line integration promise
 */
export const integrationContent: IntegrationContent = {
  sectionTitle: 'Integration',
  headline: 'Works with Your Favorite AI Tools',
  description:
    'Context8 uses the Model Context Protocol (MCP), making it compatible with any MCP-enabled AI assistant. Add 3 lines to your config and start querying live crypto data instantly.',
  compatibleTools: [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      logo: {
        src: '/images/tool-logos/chatgpt.svg',
        alt: 'ChatGPT logo',
      },
      status: 'supported',
    },
    {
      id: 'claude',
      name: 'Claude',
      logo: {
        src: '/images/tool-logos/claude.svg',
        alt: 'Claude logo',
      },
      status: 'supported',
    },
    {
      id: 'cursor',
      name: 'Cursor',
      logo: {
        src: '/images/tool-logos/cursor.svg',
        alt: 'Cursor logo',
      },
      status: 'supported',
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot',
      logo: {
        src: '/images/tool-logos/copilot.svg',
        alt: 'GitHub Copilot logo',
      },
      status: 'beta',
    },
  ],
  oauth: {
    headline: 'Secure OAuth Authentication',
    description:
      'We never store your API keys or exchange credentials. Sign in with Google or GitHub, and Context8 handles secure authentication via OAuth 2.0.',
    providers: [
      {
        id: 'google',
        name: 'Google',
        icon: 'mail', // Lucide icon
      },
      {
        id: 'github',
        name: 'GitHub',
        icon: 'github', // Lucide icon
      },
    ],
  },
  documentation: {
    label: 'View Integration Guide',
    href: '/docs/integration',
  },
};
