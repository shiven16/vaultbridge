# VaultBridge

**VaultBridge** is a full-stack Google account file migration tool that lets you transfer files between two Google accounts across Google Drive, Gmail Attachments, and Google Cloud Storage. Files are streamed directly from source to destination — no intermediate disk writes.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Transfer Pipeline](#transfer-pipeline)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Security](#security)

---

## Features

- **Dual Google OAuth** — connect a source and destination Google account independently
- **Google Drive** — browse, sort, and transfer files from Drive
- **Gmail Attachments** — extract and migrate email attachments, displayed as Sender: Subject
- **Google Cloud Storage** — transfer GCS bucket objects
- **Streamed Transfers** — files are piped directly source to destination with no disk I/O
- **Copy and Move modes** — clone files or move (auto-delete source after successful transfer)
- **Real-time transfer status** — live progress tracking per file
- **Automatic retry** — failed transfers are retried up to 5 times via a background cron job
- **File sorting** — sort by size or date, applied client-side across all source types
- **Rate limiting, Helmet, CORS** — production-hardened Express backend
- **Unit and integration tests** — Vitest for both frontend and backend

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│  React + Vite + Tailwind CSS v4                         │
│  ┌───────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Auth Flow │  │   Dashboard   │  │ Transfer Panel  │  │
│  └───────────┘  └───────────────┘  └─────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (proxied via Vite in dev)
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Express Backend (Node.js)                 │
│                                                         │
│  /auth      Google OAuth 2.0 (source + destination)     │
│  /sources   Drive, Gmail, GCS file listing + quota      │
│  /drive     Destination Drive file listing + quota      │
│  /transfer  Initiate batch transfers, poll status       │
│                                                         │
│  Transfer Engine: download stream -> upload stream      │
│  Retry Cron: retries failed transfers every 5 minutes   │
└────────────┬──────────────────────────┬─────────────────┘
             │                          │
             ▼                          ▼
    Google APIs                   PostgreSQL
    (Drive v3, Gmail v1,          (via Prisma ORM)
     GCS, OAuth2)
```

---

## Project Structure

```
vaultbridge/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma              # DB schema (User, Transfer models)
│   ├── src/
│   │   ├── app.ts                     # Express app setup (middlewares, routes)
│   │   ├── server.ts                  # HTTP server entry point + graceful shutdown
│   │   ├── config/
│   │   │   ├── env.ts                 # Zod-validated environment variables
│   │   │   ├── db.config.ts           # Database configuration
│   │   │   └── google.config.ts       # Google OAuth2 client factory
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── drive.controller.ts
│   │   │   ├── sources.controller.ts
│   │   │   └── transfer.controller.ts
│   │   ├── services/
│   │   │   ├── drive.service.ts       # Drive list/upload/download/delete + quota
│   │   │   ├── gmail.service.ts       # Gmail attachment list + download
│   │   │   ├── gcs.service.ts         # GCS bucket file list + download
│   │   │   ├── google.service.ts      # OAuth token management + refresh
│   │   │   └── transfer.service.ts    # Transfer queue, execution, retry logic
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── drive.routes.ts
│   │   │   ├── sources.routes.ts
│   │   │   └── transfer.routes.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts     # JWT verification
│   │   │   └── error.middleware.ts    # Global error handler
│   │   ├── cron/
│   │   │   └── retry.cron.ts          # Auto-retry failed transfers (every 5 min)
│   │   ├── database/
│   │   │   └── prisma.ts              # Prisma client singleton
│   │   └── utils/
│   │       ├── encryption.util.ts     # AES-256 refresh token encryption
│   │       ├── retry.util.ts          # Exponential-backoff retry wrapper
│   │       └── logger.ts              # Structured logger
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── logo.png
│   │   └── favicon.png
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.api.ts            # Auth session endpoints
│   │   │   ├── drive.api.ts           # listFiles, getStorageQuota
│   │   │   └── transfer.api.ts        # Transfer initiation and polling
│   │   ├── components/
│   │   │   ├── FileItem.tsx           # Single file row with icon and checkbox
│   │   │   ├── FileList.tsx           # File grid with sort dropdown and pagination
│   │   │   ├── TransferPanel.tsx      # Right-side panel: queue, start, status
│   │   │   └── TransferStatus.tsx     # Per-file transfer progress display
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # Global auth state (source + destination)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts             # Auth state hook
│   │   │   └── useTransfer.ts         # Transfer lifecycle hook
│   │   ├── pages/
│   │   │   ├── Home.tsx               # Landing page
│   │   │   ├── Login.tsx              # OAuth connect page (with backend wake-up)
│   │   │   ├── Dashboard.tsx          # Main workspace
│   │   │   └── Callback.tsx           # OAuth callback handler
│   │   └── utils/
│   │       └── apiClient.ts           # Axios instance with credentials
│   └── package.json
│
└── .github/
    └── workflows/
        └── ci.yml                     # Lint + format + test on push/PR
```

---

## Prerequisites

- **Docker** (for running the backend)
- **Node.js** >= 18 (for the frontend)
- **npm** >= 9
- A PostgreSQL connection string (local instance or any hosted provider)
- A **Google Cloud Console** project with:
  - OAuth 2.0 credentials (Client ID + Secret)
  - **Google Drive API** enabled
  - **Gmail API** enabled
  - **Google Cloud Storage API** enabled
  - Authorized redirect URIs configured

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/shiven16/vaultbridge.git
cd vaultbridge
```

### 2. Backend (Docker)

```bash
cd backend
cp .env.example .env   # fill in your credentials — see Environment Variables below

docker build -t vaultbridge-backend .
docker run -p 3000:3000 --env-file .env vaultbridge-backend
```

Backend runs on **http://localhost:3000**.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**.  
Vite proxies all `/api/*` requests to `http://localhost:3000`.

---

## Environment Variables

Create `backend/.env` with the following:

```env
# Google OAuth 2.0 credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# PostgreSQL connection string
# Neon: postgresql://user:pass@host/db?sslmode=require&pgbouncer=true
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vaultbridge

# JWT secret (minimum 32 characters)
JWT_SECRET=change_this_to_a_secure_random_string_at_least_32_chars

# AES-256 encryption key for refresh tokens (exactly 64 hex characters)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=0000000000000000000000000000000000000000000000000000000000000000

# Server
PORT=3000
NODE_ENV=development

# Restricts CORS to this origin in production
FRONTEND_URL=http://localhost:5173
```

> All variables are validated at startup using Zod. The server will refuse to start if any required variable is missing or malformed.

---

## Transfer Pipeline

### Copy

```
1. DOWNLOAD  — Stream file from source account (Drive / Gmail / GCS)
       |
2. UPLOAD    — Stream directly to destination Drive (no disk write)
       |
3. UPDATE    — Mark transfer record as "success" or "failed" in the database
```

### Move

```
1. DOWNLOAD  — Stream file from source account (Drive / Gmail / GCS)
       |
2. UPLOAD    — Stream directly to destination Drive (no disk write)
       |
3. DELETE    — Delete the source file after a successful upload
       |
4. UPDATE    — Mark transfer record as "success" or "failed" in the database
```

**Concurrency:** Up to 3 transfers run in parallel per user. Remaining files are queued as `pending` and processed as slots open.

**Retry:** A cron job runs every 5 minutes. Failed transfers with fewer than 5 retries are reset to `pending` and re-queued automatically.

---

## Testing

### Frontend

```bash
cd frontend
npm run test          # run all tests once
npm run test:ui       # open Vitest UI
```

Coverage includes:
- `FileItem.test.tsx` — renders correctly, handles MIME types, checkbox interaction
- `drive.api.test.ts` — API client behaviour

### Backend

```bash
cd backend
npm run test          # run all tests once
npm run test:watch    # watch mode
```

Coverage includes:
- `app.integration.test.ts` — Express routes, middleware, health endpoint
- `encryption.util.test.ts` — AES-256 encrypt/decrypt round-trip

---

## Code Quality

Both frontend and backend enforce consistent code style.

```bash
# Lint
npm run lint

# Auto-format all files
npm run format

# Check formatting without writing (used in CI)
npm run format:check
```

- **ESLint** — `react-hooks` rules enforced in frontend; TypeScript strict rules in backend
- **Prettier** — consistent formatting across all `.ts` and `.tsx` files

---

## Security

| Mechanism | Details |
|---|---|
| **OAuth 2.0** | All Google account access via standard OAuth — no passwords stored |
| **Refresh token encryption** | Tokens encrypted at rest with AES-256-GCM using a 64-char hex `ENCRYPTION_KEY` |
| **JWT sessions** | Short-lived JWTs stored in `HttpOnly` cookies |
| **Rate limiting** | 100 requests per 15 minutes per IP |
| **Helmet** | Sets secure HTTP headers (HSTS, XSS protection, etc.) |
| **CORS** | Locked to `FRONTEND_URL` in production |
| **Zod validation** | All env vars and request inputs are runtime-validated |
| **No disk writes** | File content is streamed end-to-end — never written to the server's disk |
