# CondoSaaS — Railway Deployment Guide

## Architecture on Railway

You'll create **3 services** in a single Railway project:

```
┌─────────────────────────────────────────┐
│          Railway Project                │
│                                         │
│  ┌───────────┐  ┌────────┐  ┌───────┐  │
│  │  Frontend │  │Backend │  │Postgres│  │
│  │  (nginx)  │──│(Node)  │──│  (DB)  │  │
│  └───────────┘  └────────┘  └───────┘  │
└─────────────────────────────────────────┘
```

## Step-by-step

### 1. Create Railway Project

Go to [railway.app](https://railway.app) and create a new project.

### 2. Add PostgreSQL

- Click "New Service" → "Database" → "PostgreSQL"
- Railway auto-generates the `DATABASE_URL` variable

### 3. Deploy Backend

- Click "New Service" → "GitHub Repo" (or "Deploy from Local")
- Set the **root directory** to `backend`
- Railway will detect the `railway.toml` and use the Dockerfile

**Environment variables to set:**

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Reference the Postgres service |
| `JWT_SECRET` | *(generate a strong random string)* | `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifetime |
| `NODE_ENV` | `production` | |
| `ALLOWED_ORIGINS` | `https://your-frontend.up.railway.app` | Comma-separated if multiple |
| `PORT` | `3001` | Railway assigns automatically, but set for clarity |

### 4. Deploy Frontend

- Click "New Service" → "GitHub Repo" (or "Deploy from Local")
- Set the **root directory** to `frontend`
- Railway will detect the `railway.toml` and use the Dockerfile

**Build-time environment variable:**

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api` | Points to the backend service |

> Railway injects build-time env vars during the Docker build. For Vite, prefix with `VITE_`.

### 5. Run Initial Seed (one-time)

After the first deploy, run the seed to create the super admin:

```bash
# Via Railway CLI
railway run --service backend -- node prisma/seed.js

# Or via Railway dashboard → Backend service → Settings → Run Command
node prisma/seed.js
```

## Custom Domain (Optional)

1. Go to each service → Settings → Networking
2. Click "Generate Domain" for a `*.up.railway.app` subdomain
3. Or add your custom domain and configure DNS

## Environment Variable Reference

### Backend (required)

```env
DATABASE_URL=postgresql://...     # From Railway Postgres
JWT_SECRET=your-secret-here       # Strong random string
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend (build-time)

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Local Development with Docker

```bash
# Start everything (postgres + backend + frontend)
docker compose up --build

# Access:
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
# Postgres: localhost:5432

# Stop
docker compose down

# Reset database
docker compose down -v
docker compose up --build
```

## Login Credentials (from seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@condosaas.com | admin123 |
| Community Admin | admin@demo-residencial.com | community123 |

> Change these immediately after first deploy.
