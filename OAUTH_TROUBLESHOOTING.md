# OAuth Troubleshooting Guide

## Текущая ошибка: `invalid_client` от Google

Эта ошибка означает что Google не может проверить ваше приложение. Есть 3 возможные причины:

### ✅ Уже проверили:
- Client ID правильный (885019419260-...)
- Client Secret правильный (GOCSPX-...)
- AUTH_SECRET установлен

### ❌ Нужно проверить:

## 1. Redirect URI в Google Console (САМАЯ ЧАСТАЯ ПРОБЛЕМА!)

### Шаги:

1. **Откройте Google Cloud Console:**
   https://console.cloud.google.com/apis/credentials

2. **Найдите ваш OAuth 2.0 Client ID** (885019419260-...)

3. **Кликните на него** (на название, не на иконку редактирования)

4. **Проверьте "Authorized redirect URIs":**

   Должна быть **ТОЧНО** эта строка:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### ⚠️ Частые ошибки:

❌ **НЕПРАВИЛЬНО:**
```
http://localhost:3000/api/auth/callback/google/     ← лишний слэш
https://localhost:3000/api/auth/callback/google    ← https вместо http
http://127.0.0.1:3000/api/auth/callback/google     ← 127.0.0.1 вместо localhost
http://localhost:3000/api/auth/callback           ← нет /google
```

✅ **ПРАВИЛЬНО:**
```
http://localhost:3000/api/auth/callback/google
```

### Как исправить:

1. Кликните "EDIT" (карандаш справа от названия)
2. Прокрутите до "Authorized redirect URIs"
3. **Удалите все существующие URIs**
4. Добавьте новый:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Нажмите SAVE
6. **Подождите 1-2 минуты** (изменения применяются не мгновенно)

## 2. OAuth Consent Screen

1. **Откройте:**
   https://console.cloud.google.com/apis/credentials/consent

2. **Проверьте:**
   - Publishing status: должен быть "Testing" или "In production"
   - User type: External (для тестирования)

3. **Если статус "Testing":**
   - Прокрутите до "Test users"
   - Добавьте ваш Google email
   - Сохраните

## 3. API включены

1. **Откройте:**
   https://console.cloud.google.com/apis/library

2. **Убедитесь что включены:**
   - Google+ API (или People API)
   - Google OAuth2 API

3. **Включите если нужно**

## 4. Очистка и тестирование

После исправления в Google Console:

```bash
# 1. Очистите кэш браузера или используйте режим инкогнито

# 2. Подождите 1-2 минуты для применения изменений Google

# 3. Перезапустите сервер
killall node
npm run dev

# 4. Откройте http://localhost:3000

# 5. Попробуйте "Connect with Google"
```

## 5. Если все еще не работает

Попробуйте **пересоздать OAuth Client**:

1. В Google Console → Credentials
2. Удалите текущий OAuth Client ID
3. Создайте новый:
   - Application type: Web application
   - Name: Context8
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
4. Скопируйте новые Client ID и Client Secret
5. Обновите `.env.local`
6. Перезапустите сервер

## Проверка статуса

После каждого изменения запустите:

```bash
./scripts/test-google-oauth.sh
```

И попробуйте авторизацию заново.

## Дополнительная информация

- Redirect URI должен быть **ТОЧНО** таким как в коде
- Google применяет изменения с задержкой 1-2 минуты
- Браузер может кэшировать старые данные - используйте инкогнито
- Проверьте что в Google Console выбран правильный проект
