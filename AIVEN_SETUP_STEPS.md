# Aiven Database Setup - Step by Step

## Шаг 1: Получи connection string от Aiven

1. Зайди в Aiven Console
2. Открой свой PostgreSQL сервис
3. Найди **Connection information**
4. Скопируй **Service URI** - он выглядит так:

```
postgresql://avnadmin:password@hostname-project.aivencloud.com:12345/defaultdb?sslmode=require
```

⚠️ **Важно**: Сохрани этот connection string - он понадобится для локальной настройки и Vercel.

---

## Шаг 2: Проверь подключение к базе

Выполни эту команду чтобы проверить что база доступна:

```bash
psql "postgresql://avnadmin:password@hostname-project.aivencloud.com:12345/defaultdb?sslmode=require" -c "SELECT version();"
```

Если видишь версию PostgreSQL - все работает! ✅

Если ошибка:
- Проверь что твой IP добавлен в Aiven Allowed IP addresses
- Проверь что `sslmode=require` присутствует в URL

---

## Шаг 3: Создай локальный .env.local файл

В корне проекта создай файл `.env.local`:

```bash
# В директории /tmp/context8-landing-repo
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://твой-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="temporary-secret-change-in-production"
EOF
```

Замени `твой-connection-string` на реальный URL от Aiven.

---

## Шаг 4: Примени миграции к базе данных

### Вариант A: Через psql (рекомендуется для первого раза)

```bash
# Применить инициальную миграцию
psql "$DATABASE_URL" < drizzle/migrations/0000_init.sql
```

Должен увидеть:
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
...
NOTICE: Tables created successfully!
```

### Вариант B: Через drizzle-kit (если есть .env.local)

```bash
cd /tmp/context8-landing-repo
npm run db:push
```

---

## Шаг 5: Проверь что таблицы созданы

```bash
psql "$DATABASE_URL" -c "\dt"
```

Должен увидеть список таблиц:
```
              List of relations
 Schema |      Name          | Type  |  Owner
--------+--------------------+-------+----------
 public | account            | table | avnadmin
 public | session            | table | avnadmin
 public | user               | table | avnadmin
 public | usage_metrics      | table | avnadmin
 public | verificationToken  | table | avnadmin
(5 rows)
```

---

## Шаг 6: Проверь структуру таблицы users

```bash
psql "$DATABASE_URL" -c "\d user"
```

Должен увидеть:
```
                    Table "public.user"
    Column     |           Type           | Nullable
---------------+--------------------------+----------
 id            | text                     | not null
 name          | text                     |
 email         | text                     | not null
 emailVerified | timestamp                |
 image         | text                     |
 password      | text                     |
Indexes:
    "user_pkey" PRIMARY KEY, btree (id)
    "user_email_key" UNIQUE CONSTRAINT, btree (email)
```

---

## Шаг 7: Тестовая вставка (опционально)

Можешь проверить что все работает:

```bash
psql "$DATABASE_URL" << 'SQL'
-- Создать тестового пользователя
INSERT INTO "user" (id, name, email, password)
VALUES (
  gen_random_uuid()::text,
  'Test User',
  'test@example.com',
  '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BRVYG'  -- пароль: "password123"
);

-- Проверить что пользователь создан
SELECT id, name, email FROM "user" WHERE email = 'test@example.com';
SQL
```

Для удаления тестового пользователя:

```bash
psql "$DATABASE_URL" -c "DELETE FROM \"user\" WHERE email = 'test@example.com';"
```

---

## Шаг 8: Настрой переменные в Vercel

1. Зайди в Vercel Dashboard → твой проект → Settings → Environment Variables

2. Добавь эти переменные для **Production, Preview, Development**:

```
DATABASE_URL = postgresql://твой-aiven-connection-string
NEXTAUTH_URL = https://context8.markets
NEXTAUTH_SECRET = [генерируй новый секрет ниже]
```

3. Генерируй NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Скопируй вывод и вставь как значение `NEXTAUTH_SECRET`.

4. (Опционально) Для Google OAuth добавь:

```
GOOGLE_CLIENT_ID = твой-google-client-id
GOOGLE_CLIENT_SECRET = твой-google-client-secret
```

---

## Шаг 9: Задеплой на Vercel

```bash
cd /tmp/context8-landing-repo
vercel --prod --yes
```

Или просто запуш на GitHub - Vercel задеплоит автоматически:

```bash
git push origin main
```

---

## Шаг 10: Тестируй на проде

1. Открой https://context8.markets/login

2. Попробуй зарегистрироваться:
   - Имя: John Doe
   - Email: john@example.com
   - Пароль: password123 (минимум 8 символов)

3. После регистрации должен автоматически залогиниться и попасть на /dashboard

4. Проверь что пользователь в базе:

```bash
psql "$DATABASE_URL" -c "SELECT id, name, email FROM \"user\";"
```

---

## Troubleshooting

### ❌ Connection refused / Connection timeout

**Проблема**: Не можешь подключиться к Aiven

**Решение**:
1. Проверь Allowed IP addresses в Aiven Console
2. Добавь свой текущий IP: https://whatismyipaddress.com/
3. Или добавь `0.0.0.0/0` для доступа отовсюду (не рекомендуется для прода)

### ❌ SSL connection required

**Проблема**: `connection requires SSL`

**Решение**: Убедись что в connection string есть `?sslmode=require`

### ❌ relation "user" does not exist

**Проблема**: Таблицы не созданы

**Решение**: Повтори Шаг 4 - примени миграции заново

### ❌ duplicate key value violates unique constraint "user_email_key"

**Проблема**: Email уже зарегистрирован

**Решение**: Это нормально! Используй другой email или удали старого пользователя:

```bash
psql "$DATABASE_URL" -c "DELETE FROM \"user\" WHERE email = 'твой@email.com';"
```

---

## Полезные команды

```bash
# Посмотреть все таблицы
psql "$DATABASE_URL" -c "\dt"

# Посмотреть структуру таблицы
psql "$DATABASE_URL" -c "\d user"

# Посмотреть всех пользователей
psql "$DATABASE_URL" -c "SELECT * FROM \"user\";"

# Посмотреть все сессии
psql "$DATABASE_URL" -c "SELECT * FROM \"session\";"

# Удалить все данные (осторожно!)
psql "$DATABASE_URL" -c "TRUNCATE \"user\", \"account\", \"session\", \"verificationToken\", \"usage_metrics\" CASCADE;"

# Удалить все таблицы (если нужно начать заново)
psql "$DATABASE_URL" << 'SQL'
DROP TABLE IF EXISTS "usage_metrics" CASCADE;
DROP TABLE IF EXISTS "verificationToken" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
SQL
```

---

## Готово! 🎉

Теперь у тебя:
- ✅ База данных на Aiven с правильной схемой
- ✅ Email/password аутентификация
- ✅ Google OAuth (если настроил)
- ✅ Деплой на Vercel с подключенной базой

Попробуй залогиниться на https://context8.markets/login!
