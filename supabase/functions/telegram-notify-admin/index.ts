// Supabase Edge Function: Telegram Admin Notifications
// Sends Telegram message to admin when new payment is submitted

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Get Telegram bot token
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    // Use built-in Supabase environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!telegramBotToken) {
      console.error('Missing TELEGRAM_BOT_TOKEN')
      return new Response('Server configuration error', { status: 500 })
    }

    // Get admin's chat_id from database
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: setting, error: dbError } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'telegram_chat_id')
      .single()

    if (dbError || !setting?.value) {
      console.error('Admin not registered in Telegram bot:', dbError)
      return new Response('Admin not registered. Send /start to the bot.', { status: 400 })
    }

    const telegramChatId = setting.value

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
