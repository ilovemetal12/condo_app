# CondoSaaS — Railway Deployment Guide

## Architecture

Single-service deploy: Railway builds the frontend, then runs the backend which serves both the API and the frontend static files from the same origin.

```
┌───────────────────────────────────────┐
│        Railway Project                │
│                                       │
│  ┌─────────────────┐   ┌──────────┐  │
│  │  App Service     │   │ Postgres │  │
│  │  (API + Static)  │───│   (DB)   │  │
│  └─────────────────┘   └──────────┘  │
└───────────────────────────────────────┘
```

## Step-by-step

### 1. Create Railway Project

Go to [railway.app](https://railway.app) and create a new project.

### 2. Add PostgreSQL

- Click **"New"** → **"Database"** → **"PostgreSQL"**
- Railway auto-generates the `DATABASE_URL` variable

### 3. Deploy the App

- Click **"New"** → **"GitHub Repo"** → select `condo_app`
- Railway detects `railway.toml` at root and uses it automatically
- **No root directory needed** — it builds from the repo root

The `railway.toml` handles:
- **Build**: installs frontend deps, builds React app, installs backend deps, generates Prisma client
- **Deploy**: runs Prisma migrations, starts the Express server (which serves both API + frontend)

### 4. Set Environment Variables

Go to the app service → **Variables** tab:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Click **"Add Reference"** → select PostgreSQL service → `DATABASE_URL` |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

> No `ALLOWED_ORIGINS` or `VITE_API_URL` needed — everything runs on the same domain.

### 5. Generate a Public Domain

Go to app service → **Settings** → **Networking** → **"Generate Domain"**

Your app will be live at `https://your-app.up.railway.app`

### 6. Run the Seed (one time)

After first deploy, seed the database with the admin user:

```bash
# Via Railway CLI
railway run -- node backend/prisma/seed.js
```

Or temporarily add to the start command in railway.toml:
```
startCommand = "cd backend && npx prisma migrate deploy && node prisma/seed.js && node src/app.js"
```
Deploy once, then remove `node prisma/seed.js` from the command.

## Local Development

```bash
# Start Postgres
docker compose up -d

# Install all dependencies
npm run install:all

# Run database migration
npm run db:migrate

# Seed database
npm run db:seed

# Terminal 1: Backend (port 3001)
npm run dev:backend

# Terminal 2: Frontend (port 5173, proxies API to 3001)
npm run dev:frontend
```

### Vite Dev Proxy

During local development, the frontend dev server (port 5173) proxies `/api` requests to the backend (port 3001) via the Vite config. In production, they're the same server.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Strong random string for signing tokens |
| `JWT_EXPIRES_IN` | No | Access token lifetime (default: `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh token lifetime (default: `7d`) |
| `NODE_ENV` | No | `production` or `development` |
| `PORT` | No | Server port (default: `3001`) |

## Login Credentials (from seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@condosaas.com | admin123 |
| Community Admin | admin@demo-residencial.com | community123 |

> Change these immediately after first deploy.
