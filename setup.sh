#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo "  VaultBridge — Project Setup"
echo "============================================"
echo ""

# -----------------------
# 1. Prerequisite checks
# -----------------------

echo "🔍 Checking prerequisites..."

command -v node >/dev/null 2>&1 || {
  echo "Node.js is required (>=18)"
  exit 1
}

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js >=18 is required. Current: $(node -v)"
  exit 1
fi

command -v npm >/dev/null 2>&1 || {
  echo "❌ npm is required."
  exit 1
}

echo "   ✅ Node.js $(node -v)"
echo "   ✅ npm $(npm -v)"
echo ""

# -----------------------
# 2. Backend setup
# -----------------------

echo "📦 Setting up backend..."

BACKEND_DIR="$ROOT_DIR/backend"

if [ ! -d "$BACKEND_DIR" ]; then
  echo "❌ backend/ directory not found."
  exit 1
fi

cd "$BACKEND_DIR"

# Install dependencies
echo "   → Installing backend dependencies..."
npm install

# Environment file
if [ ! -f .env ]; then
  echo ""
  echo "   ⚠️  No .env file found in backend/. Creating from template..."
  cat > .env <<'ENVTEMPLATE'
# ──────────────────────────────────────────────
# VaultBridge Backend — Environment Variables
# ──────────────────────────────────────────────

# Google OAuth 2.0 credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# PostgreSQL connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vaultbridge

# JWT secret (min 32 chars)
JWT_SECRET=change_this_to_a_secure_random_string_at_least_32_chars

# Encryption key for refresh tokens (64-char hex string)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=0000000000000000000000000000000000000000000000000000000000000000

# Server
PORT=3000
NODE_ENV=development
ENVTEMPLATE

  echo "   📝 Created backend/.env — please update it with your actual credentials."
  echo ""
fi

# Prisma setup
if [ -d prisma ]; then
  echo "   → Generating Prisma client..."
  npx prisma generate

  echo "   → Pushing database schema..."
  echo "     (Make sure PostgreSQL is running and DATABASE_URL in .env is correct)"
  npx prisma db push --accept-data-loss 2>/dev/null || {
    echo "   ⚠️  Could not push schema. Ensure PostgreSQL is running and DATABASE_URL is set."
    echo "      Run manually later: cd backend && npx prisma db push"
  }
fi

# TypeScript build check
echo "   → Verifying TypeScript compilation..."
npx tsc --noEmit || {
  echo "   ⚠️  TypeScript compilation has errors. Check the output above."
}

echo "   ✅ Backend setup complete."
echo ""

# -----------------------
# 3. Frontend setup
# -----------------------

echo "📦 Setting up frontend..."

FRONTEND_DIR="$ROOT_DIR/frontend"

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "❌ frontend/ directory not found."
  exit 1
fi

cd "$FRONTEND_DIR"

# Install dependencies
echo "   → Installing frontend dependencies..."
npm install

# TypeScript + Vite build check
echo "   → Verifying frontend build..."
npm run build || {
  echo "   ⚠️  Frontend build failed. Check the output above."
}

echo "   ✅ Frontend setup complete."
echo ""

# -----------------------
# 4. Summary
# -----------------------

echo "============================================"
echo "  ✅ Setup Complete!"
echo "============================================"
echo ""
echo "  Before running, make sure you have:"
echo ""
echo "  1. PostgreSQL running locally"
echo "  2. Updated backend/.env with:"
echo "     • GOOGLE_CLIENT_ID"
echo "     • GOOGLE_CLIENT_SECRET"
echo "     • GOOGLE_REDIRECT_URI"
echo "     • DATABASE_URL"
echo "     • JWT_SECRET (min 32 chars)"
echo "     • ENCRYPTION_KEY (64-char hex)"
echo ""
echo "  To start the app:"
echo ""
echo "    # Terminal 1 — Backend (port 3000)"
echo "    cd backend && npm run dev"
echo ""
echo "    # Terminal 2 — Frontend (port 5173)"
echo "    cd frontend && npm run dev"
echo ""
echo "  Frontend proxies /api/* calls to the backend."
echo "============================================"
