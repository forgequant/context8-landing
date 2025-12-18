// TypeScript Type Contracts
// Feature: Daily Market Reports
// Date: 2025-12-18

// ============================================================================
// REPORT COMPONENTS
// ============================================================================

export interface ReportMetrics {
  unique_creators: number | null
  unique_creators_change: number | null
  market_sentiment: number | null
  market_sentiment_change: number | null
  defi_engagements: number | null
  defi_engagements_change: number | null
  ai_creators: number | null
  ai_creators_change: number | null
}

export interface ExecutiveSummaryItem {
  direction: 'up' | 'down' | 'neutral'
  text: string
}

export interface Narrative {
  title: string
  status: 'hot' | 'warm' | 'cold'
  description: string
}

export interface TopMover {
  symbol: string
  name: string
  change_24h: number
  change_7d: number | null
  social: 'High' | 'Medium' | 'Low'
  sentiment: number
  comment: string
}

export interface Influencer {
  name: string
  followers: number
  engagement: number
  sentiment: 'bullish' | 'bearish' | 'neutral'
  focus: string[]
}

export interface Risk {
  level: 'high' | 'medium' | 'low'
  label: string
}

// ============================================================================
// DATABASE ENTITY
// ============================================================================

export type ReportStatus = 'draft' | 'published' | 'archived'

export interface DailyReport {
  id: string
  report_date: string // ISO date string (YYYY-MM-DD)
  metrics: ReportMetrics
  executive_summary: ExecutiveSummaryItem[]
  narratives: Narrative[]
  top_movers: TopMover[]
  influencers: Influencer[]
  risks: Risk[]
  raw_data: Record<string, unknown> | null
  status: ReportStatus
  generated_at: string // ISO timestamp
  published_at: string | null // ISO timestamp
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

export interface DailyReportWithMeta extends DailyReport {
  isToday: boolean
  formattedDate: string
  daysSinceGenerated: number
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface DailyReportListResponse {
  reports: DailyReport[]
  total: number
  page: number
  limit: number
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getDirectionEmoji(direction: ExecutiveSummaryItem['direction']): string {
  switch (direction) {
    case 'up': return '↑'
    case 'down': return '↓'
    default: return '→'
  }
}

export function getNarrativeStatusColor(status: Narrative['status']): string {
  switch (status) {
    case 'hot': return 'text-red-500'
    case 'warm': return 'text-yellow-500'
    default: return 'text-blue-500'
  }
}

export function getRiskLevelColor(level: Risk['level']): string {
  switch (level) {
    case 'high': return 'text-red-500'
    case 'medium': return 'text-yellow-500'
    default: return 'text-green-500'
  }
}

export function getSentimentColor(sentiment: number): string {
  if (sentiment >= 70) return 'text-green-500'
  if (sentiment >= 50) return 'text-yellow-500'
  return 'text-red-500'
}

export function formatLargeNumber(num: number | null): string {
  if (num === null) return 'N/A'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

export function formatPercentChange(change: number | null): string {
  if (change === null) return 'N/A'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}
