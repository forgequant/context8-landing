#!/bin/bash

echo "=== Проверка .env.local ==="
echo ""

if [ ! -f .env.local ]; then
    echo "❌ Файл .env.local не найден!"
    echo "Создайте его: cp .env.local.test .env.local"
    exit 1
fi

echo "✅ Файл .env.local существует"
echo ""

# Check for required variables
echo "Проверка переменных:"
echo ""

check_var() {
    if grep -q "^$1=" .env.local; then
        value=$(grep "^$1=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
        if [ -z "$value" ]; then
            echo "❌ $1 - пустое значение"
            return 1
        elif [[ "$value" == "your-"* ]] || [[ "$value" == *"замените"* ]]; then
            echo "⚠️  $1 - содержит placeholder, нужно заменить на реальное значение"
            return 1
        else
            echo "✅ $1 - установлено"
            return 0
        fi
    else
        echo "❌ $1 - отсутствует"
        return 1
    fi
}

errors=0

check_var "AUTH_SECRET" || ((errors++))
check_var "NEXTAUTH_URL" || ((errors++))
check_var "DATABASE_URL" || ((errors++))
check_var "GOOGLE_CLIENT_ID" || ((errors++))
check_var "GOOGLE_CLIENT_SECRET" || ((errors++))
check_var "GITHUB_CLIENT_ID" || ((errors++))
check_var "GITHUB_CLIENT_SECRET" || ((errors++))

echo ""
echo "=== Результат ==="
if [ $errors -eq 0 ]; then
    echo "✅ Все переменные настроены правильно!"
    echo ""
    echo "Теперь перезапустите сервер:"
    echo "  killall node"
    echo "  npm run dev"
else
    echo "❌ Найдено ошибок: $errors"
    echo ""
    echo "Откройте .env.local в редакторе и исправьте:"
    echo "  code .env.local"
    echo "  или"
    echo "  nano .env.local"
    echo ""
    echo "Используйте шаблон из .env.local.test"
fi
