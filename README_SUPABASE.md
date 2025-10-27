# Context8 Landing - Supabase Integration

## ✅ Что сделано

1. **Установлен Supabase client** (`@supabase/supabase-js`)
2. **Создан Supabase клиент** (`src/lib/supabase.ts`)
3. **Интегрирована авторизация**:
   - Google OAuth
   - GitHub OAuth
   - Email/Password (авто-регистрация)
4. **Защищённые роуты** - Dashboard требует авторизации
5. **Отображение пользователя** - показывает email на dashboard

## 🚀 Быстрый старт

### Шаг 1: Создай Supabase проект

1. Иди на [https://supabase.com](https://supabase.com)
2. Создай новый проект
3. Скопируй URL и anon key из **Settings** → **API**

### Шаг 2: Настрой .env

Отредактируй `frontend-v2/.env`:

```env
VITE_SUPABASE_URL=https://твой-проект.supabase.co
VITE_SUPABASE_ANON_KEY=твой_anon_key
```

### Шаг 3: Создай таблицы

В Supabase **SQL Editor** выполни:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Шаг 4: Настрой Email Auth

1. **Authentication** → **Providers** → **Email**
2. Включи Email provider
3. Отключи "Confirm email" для разработки (включи в продакшене!)

### Шаг 5: Настрой Google OAuth (опционально)

1. **Authentication** → **Providers** → **Google**
2. Получи credentials из [Google Cloud Console](https://console.cloud.google.com/)
3. Добавь redirect URI: `https://твой-проект.supabase.co/auth/v1/callback`
4. Вставь Client ID и Secret в Supabase

### Шаг 6: Запусти проект

```bash
npm run dev
```

Открой http://localhost:5174/

## 📝 Как это работает

### Регистрация/Вход

1. **Google/GitHub OAuth**:
   - Выбери опцию 1 или 2
   - Редирект на OAuth провайдера
   - После успеха → Dashboard

2. **Email/Password**:
   - Выбери опцию 3
   - Введи email
   - Введи password
   - Если пользователь существует → вход
   - Если нет → автоматическая регистрация + вход

### Защита роутов

Dashboard проверяет авторизацию:
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) navigate('/auth')
```

### Выход

Кнопка "Logout" на Dashboard:
```typescript
await supabase.auth.signOut()
navigate('/')
```

## 🗄️ База данных

Supabase автоматически создаёт таблицы:
- `auth.users` - пользователи
- `auth.sessions` - сессии
- `public.profiles` - профили (создаётся автоматически при регистрации)

## 🔒 Безопасность

- ✅ Row Level Security (RLS) включён
- ✅ Только anon key в фронтенде
- ✅ Автоматическая валидация email
- ✅ Хеширование паролей (bcrypt)
- ✅ JWT токены для сессий

## 📚 Полная документация

Смотри `SUPABASE_SETUP.md` для детальной инструкции по:
- Настройке OAuth провайдеров
- Row Level Security policies
- Дополнительным таблицам
- Production deployment
- Troubleshooting

## 🎯 Следующие шаги

1. [ ] Настрой Supabase проект
2. [ ] Заполни `.env` файл
3. [ ] Создай таблицы через SQL Editor
4. [ ] Протестируй авторизацию
5. [ ] (Опционально) Настрой Google OAuth
6. [ ] Deploy на Vercel/Netlify
