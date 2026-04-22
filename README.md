# VaultBridge

**VaultBridge** is a secure, full-stack Google account file migration tool — *The Digital Atelier* — that lets you seamlessly transfer files between two Google accounts across Google Drive, Gmail Attachments, and Google Cloud Storage, all streamed end-to-end via an encrypted pipeline.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Quick Setup (Automated)](#quick-setup-automated)
  - [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Pages & Components](#frontend-pages--components)
- [Transfer Pipeline](#transfer-pipeline)
- [File Sorting & Storage Display](#file-sorting--storage-display)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [CI/CD Pipeline](#cicd-pipeline)
- [Infrastructure (AWS ECS + Terraform)](#infrastructure-aws-ecs--terraform)
- [Security](#security)
- [Contributing](#contributing)

---

## Features

- 🔐 **Dual Google OAuth** — connect a source and destination Google account independently
- 📁 **Google Drive** — browse, sort, and transfer files from Drive
- 📧 **Gmail Attachments** — extract and migrate email attachments
- ☁️ **Google Cloud Storage** — transfer GCS bucket objects
- ⚡ **Streamed Transfers** — files are piped directly source → backend → destination with no disk I/O
- 🔄 **Copy & Move modes** — clone files or move (auto-delete source after transfer)
- 📊 **Real-time transfer status** — live progress tracking per file
- 🔁 **Automatic retry** — failed transfers are retried up to 5 times via a cron job
- 🗂️ **File sorting** — sort by size (large → small) or date (newest/oldest), applied client-side across all source types
- 💾 **Available storage display** — shows available Google Drive space in the correct unit (GB/TB) truncated to 2 decimal places
- 🛡️ **Rate limiting, Helmet, CORS** — production-hardened Express backend
- 🧪 **Unit & integration tests** — Vitest for both frontend and backend

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                       Browser                           │
│  React + Vite + Tailwind CSS v4                         │
│  ┌───────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │ Auth Flow │  │   Dashboard   │  │  Transfer Panel │ │
│  └───────────┘  └───────────────┘  └─────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (proxied via Vite)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Express Backend (Node.js)                  │
│                                                         │
│  /auth      Google OAuth 2.0 (source + destination)    │
│  /sources   Drive, Gmail, GCS file listing + quota     │
│  /drive     Destination Drive file listing + quota     │
│  /transfer  Initiate batch transfers, poll status      │
│                                                         │
│  Transfer Engine: download stream → upload stream      │
│  Retry Cron: retries failed transfers every 5 min      │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
           ▼                          ▼
  Google APIs                  PostgreSQL (Neon)
  (Drive v3, Gmail v1,        (via Prisma ORM)
   GCS, OAuth2)
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | v4 | Utility-first styling |
| React Router DOM | v7 | Client-side routing |
| Axios | 1.x | HTTP client |
| Vitest | 4 | Unit testing |
| ESLint + Prettier | latest | Linting & formatting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18 | Runtime |
| Express | 4 | HTTP framework |
| TypeScript | 5 | Type safety |
| Prisma | 5 | ORM + migrations |
| PostgreSQL | any | Database (Neon recommended) |
| googleapis | 144 | Google Drive, Gmail, GCS APIs |
| Zod | 3 | Runtime env + request validation |
| Helmet | latest | HTTP security headers |
| express-rate-limit | 7 | Rate limiting |
| JWT + cookie-parser | — | Session authentication |
| Vitest | 4 | Integration & unit testing |
| ESLint + Prettier | latest | Linting & formatting |

### Infrastructure & DevOps
| Technology | Purpose |
|---|---|
| GitHub Actions | CI (lint, format check, tests) |
| AWS ECS Fargate | Container-based deployment |
| AWS ECR | Docker image registry |
| Terraform | Infrastructure as Code |

---

## Project Structure

```
vaultbridge/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # DB schema (User, Transfer models)
│   ├── src/
│   │   ├── app.ts                 # Express app setup (middlewares, routes)
│   │   ├── server.ts              # HTTP server entry point + graceful shutdown
│   │   ├── config/
│   │   │   ├── env.ts             # Zod-validated environment variables
│   │   │   ├── db.config.ts       # Database configuration
│   │   │   └── google.config.ts   # Google OAuth2 client factory
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── drive.controller.ts
│   │   │   ├── sources.controller.ts
│   │   │   └── transfer.controller.ts
│   │   ├── services/
│   │   │   ├── drive.service.ts   # Drive list/upload/download/delete + quota
│   │   │   ├── gmail.service.ts   # Gmail attachment list + download
│   │   │   ├── gcs.service.ts     # GCS bucket file list + download
│   │   │   ├── google.service.ts  # OAuth token management + refresh
│   │   │   └── transfer.service.ts # Transfer queue, execution, retry logic
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── drive.routes.ts
│   │   │   ├── sources.routes.ts
│   │   │   └── transfer.routes.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts  # JWT verification
│   │   │   └── error.middleware.ts # Global error handler
│   │   ├── cron/
│   │   │   └── retry.cron.ts       # Auto-retry failed transfers (every 5 min)
│   │   ├── database/
│   │   │   └── prisma.ts           # Prisma client singleton
│   │   └── utils/
│   │       ├── encryption.util.ts  # AES-256 refresh token encryption
│   │       ├── retry.util.ts       # Exponential-backoff retry wrapper
│   │       └── logger.ts           # Structured logger
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── drive.api.ts        # listFiles, getStorageQuota
│   │   │   ├── auth.api.ts         # Auth session endpoints
│   │   │   └── transfer.api.ts     # Transfer initiation & polling
│   │   ├── components/
│   │   │   ├── FileItem.tsx        # Single file row with icon + checkbox
│   │   │   ├── FileList.tsx        # File grid with sort dropdown + pagination
│   │   │   ├── TransferPanel.tsx   # Right-side panel: queue, start, status
│   │   │   └── TransferStatus.tsx  # Per-file transfer progress display
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Global auth state (source + destination)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts          # Auth state hook
│   │   │   └── useTransfer.ts      # Transfer lifecycle hook
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Login.tsx           # OAuth connect page
│   │   │   ├── Dashboard.tsx       # Main workspace with storage display
│   │   │   └── Callback.tsx        # OAuth callback handler
│   │   └── utils/
│   │       └── apiClient.ts        # Axios instance with credentials
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Lint + format + test on push/PR
│       └── deploy.yml              # ECS deployment (via ECR + Terraform)
├── main.tf                         # Terraform: ECR, ECS Cluster, Task, Service
├── setup.sh                        # One-command local setup script
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18 (20 recommended)
- **npm** ≥ 9
- **PostgreSQL** running locally, or a [Neon](https://neon.tech) serverless connection string
- A **Google Cloud Console** project with:
  - OAuth 2.0 credentials (Client ID + Secret)
  - **Google Drive API** enabled
  - **Gmail API** enabled
  - **Google Cloud Storage API** enabled
  - Authorized redirect URIs configured

---

## Getting Started

### Quick Setup (Automated)

Run the setup script from the root of the repository:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
1. Check Node.js ≥ 18 and npm are installed
2. Install backend dependencies and scaffold a `.env` template
3. Generate the Prisma client and push the schema to your database
4. Install frontend dependencies and verify the Vite build

Then update `backend/.env` with your credentials (see [Environment Variables](#environment-variables)) and start both servers.

---

### Manual Setup

#### 1. Clone the repository

```bash
git clone https://github.com/shiven16/vaultbridge.git
cd vaultbridge
```

#### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # or create .env manually (see below)

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start dev server (hot-reload via tsx)
npm run dev
```

Backend runs on **http://localhost:3000**.

#### 3. Frontend

```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```

Frontend runs on **http://localhost:5173**.  
Vite proxies all `/api/*` requests to `http://localhost:3000`.

---

## Environment Variables

Create `backend/.env` with the following:

```env
# ──────────────────────────────────────────────
# VaultBridge Backend — Environment Variables
# ──────────────────────────────────────────────

# Google OAuth 2.0 credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# PostgreSQL connection string
# Local:   postgresql://postgres:postgres@localhost:5432/vaultbridge
# Neon:    postgresql://user:pass@host/db?sslmode=require&pgbouncer=true
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vaultbridge

# JWT secret (minimum 32 characters)
JWT_SECRET=change_this_to_a_secure_random_string_at_least_32_chars

# AES-256 encryption key for refresh tokens (exactly 64 hex characters)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=0000000000000000000000000000000000000000000000000000000000000000

# Server
PORT=3000
NODE_ENV=development

# Optional — restricts CORS to this origin in production
FRONTEND_URL=http://localhost:5173
```

> **Note:** All variables are validated at startup using Zod. The server will refuse to start if any required variable is missing or malformed.

---

## API Reference

All endpoints are prefixed with the backend base URL (default: `http://localhost:3000`).

### Auth — `/auth`

| Method | Path | Description |
|---|---|---|
| `GET` | `/auth/google?role=source` | Initiate Google OAuth for source account |
| `GET` | `/auth/google?role=destination` | Initiate Google OAuth for destination account |
| `GET` | `/auth/callback` | OAuth callback — exchanges code for tokens |
| `GET` | `/auth/session` | Get current session (source + destination accounts) |
| `POST` | `/auth/logout` | Clear session |

### Sources (Source Account) — `/sources`

| Method | Path | Query Params | Description |
|---|---|---|---|
| `GET` | `/sources/files` | `sourceType`, `pageToken`, `pageSize`, `orderBy` | List files from Drive / Gmail / GCS |
| `GET` | `/sources/quota` | — | Get Google Drive storage quota (limit, usage, available) |

### Drive (Destination Account) — `/drive`

| Method | Path | Query Params | Description |
|---|---|---|---|
| `GET` | `/drive/files` | `pageToken`, `pageSize`, `orderBy` | List files in destination Drive |
| `GET` | `/drive/quota` | `type` | Get Drive storage quota |

### Transfers — `/transfer`

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/transfer/batch` | `files[]`, `sourceType`, `transferMode` | Queue a batch of file transfers |
| `GET` | `/transfer/:id` | — | Poll status of a single transfer |
| `GET` | `/transfer` | — | List all transfers for current user |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ status: "ok", timestamp }` |

---

## Frontend Pages & Components

### Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Home.tsx` | Landing page |
| `/login` | `Login.tsx` | Connect source and destination Google accounts |
| `/dashboard` | `Dashboard.tsx` | Main workspace — browse, sort, and transfer files |
| `/callback` | `Callback.tsx` | Handles Google OAuth redirect |

### Key Components

| Component | Description |
|---|---|
| `FileList.tsx` | Renders files in a 2-column grid; includes sort dropdown and "Load more" pagination |
| `FileItem.tsx` | Individual file row — icon derived from MIME type, size badge, checkbox |
| `TransferPanel.tsx` | Right sidebar — queued files, copy/move toggle, transfer button, post-transfer reset |
| `TransferStatus.tsx` | Displays live transfer progress per file (pending → in progress → success/failed) |

---

## Transfer Pipeline

Each file transfer follows this 4-step pipeline, entirely server-side:

```
1. DOWNLOAD  — Stream file from source account (Drive / Gmail / GCS)
       ↓
2. PIPE      — Stream directly to upload on destination account (no disk write)
       ↓
3. DELETE    — If transferMode = "move", delete source file after success
       ↓
4. UPDATE    — Mark transfer record as "success" or "failed" in database
```

**Concurrency:** Up to 3 transfers run in parallel per user. Remaining files are queued as `pending` and processed as slots open.

**Retry:** A cron job runs every 5 minutes. Failed transfers with `retryCount < 5` are reset to `pending` and re-queued automatically.

---

## File Sorting & Storage Display

### Sorting

Files can be sorted by:

| Option | Behaviour |
|---|---|
| **Size: Large to Small** *(default)* | Descending numeric sort on `size` field, applied client-side |
| **Date: Newest** | Server-returns-newest-first order (Drive `modifiedTime desc`) |
| **Date: Oldest** | Reverses the fetched list client-side |

Sorting is performed **client-side after fetch** so it works correctly across all source types including Gmail (which has no API-level `orderBy` support).

### Available Storage

The dashboard displays available Google Drive storage in the header badge:

- **Unit** is chosen based on the **total** account storage (e.g., a 5 TB account always shows TB, a 15 GB account shows GB)
- Values are **truncated to exactly 2 decimal places** (not rounded) using `Math.floor(value * 100) / 100`
- Format: `X.XX GB available of Y.YY GB`
- Badge turns **red** with a warning icon if storage usage exceeds 85%

---

## Testing

### Frontend

```bash
cd frontend
npm run test          # run all tests once
npm run test:ui       # open Vitest UI
```

Tests live in `src/**/*.test.ts(x)`. Coverage includes:
- `FileItem.test.tsx` — renders correctly, handles MIME types, checkbox interaction
- `drive.api.test.ts` — API client behaviour

### Backend

```bash
cd backend
npm run test          # run all tests once
npm run test:watch    # watch mode
```

Tests live in `src/**/*.test.ts`. Coverage includes:
- `app.integration.test.ts` — Express routes, middleware, health endpoint
- `encryption.util.test.ts` — AES-256 encrypt/decrypt round-trip

---

## Code Quality

Both frontend and backend enforce consistent code style:

```bash
# Lint
npm run lint

# Check formatting (CI uses this)
npm run format:check

# Auto-format all files
npm run format
```

- **ESLint** — `react-hooks` rules enforced in frontend; TypeScript strict rules in backend
- **Prettier** — consistent formatting across all `.ts` and `.tsx` files

---

## CI/CD Pipeline

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every **push** and **pull request** to `main`:

```
Backend job:    npm ci → eslint → prettier:check → vitest run
Frontend job:   npm ci → eslint → prettier:check → vitest run
```

Both jobs run in parallel on `ubuntu-latest` with Node.js 20.

### Deploy Workflow (`.github/workflows/deploy.yml`)

Deploys to **AWS ECS Fargate** via:

1. Build and tag Docker image
2. Push image to **Amazon ECR**
3. Apply Terraform to update ECS task definition and force new deployment

Required GitHub Secrets for deployment:

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_SESSION_TOKEN` | AWS Academy session token |
| `TF_VAR_subnet_id` | VPC subnet for ECS tasks |
| `TF_VAR_security_group_id` | Security group allowing port 80 |

---

## Infrastructure (AWS ECS + Terraform)

`main.tf` provisions:

| Resource | Name | Details |
|---|---|---|
| ECR Repository | `devops-static-app` | Stores Docker images; `MUTABLE` tags |
| ECS Cluster | `devops-static-app-cluster` | Logical cluster |
| ECS Task Definition | `devops-static-app-task` | Fargate; 256 CPU / 512 MB; port 80 |
| ECS Service | `devops-static-app-service` | `desired_count = 1`; public IP assigned |

```bash
# Initialize and apply
terraform init
terraform apply \
  -var="subnet_id=subnet-xxxxxxxx" \
  -var="security_group_id=sg-xxxxxxxx"
```

> Uses **LabRole** IAM role — compatible with AWS Academy environments that restrict custom IAM role creation.

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
| **No disk writes** | File content is streamed end-to-end — never touches the server's disk |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run linting and tests:
   ```bash
   cd backend && npm run lint && npm run test
   cd frontend && npm run lint && npm run test
   ```
5. Commit with a descriptive message: `git commit -m "feat: add xyz"`
6. Push and open a Pull Request against `main`

All PRs must pass the CI checks (lint + format + tests) before merging.

---

<div align="center">
  <sub>Built with ☕ by the VaultBridge team — The Digital Atelier</sub>
</div>
