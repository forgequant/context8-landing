// Supabase Edge Function: Send Daily Market Report
// Sends formatted report via Telegram and optionally publishes it
// Triggered manually or via scheduled cron after generate-daily-report

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ============================================================================
// TYPES (matching generate-daily-report)
// ============================================================================

interface ReportMetrics {
  unique_creators: number | null
  unique_creators_change: number | null
  market_sentiment: number | null
  market_sentiment_change: number | null
  defi_engagements: number | null
  defi_engagements_change: number | null
}

interface ExecutiveSummaryItem {
  direction: 'up' | 'down' | 'neutral'
  text: string
}

interface Narrative {
  title: string
  status: 'hot' | 'warm' | 'cold'
  description: string
}

interface TopMover {
  symbol: string
  name: string
  change_24h: number
  change_7d: number | null
  social: 'High' | 'Medium' | 'Low'
  sentiment: number
}

interface Risk {
  level: 'high' | 'medium' | 'low'
  label: string
}

interface DailyReport {
  id: string
  report_date: string
  metrics: ReportMetrics
  executive_summary: ExecutiveSummaryItem[]
  narratives: Narrative[]
  top_movers: TopMover[]
  risks: Risk[]
  status: 'draft' | 'published' | 'archived'
  generated_at: string
}

// ============================================================================
// TELEGRAM FORMATTING
// ============================================================================

function getDirectionEmoji(direction: string): string {
  switch (direction) {
    case 'up': return '🟢'
    case 'down': return '🔴'
    default: return '⚪'
  }
}

function getNarrativeEmoji(status: string): string {
  switch (status) {
    case 'hot': return '🔥'
    case 'warm': return '🌤'
    default: return '❄️'
  }
}

function getRiskEmoji(level: string): string {
  switch (level) {
    case 'high': return '🚨'
    case 'medium': return '⚠️'
    default: return '✅'
  }
}

function formatNumber(num: number | null): string {
  if (num === null) return 'N/A'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

function formatReportForTelegram(report: DailyReport): string {
  const lines: string[] = []

  // Header
  const dateFormatted = new Date(report.report_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  lines.push(`📊 <b>Daily Market Report</b>`)
  lines.push(`📅 ${dateFormatted}`)
  lines.push('')

  // Key Metrics
  if (report.metrics) {
    lines.push(`<b>📈 Key Metrics</b>`)
    if (report.metrics.market_sentiment !== null) {
      lines.push(`• Sentiment: <b>${report.metrics.market_sentiment}%</b>`)
    }
    if (report.metrics.unique_creators !== null) {
      lines.push(`• Active Creators: <b>${formatNumber(report.metrics.unique_creators)}</b>`)
    }
    if (report.metrics.defi_engagements !== null) {
      lines.push(`• DeFi Engagements: <b>${formatNumber(report.metrics.defi_engagements)}</b>`)
    }
    lines.push('')
  }

  // Executive Summary
  if (report.executive_summary?.length > 0) {
    lines.push(`<b>📋 Summary</b>`)
    for (const item of report.executive_summary.slice(0, 4)) {
      lines.push(`${getDirectionEmoji(item.direction)} ${item.text}`)
    }
    lines.push('')
  }

  // Top Movers (compact)
  if (report.top_movers?.length > 0) {
    lines.push(`<b>🚀 Top Movers</b>`)
    const gainers = report.top_movers
      .filter((m) => m.change_24h > 0)
      .sort((a, b) => b.change_24h - a.change_24h)
      .slice(0, 3)
    const losers = report.top_movers
      .filter((m) => m.change_24h < 0)
      .sort((a, b) => a.change_24h - b.change_24h)
      .slice(0, 3)

    if (gainers.length > 0) {
      const gainerText = gainers
        .map((m) => `${m.symbol} ${formatChange(m.change_24h)}`)
        .join(' | ')
      lines.push(`🟢 ${gainerText}`)
    }
    if (losers.length > 0) {
      const loserText = losers
        .map((m) => `${m.symbol} ${formatChange(m.change_24h)}`)
        .join(' | ')
      lines.push(`🔴 ${loserText}`)
    }
    lines.push('')
  }

  // Narratives
  if (report.narratives?.length > 0) {
    lines.push(`<b>🎯 Market Themes</b>`)
    for (const narrative of report.narratives.slice(0, 4)) {
      lines.push(`${getNarrativeEmoji(narrative.status)} <b>${narrative.title}</b>: ${narrative.status}`)
    }
    lines.push('')
  }

  // Risks
  if (report.risks?.length > 0) {
    lines.push(`<b>⚡ Risk Indicators</b>`)
    for (const risk of report.risks.slice(0, 3)) {
      lines.push(`${getRiskEmoji(risk.level)} ${risk.label}`)
    }
    lines.push('')
  }

  // Footer
  lines.push(`<a href="https://context8.markets/reports/daily">View Full Report →</a>`)

  return lines.join('\n')
}

// ============================================================================
// TELEGRAM API
// ============================================================================

async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('[send-daily-report] Telegram API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[send-daily-report] Telegram send error:', error)
    return false
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get('authorization')
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')

    const isAuthorized =
      authHeader === 'Bearer internal-trigger' ||
      (webhookSecret && authHeader === `Bearer ${webhookSecret}`)

    if (!isAuthorized) {
      console.error('[send-daily-report] Unauthorized request')
      return new Response('Unauthorized', { status: 401 })
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')

    if (!telegramBotToken) {
      console.error('[send-daily-report] Missing TELEGRAM_BOT_TOKEN')
      return new Response('Missing TELEGRAM_BOT_TOKEN', { status: 500 })
    }

    // Parse optional request body
    let reportDate: string | null = null
    let autoPublish = false

    try {
      const body = await req.json()
      reportDate = body.report_date ?? null
      autoPublish = body.auto_publish ?? false
    } catch {
      // No body or invalid JSON - use defaults
    }

    console.log('[send-daily-report] Starting...', { reportDate, autoPublish })

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get admin's Telegram chat ID
    const { data: setting, error: settingError } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'telegram_chat_id')
      .single()

    if (settingError || !setting?.value) {
      console.error('[send-daily-report] Admin not registered:', settingError)
      return new Response(
        JSON.stringify({ error: 'Admin not registered in Telegram bot' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const telegramChatId = setting.value

    // Fetch the report
    let query = supabase
      .from('daily_reports')
      .select('*')

    if (reportDate) {
      query = query.eq('report_date', reportDate)
    } else {
      // Get latest report (draft or published)
      query = query
        .in('status', ['draft', 'published'])
        .order('report_date', { ascending: false })
        .limit(1)
    }

    const { data: reports, error: reportError } = await query

    if (reportError) {
      console.error('[send-daily-report] Database error:', reportError)
      return new Response(
        JSON.stringify({ error: 'Database error', detail: reportError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!reports || reports.length === 0) {
      console.error('[send-daily-report] No report found')
      return new Response(
        JSON.stringify({ error: 'No report found for the specified date' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const report = reports[0] as DailyReport

    console.log('[send-daily-report] Found report:', {
      id: report.id,
      report_date: report.report_date,
      status: report.status,
    })

    // Format and send via Telegram
    const message = formatReportForTelegram(report)
    const sent = await sendTelegramMessage(telegramBotToken, telegramChatId, message)

    if (!sent) {
      return new Response(
        JSON.stringify({ error: 'Failed to send Telegram message' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('[send-daily-report] Telegram message sent')

    // Auto-publish if requested and report is draft
    if (autoPublish && report.status === 'draft') {
      const { error: updateError } = await supabase
        .from('daily_reports')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', report.id)

      if (updateError) {
        console.error('[send-daily-report] Failed to publish:', updateError)
      } else {
        console.log('[send-daily-report] Report published')
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        report_id: report.id,
        report_date: report.report_date,
        telegram_sent: true,
        published: autoPublish && report.status === 'draft',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[send-daily-report] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        detail: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
