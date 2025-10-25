import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Context8 - Real-Time Crypto Data for AI Assistants',
  description:
    'Transform ChatGPT, Claude & Cursor into crypto-aware analysts with live market data, news, and on-chain metrics.',
  keywords: [
    'crypto data',
    'AI assistant',
    'MCP server',
    'real-time crypto',
    'ChatGPT',
    'Claude',
    'Cursor',
    'Bitcoin',
    'Ethereum',
  ],
  openGraph: {
    title: 'Context8 - Real-Time Crypto Data for AI Assistants',
    description:
      'Get live crypto market data directly in your AI assistant. No more outdated information.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Context8 - Real-Time Crypto Data for AI Assistants',
    description:
      'Get live crypto market data directly in your AI assistant. No more outdated information.',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Landing page uses root layout with dark theme by default
  // This layout only adds landing-specific metadata
  return children;
}
