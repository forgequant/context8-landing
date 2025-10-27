# Manual Telegram Bot Deployment via Supabase Dashboard

Пошаговая инструкция по ручному деплою Edge Functions через Supabase Dashboard.

## 1. Деплой `telegram-bot` Function

### 1.1 Создание функции

1. Зайди в **Supabase Dashboard** → **Edge Functions**
2. Нажми **"Create a new function"**
3. **Name:** `telegram-bot`
4. **Copy code** из файла `/supabase/functions/telegram-bot/index.ts`
5. Нажми **"Deploy function"**

### 1.2 Настройка Telegram Webhook

После создания функции, скопируй её URL (выглядит как: `https://[PROJECT].supabase.co/functions/v1/telegram-bot`)

Установи webhook для Telegram бота:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "<EDGE_FUNCTION_URL>"}'
```

Замени:
- `<YOUR_BOT_TOKEN>` - токен из @BotFather
- `<EDGE_FUNCTION_URL>` - URL Edge Function

**Проверь статус:**
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Должен показать:
```json
{
  "ok": true,
  "result": {
    "url": "https://...",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

## 2. Деплой `telegram-notify-admin` Function

### 2.1 Создание функции

1. В **Edge Functions** нажми **"Create a new function"**
2. **Name:** `telegram-notify-admin`
3. **Copy code** из файла `/supabase/functions/telegram-notify-admin/index.ts`
4. Нажми **"Deploy function"**

## 3. Настройка Environment Variables

### 3.1 Генерация секретов

```bash
# Секретный код для регистрации админа
openssl rand -base64 16

# Webhook secret
openssl rand -base64 32
```

### 3.2 Добавление переменных

Зайди в **Project Settings** → **Edge Functions** и добавь:

```
TELEGRAM_BOT_TOKEN=<токен_из_@BotFather>
TELEGRAM_ADMIN_SECRET=<секретный_код_из_3.1>
WEBHOOK_SECRET=<webhook_secret_из_3.1>
SUPABASE_URL=https://yfahpblxugjtbollpudv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<твой_service_role_key>
```

**Где найти Service Role Key:**
- **Project Settings** → **API** → **service_role key** (секретный ключ)

## 4. Запуск SQL Миграций

### 4.1 Таблица настроек

Зайди в **SQL Editor** и выполни:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert telegram_chat_id placeholder
INSERT INTO admin_settings (key, value)
VALUES ('telegram_chat_id', '')
ON CONFLICT (key) DO NOTHING;

-- Index for fast lookups
CREATE INDEX idx_admin_settings_key ON admin_settings(key);

-- RLS policies
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage admin settings"
ON admin_settings
FOR ALL
USING (
  auth.uid() IS NOT NULL AND
  (SELECT (raw_user_meta_data->>'is_admin')::boolean
   FROM auth.users
   WHERE id = auth.uid()) = true
);
```

### 4.2 Database Trigger для уведомлений

**ВАЖНО:** Сначала включи http extension:

```sql
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
```

Затем выполни:

```sql
-- Function to notify admin via Telegram
CREATE OR REPLACE FUNCTION notify_admin_new_payment()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  webhook_secret TEXT;
  payload JSONB;
  user_email TEXT;
BEGIN
  -- Get user email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.user_id;

  -- Build payload
  payload := jsonb_build_object(
    'type', 'INSERT',
    'record', jsonb_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'user_email', COALESCE(user_email, 'Unknown'),
      'plan', NEW.plan,
      'chain', NEW.chain,
      'amount', NEW.amount,
      'tx_hash', NEW.tx_hash,
      'submitted_at', NEW.submitted_at
    )
  );

  -- Get configuration
  function_url := current_setting('app.supabase_url', true) || '/functions/v1/telegram-notify-admin';
  webhook_secret := current_setting('app.webhook_secret', true);

  -- Call Edge Function asynchronously
  PERFORM extensions.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || webhook_secret
    ),
    body := payload
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to send Telegram notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_notify_admin_payment ON payment_submissions;
CREATE TRIGGER trigger_notify_admin_payment
AFTER INSERT ON payment_submissions
FOR EACH ROW
EXECUTE FUNCTION notify_admin_new_payment();
```

### 4.3 Настройка app settings

Зайди в **Project Settings** → **Database** → **Connection pooling** и добавь:

```
app.supabase_url = https://yfahpblxugjtbollpudv.supabase.co
app.webhook_secret = <твой_WEBHOOK_SECRET>
```

Или выполни SQL:

```sql
ALTER DATABASE postgres SET app.supabase_url = 'https://yfahpblxugjtbollpudv.supabase.co';
ALTER DATABASE postgres SET app.webhook_secret = '<твой_WEBHOOK_SECRET>';
```

## 5. Регистрация в Telegram боте

1. Найди бота в Telegram (username из @BotFather)
2. Отправь:
   ```
   /start <ТВОЙ_СЕКРЕТНЫЙ_КОД>
   ```
3. Бот ответит: ✅ **Admin Registered!**

## 6. Тестирование

### 6.1 Проверь webhook

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### 6.2 Отправь тестовый платёж

1. Залогинься на сайте
2. Нажми "Upgrade to Pro"
3. Отправь тестовый платёж

Должно прийти уведомление в Telegram!

## Troubleshooting

### Не приходят уведомления

1. **Проверь Edge Function логи:**
   - Supabase Dashboard → Edge Functions → telegram-notify-admin → Logs

2. **Проверь что бот зарегистрирован:**
   ```sql
   SELECT * FROM admin_settings WHERE key = 'telegram_chat_id';
   ```
   Должно быть не пустое значение.

3. **Проверь webhook:**
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
   ```

4. **Проверь http extension:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'http';
   ```

### Ошибка при регистрации бота

- Проверь Environment Variables в Edge Functions
- Убедись что `TELEGRAM_ADMIN_SECRET` совпадает с кодом который ты отправляешь

## ✅ Готово!

Теперь при каждом новом платеже тебе будет приходить уведомление в Telegram! 🎉
