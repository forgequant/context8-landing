import { ProblemContent, SolutionContent } from './types';

/**
 * Problem Statement section content
 *
 * Addresses pain points for all 3 target audiences (FR-010):
 * - AI developers: Manual integration complexity
 * - Crypto traders: Stale data, missing context
 * - Analysts: Fragmented sources, high costs
 */
export const problemContent: ProblemContent = {
  sectionTitle: 'The Challenge',
  headline: 'Your AI is Trading in the Past',
  problems: [
    {
      icon: 'clock',
      title: 'Outdated Information',
      description:
        "LLMs have a knowledge cutoff. By the time you ask about Bitcoin, the price has already moved 5%.",
    },
    {
      icon: 'x-circle',
      title: 'Manual API Integration',
      description:
        'Wrestling with Binance, CoinGecko, and on-chain APIs. Different formats, rate limits, error handling. Days of work.',
    },
    {
      icon: 'trending-down',
      title: 'Fragmented Data Sources',
      description:
        'Price data in one place, news in another, sentiment scattered across Twitter. No unified view for decision-making.',
    },
    {
      icon: 'alert-triangle',
      title: 'High API Costs',
      description:
        'Premium crypto APIs charge $50-$200/month per source. Want multiple sources? Multiply those costs.',
    },
  ],
};

/**
 * Solution Overview section content
 *
 * Highlights key benefits addressing the problems above
 */
export const solutionContent: SolutionContent = {
  sectionTitle: 'The Solution',
  headline: 'Context8 Bridges the Gap',
  description:
    'One MCP server that brings real-time crypto intelligence to any AI assistant. No code changes. No API key juggling. Just instant, accurate market context.',
  benefits: [
    {
      icon: 'zap',
      title: 'Live Data Every 60 Seconds',
      description:
        'Real-time prices, volume, market cap from Binance and CoinGecko. Your AI always knows the current market state.',
    },
    {
      icon: 'boxes',
      title: '4 Data Sources in One',
      description:
        'Price feeds, crypto news, on-chain metrics, and social sentiment—all aggregated into a single, coherent response.',
    },
    {
      icon: 'sparkles',
      title: 'MCP-Native Integration',
      description:
        '3 lines to connect. Works with ChatGPT, Claude, Cursor, and any MCP-compatible tool. No backend changes required.',
    },
    {
      icon: 'shield',
      title: 'OAuth Security',
      description:
        'Secure authentication via Google or GitHub. We never store your exchange credentials. Your keys, your data.',
    },
  ],
};
