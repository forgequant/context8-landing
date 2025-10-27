# context8-landing Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-27

## Active Technologies

- TypeScript 5.x (via Vite 7), React 19.2 (003-crypto-subscription-payments)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x (via Vite 7), React 19.2: Follow standard conventions

## Recent Changes

- 003-crypto-subscription-payments: Added TypeScript 5.x (via Vite 7), React 19.2

<!-- MANUAL ADDITIONS START -->

## ⚠️ КРИТИЧЕСКИЕ ПРАВИЛА ДЕПЛОЯ

### Vercel Deployment
**НИКОГДА не создавать новый Vercel проект через CLI!**

Проблема: `npx vercel --prod` без линка к существующему проекту создаёт НОВЫЙ проект, теряя все настройки:
- Environment variables
- Custom domains
- Build settings
- Team access

### ✅ ПРАВИЛЬНЫЙ процесс деплоя:

1. **Всегда проверяй существующий проект**:
   ```bash
   # Проверь .vercel/project.json
   cat .vercel/project.json
   ```

2. **Если проект уже связан** (.vercel/ существует):
   ```bash
   # Просто push в GitHub - Vercel автодеплоит
   git push origin main
   ```

3. **Если нужен ручной деплой**:
   ```bash
   # ТОЛЬКО если .vercel/project.json существует
   npx vercel --prod
   ```

4. **Если .vercel/ папки НЕТ**:
   ```bash
   # STOP! НЕ создавай новый проект
   # Вместо этого - линкуй существующий:
   npx vercel link
   # Выбери существующий проект из списка
   # Затем деплой:
   npx vercel --prod
   ```

### 🔴 ЧТО ДЕЛАТЬ если случайно создан новый проект:

1. Удалить новый проект в Vercel Dashboard
2. Удалить `.vercel/` в локальном проекте
3. Линкануть к правильному проекту: `npx vercel link`
4. Восстановить Environment Variables
5. Обновить Supabase Redirect URLs

### 📋 Текущий проект:
- **Название**: `context8-landing`
- **Custom domain**: `context8.markets`
- **Env vars**: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

<!-- MANUAL ADDITIONS END -->
