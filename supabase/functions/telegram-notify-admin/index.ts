// Supabase Edge Function: Telegram Admin Notifications
// Sends Telegram message to admin when new payment is submitted

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface PaymentData {
  id: string
  user_id: string
  user_email: string
  plan: string
  chain: string
  amount: number
  tx_hash: string
  submitted_at: string
}

serve(async (req) => {
  try {
    // Validate webhook secret
    const authHeader = req.headers.get('authorization')
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')

    if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get Telegram credentials
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const telegramChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')

    if (!telegramBotToken || !telegramChatId) {
      console.error('Missing Telegram credentials')
      return new Response('Server configuration error', { status: 500 })
    }

    // Parse payment data from webhook
    const { record, type } = await req.json()

    // Only notify on INSERT events (new payments)
    if (type !== 'INSERT') {
      return new Response('OK', { status: 200 })
    }

    const payment: PaymentData = record

    // Format message
    const message = `
🔔 <b>New Payment Submission</b>

👤 User: <code>${payment.user_email || 'Unknown'}</code>
💰 Amount: $${payment.amount}
⛓ Network: ${payment.chain.toUpperCase()}
📝 Plan: ${payment.plan.toUpperCase()}
🔗 Tx Hash: <code>${payment.tx_hash}</code>

🕐 Submitted: ${new Date(payment.submitted_at).toLocaleString()}

<a href="https://context8.markets/admin">Open Admin Panel</a>
`.trim()

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    })

    if (!telegramResponse.ok) {
      const error = await telegramResponse.text()
      console.error('Telegram API error:', error)
      return new Response('Failed to send Telegram message', { status: 500 })
    }

    return new Response('Notification sent', { status: 200 })
  } catch (error) {
    console.error('Error in telegram-notify-admin:', error)
    return new Response('Internal server error', { status: 500 })
  }
})
