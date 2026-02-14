#!/usr/bin/env bash
set -euo pipefail

ZITADEL_URL="http://localhost:8080"
MAX_WAIT=120
INTERVAL=3

echo "==> Starting Zitadel + Postgres..."
docker compose -f docker-compose.dev.yaml up -d

echo "==> Waiting for Zitadel to be ready (up to ${MAX_WAIT}s)..."
elapsed=0
while [ "$elapsed" -lt "$MAX_WAIT" ]; do
  if curl -sf "${ZITADEL_URL}/debug/ready" > /dev/null 2>&1; then
    echo "    Zitadel is ready!"
    break
  fi
  sleep "$INTERVAL"
  elapsed=$((elapsed + INTERVAL))
  echo "    waiting... (${elapsed}s)"
done

if [ "$elapsed" -ge "$MAX_WAIT" ]; then
  echo "ERROR: Zitadel did not become ready within ${MAX_WAIT}s"
  echo "Check logs: docker compose -f docker-compose.dev.yaml logs zitadel"
  exit 1
fi

echo ""
echo "========================================="
echo "  Zitadel is running!"
echo "========================================="
echo ""
echo "Console:  ${ZITADEL_URL}/ui/console"
echo "Login:    admin@context8.local / Password1!"
echo ""
echo "--- Manual setup steps ---"
echo ""
echo "1. Open ${ZITADEL_URL}/ui/console"
echo "2. Log in with admin@context8.local / Password1!"
echo "3. Create a new Project (e.g. 'context8')"
echo "4. In the project, create a new Application:"
echo "   - Name: context8-spa"
echo "   - Type: Web / User Agent (SPA)"
echo "   - Auth method: PKCE"
echo "   - Redirect URIs: http://localhost:5173/auth/callback"
echo "   - Post-logout URIs: http://localhost:5173"
echo "5. Copy the Client ID from the application settings"
echo "6. Copy the Project ID (Project Settings / General)"
echo "7. Set both in .env.local:"
echo "   VITE_ZITADEL_CLIENT_ID=<your-client-id>"
echo "   VITE_ZITADEL_PROJECT_ID=<your-project-id>"
echo ""
echo "Done! Run 'npm run dev' to start the app."
