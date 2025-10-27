# Telegram Notifications Setup Guide

Настройка Telegram уведомлений для администратора о новых платежах.

## 1. Создание Telegram Бота

1. Открой Telegram и найди [@BotFather](https://t.me/BotFather)
2. Отправь команду `/newbot`
3. Введи имя бота (например: `Context8 Admin`)
4. Введи username бота (например: `context8_admin_bot`)
5. **Сохрани токен** (выглядит как `123456:ABC-DEF1234...`)

## 2. Генерация Секретного Кода

Создай случайный секретный код для регистрации админа:

```bash
openssl rand -base64 16
```

Сохрани этот код, он понадобится в шаге 3 и 5.

## 3. Настройка Supabase

### 3.1 Деплой Edge Functions

```bash
# В корне проекта
supabase functions deploy telegram-bot
supabase functions deploy telegram-notify-admin
```

### 3.2 Настройка Webhook для Telegram

1. Зайди в Supabase Dashboard → Edge Functions
2. Найди функцию `telegram-bot` и скопируй её URL
3. Установи webhook для бота:

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -d "url=<EDGE_FUNCTION_URL>"
```

Замени:
- `<YOUR_BOT_TOKEN>` на токен из шага 1
- `<EDGE_FUNCTION_URL>` на URL Edge Function

### 3.3 Добавление Environment Variables

Зайди в Supabase Dashboard → Project Settings → Edge Functions и добавь:

```
TELEGRAM_BOT_TOKEN=<твой_бот_токен>
TELEGRAM_ADMIN_SECRET=<секретный_код_из_шага_2>
WEBHOOK_SECRET=<генерируй_новый>
SUPABASE_URL=<твой_supabase_url>
SUPABASE_SERVICE_ROLE_KEY=<твой_service_role_key>
```

**Генерация WEBHOOK_SECRET:**
```bash
openssl rand -base64 32
```

URL и Service Key найдёшь в Project Settings → API.

## 4. Настройка Database

### 4.1 Запусти SQL миграции

Зайди в Supabase SQL Editor и запусти по очереди:

1. **Таблица настроек** (`003_admin_telegram_settings.sql`)
2. **Триггер уведомлений** (`002_telegram_notifications.sql`)

Или запусти всё сразу:

```sql
-- Create function to call Edge Function
CREATE OR REPLACE FUNCTION notify_admin_new_payment()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  webhook_secret TEXT;
  payload JSON;
BEGIN
  -- Get Edge Function URL from environment
  function_url := current_setting('app.supabase_url', true) || '/functions/v1/telegram-notify-admin';
  webhook_secret := current_setting('app.webhook_secret', true);

  -- Build payload with user email
  SELECT json_build_object(
    'type', 'INSERT',
    'record', json_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'user_email', u.email,
      'plan', NEW.plan,
      'chain', NEW.chain,
      'amount', NEW.amount,
      'tx_hash', NEW.tx_hash,
      'submitted_at', NEW.submitted_at
    )
  ) INTO payload
  FROM auth.users u
  WHERE u.id = NEW.user_id;

  -- Call Edge Function asynchronously
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || webhook_secret
    ),
    body := payload::jsonb
  );

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

## 5. Регистрация Админа

Теперь самое простое - зарегистрируйся в боте!

1. Найди своего бота в Telegram (username из шага 1)
2. Отправь команду:
   ```
   /start <ТВОЙ_СЕКРЕТНЫЙ_КОД>
   ```
   Замени `<ТВОЙ_СЕКРЕТНЫЙ_КОД>` на код из шага 2

3. Бот ответит: ✅ **Admin Registered!**

Готово! Теперь будешь получать уведомления о новых платежах.

## 6. Тестирование

### 6.1 Тест через Supabase Dashboard

1. Зайди в Supabase → Table Editor → `payment_submissions`
2. Вставь тестовую запись:
```sql
INSERT INTO payment_submissions (user_id, plan, chain, amount, tx_hash, status)
VALUES (
  '<твой_user_id>',
  'pro',
  'polygon',
  8.00,
  '0xtest123...',
  'pending'
);
```

3. Проверь Telegram - должно прийти уведомление!

### 5.2 Тест через Frontend

1. Залогинься на сайте
2. Нажми "Upgrade to Pro"
3. Отправь тестовый платеж
4. Проверь Telegram уведомление

## 6. Формат Уведомления

```
🔔 New Payment Submission

👤 User: user@example.com
💰 Amount: $8
⛓ Network: POLYGON
📝 Plan: PRO
🔗 Tx Hash: 0xabc123...

🕐 Submitted: 27.10.2025, 15:30

[Open Admin Panel]
```

## Troubleshooting

### Уведомления не приходят

1. **Проверь Edge Function логи:**
   ```bash
   supabase functions logs telegram-notify-admin
   ```

2. **Проверь что бот запущен:**
   - Отправь боту `/start` в Telegram
   - Убедись что ты получил `chat_id`

3. **Проверь Environment Variables:**
   - Все 3 переменные установлены?
   - Токен корректный?
   - Chat ID правильный?

4. **Проверь webhook trigger:**
   ```sql
   SELECT * FROM pg_trigger
   WHERE tgname = 'trigger_notify_admin_payment';
   ```

### Ошибка "Unauthorized"

- Проверь что `WEBHOOK_SECRET` совпадает в:
  - Edge Function environment variables
  - Database trigger (если используешь)

### Ошибка "Chat not found"

- Отправь боту `/start` в Telegram
- Перепроверь `TELEGRAM_ADMIN_CHAT_ID`

## Безопасность

- ✅ Webhook защищён секретным токеном
- ✅ Edge Function проверяет Authorization header
- ✅ Bot token хранится в Supabase Secrets
- ✅ Только INSERT события вызывают уведомления
