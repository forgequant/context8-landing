// Supabase Edge Function: Telegram Bot Webhook
// Handles /start command to register admin's chat_id

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface TelegramUpdate {
  message?: {
    chat: {
      id: number
    }
    text?: string
    from?: {
      username?: string
      first_name?: string
    }
  }
}

serve(async (req) => {
  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const adminSecret = Deno.env.get('TELEGRAM_ADMIN_SECRET')
    // Use built-in Supabase environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!botToken || !adminSecret) {
      console.error('Missing required environment variables')
      return new Response('Server configuration error', { status: 500 })
    }

    // Parse Telegram update
    const update: TelegramUpdate = await req.json()

    if (!update.message?.text) {
      return new Response('OK', { status: 200 })
    }

    const chatId = update.message.chat.id
    const text = update.message.text.trim()
    const username = update.message.from?.username || update.message.from?.first_name || 'Unknown'

    // Handle /start command with secret
    if (text.startsWith('/start')) {
      const parts = text.split(' ')
      const providedSecret = parts[1]

      // Check if secret matches
      if (providedSecret === adminSecret) {
        // Register admin chat_id in database
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const { error } = await supabase
          .from('admin_settings')
          .upsert({
            key: 'telegram_chat_id',
            value: chatId.toString(),
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Database error:', error)
          await sendMessage(botToken, chatId, '❌ Failed to register. Please contact support.')
          return new Response('Database error', { status: 500 })
        }

        // Send success message
        await sendMessage(
          botToken,
          chatId,
          `✅ <b>Admin Registered!</b>\n\n` +
          `Hello @${username}!\n\n` +
          `You will now receive notifications about new payment submissions.\n\n` +
          `Test it by submitting a payment on <a href="https://context8.markets">context8.markets</a>`
        )
      } else {
        // Invalid or missing secret
        await sendMessage(
          botToken,
          chatId,
          `⚠️ <b>Invalid Secret</b>\n\n` +
          `Usage: <code>/start YOUR_SECRET</code>\n\n` +
          `Get your secret from Supabase Dashboard environment variables.`
        )
      }
    } else {
      // Unknown command
      await sendMessage(
        botToken,
        chatId,
        `👋 Welcome to Context8 Admin Bot!\n\n` +
        `To register for notifications, use:\n` +
        `<code>/start YOUR_SECRET</code>`
      )
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Error in telegram-bot:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

async function sendMessage(botToken: string, chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  })
}
