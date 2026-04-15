# LaunchKit

A production-ready SaaS boilerplate — auth, payments, transactional email, and deploy configs included. Clone it, fill in your API keys, start shipping.

## What's included

| Feature | Implementation |
|---|---|
| Authentication | Supabase Auth — email/password, JWT, password reset |
| Payments | Stripe — one-time checkout sessions, webhook handling, purchase records |
| Transactional email | Resend — welcome email, password-reset email with custom HTML templates |
| Database | Supabase PostgreSQL via async SQLAlchemy (ORM models, auto-migrate on startup) |
| Dashboard | Protected sidebar layout — Dashboard, Billing, Settings pages |
| Deploy | Dockerfile + railway.toml (backend), vercel.json (frontend) |

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | FastAPI, SQLAlchemy 2 (async), asyncpg |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + JWT verification |
| Payments | Stripe |
| Email | Resend |
| Deploy — backend | Railway (Docker) |
| Deploy — frontend | Vercel |

## Project structure

```
launchkit/
├── frontend/
│   ├── app/
│   │   ├── (auth)/            # login, register, forgot-password, reset-password
│   │   ├── (dashboard)/       # protected: dashboard, billing, settings
│   │   └── page.tsx           # landing page
│   ├── components/
│   │   └── auth/
│   │       └── protected-route.tsx
│   └── lib/
│       ├── stripe.ts          # redirectToCheckout() helper
│       └── supabase.ts        # browser Supabase client
├── backend/
│   ├── main.py                # FastAPI app, CORS, router registration
│   ├── Dockerfile
│   ├── railway.toml
│   ├── requirements.txt
│   ├── core/
│   │   ├── config.py          # Pydantic settings (reads from .env)
│   │   ├── database.py        # async engine, session, Base
│   │   ├── email.py           # Resend wrapper + HTML templates
│   │   └── security.py        # JWT verification, get_current_user
│   ├── models/
│   │   ├── user.py            # User (id, email, supabase_uid, …)
│   │   └── purchase.py        # Purchase (id, user_id, plan, amount, …)
│   ├── routers/
│   │   ├── auth.py            # /auth/register, /auth/me, /auth/forgot-password
│   │   └── billing.py         # /billing/checkout, /billing/webhook, /billing/purchases
│   └── schemas/
│       ├── auth.py
│       └── billing.py
├── .env.example
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- Python 3.12+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- A [Resend](https://resend.com) account

### 1. Clone and configure

```bash
git clone https://github.com/your-org/launchkit.git
cd launchkit
cp .env.example .env
```

Open `.env` and fill in every value (see the [Environment variables](#environment-variables) table below).

### 2. Supabase setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
   - JWT Secret → `SUPABASE_JWT_SECRET`
3. Go to **Project Settings → Database** and copy the connection string → `DATABASE_URL`
   - Replace the scheme with `postgresql+asyncpg://`
4. In **Authentication → URL Configuration**, add `http://localhost:3000` to Redirect URLs

### 3. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload      # → http://localhost:8000
```

Interactive API docs: `http://localhost:8000/docs`

Tables are created automatically on first startup.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev                    # → http://localhost:3000
```

### 5. Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:8000/billing/webhook
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## Environment variables

All variables live in a single `.env` file at the repo root. The backend reads it from `../env` and the frontend uses `NEXT_PUBLIC_*` vars at build time.

### Backend-only

| Variable | Description |
|---|---|
| `DATABASE_URL` | asyncpg connection string — `postgresql+asyncpg://user:pass@host:5432/db` |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (never expose to browser) |
| `SUPABASE_JWT_SECRET` | JWT secret from Supabase Dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_…` or `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_…`) |
| `RESEND_API_KEY` | Resend API key (`re_…`) |
| `RESEND_FROM_EMAIL` | Verified sender address, e.g. `noreply@yourdomain.com` |
| `APP_URL` | Your frontend origin — used for Stripe redirect URLs and password-reset links |
| `APP_ENV` | `development` or `production` |
| `SECRET_KEY` | Long random string for internal signing |
| `CORS_ORIGINS_STR` | Space-separated allowed origins, e.g. `https://yourdomain.com` |

### Frontend (build-time)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_…`) |
| `NEXT_PUBLIC_API_URL` | Backend URL, e.g. `https://your-service.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL, e.g. `https://yourdomain.com` |

---

## Deployment

### Backend → Railway

1. Create a new Railway project and link this repo
2. Set the **Root Directory** to `backend/`
3. Railway auto-detects `railway.toml` and builds the Dockerfile
4. Add all backend env vars in the Railway service settings
5. The `/health` endpoint is used as the healthcheck

### Frontend → Vercel

1. Import the repo in [vercel.com](https://vercel.com)
2. Set the **Root Directory** to `frontend/`
3. Vercel auto-detects Next.js from `vercel.json`
4. Add all `NEXT_PUBLIC_*` env vars in the Vercel project settings
5. Deploy — Vercel handles the rest

### Stripe webhook in production

In the [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
1. Add endpoint: `https://your-backend.up.railway.app/billing/webhook`
2. Select event: `checkout.session.completed`
3. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Adding shadcn/ui components

```bash
cd frontend
npx shadcn@latest add button card input label
```

Components land in `components/ui/` and are ready to import.

## API reference

Full interactive docs at `/docs` when the backend is running:

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | JWT | Create local user row after Supabase signup |
| `POST` | `/auth/me` | JWT | Return current user |
| `POST` | `/auth/forgot-password` | — | Send password-reset email via Resend |
| `POST` | `/billing/checkout` | JWT | Create Stripe checkout session |
| `POST` | `/billing/webhook` | Stripe sig | Handle `checkout.session.completed` |
| `GET` | `/billing/purchases` | JWT | List current user's purchases |
| `GET` | `/health` | — | Healthcheck |
