#!/bin/bash

echo "=== Google OAuth Credentials Checker ==="
echo ""

# Load .env.local
set -a
source .env.local 2>/dev/null
set +a

echo "📋 Checking configuration..."
echo ""

# Check if credentials are set
if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "❌ GOOGLE_CLIENT_ID is not set in .env.local"
    exit 1
fi

if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ GOOGLE_CLIENT_SECRET is not set in .env.local"
    exit 1
fi

echo "✅ GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:0:30}..."
echo "✅ GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:0:15}..."
echo ""

# Validate format
if [[ ! "$GOOGLE_CLIENT_ID" =~ \.apps\.googleusercontent\.com$ ]]; then
    echo "⚠️  WARNING: Client ID should end with '.apps.googleusercontent.com'"
    echo "   Your ID: $GOOGLE_CLIENT_ID"
    echo ""
fi

if [[ "$GOOGLE_CLIENT_ID" =~ [[:space:]] ]]; then
    echo "❌ ERROR: Client ID contains spaces!"
    echo "   Remove all spaces from the value"
    exit 1
fi

if [[ "$GOOGLE_CLIENT_SECRET" =~ [[:space:]] ]]; then
    echo "❌ ERROR: Client Secret contains spaces!"
    echo "   Remove all spaces from the value"
    exit 1
fi

echo "🔍 Common issues to check in Google Cloud Console:"
echo ""
echo "1. Redirect URI must be EXACTLY:"
echo "   http://localhost:3000/api/auth/callback/google"
echo ""
echo "2. OAuth Consent Screen:"
echo "   - Must be configured (External or Internal)"
echo "   - Publishing status: Testing or In production"
echo "   - Your email must be in Test users (if Testing)"
echo ""
echo "3. Credentials:"
echo "   - Type: OAuth 2.0 Client ID"
echo "   - Application type: Web application"
echo "   - NOT deleted or disabled"
echo ""
echo "4. Copy credentials correctly:"
echo "   - Click the copy icon (don't manually select text)"
echo "   - No quotes inside the .env.local values"
echo "   - No trailing/leading spaces"
echo ""
echo "=== Try These Steps ==="
echo ""
echo "1. Go to: https://console.cloud.google.com/apis/credentials"
echo "2. Click on your OAuth 2.0 Client ID name"
echo "3. Verify 'Authorized redirect URIs' contains:"
echo "   http://localhost:3000/api/auth/callback/google"
echo "4. Copy Client ID again (click copy icon)"
echo "5. Click 'DOWNLOAD JSON' and check values match .env.local"
echo ""
