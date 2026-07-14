# Invoicely

Invoicing SaaS for freelancers: add clients, generate real downloadable PDF invoices, and track paid/unpaid status. Free tier caps at 3 invoices/month; Pro (Stripe subscription) unlocks unlimited invoices.

Built with Next.js (App Router), Postgres/Prisma, Auth.js, and Stripe.

## Features

- **Marketing site** — hero, features, 2-tier pricing (Starter/Pro) linking into signup
- **Auth** — email/password signup & login (Auth.js), persistent sessions
- **Core product** — clients, invoices with line items, real PDF generation, paid/unpaid tracking, all scoped per-user in Postgres
- **Billing** — Stripe Checkout (test mode) → webhook confirms payment → plan upgraded in DB; billing page shows current plan and lets you cancel
- **Plan gating** — Starter plan capped at 3 invoices/month; Pro is unlimited
- **Password reset** — forgot-password email flow via Resend

## Tech stack

| Layer      | Choice                                   |
| ---------- | ----------------------------------------- |
| Frontend   | Next.js 16 (App Router) + Tailwind CSS 4  |
| Backend    | Next.js Route Handlers + Server Actions   |
| Database   | Postgres (Neon) via Prisma ORM            |
| Auth       | Auth.js (NextAuth) v5, Credentials + JWT  |
| Payments   | Stripe Checkout + Webhooks (test mode)    |
| Email      | Resend                                    |
| PDF        | @react-pdf/renderer                       |
| Deployment | Vercel                                    |

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Where to get it |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (e.g. from [neon.tech](https://neon.tech), free tier) |
| `AUTH_SECRET` | Generate with `npx auth secret` |
| `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, your deployed URL in production |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys (test mode) |
| `STRIPE_PRO_PRICE_ID` | A recurring Price on a Stripe Product (Dashboard → Product catalog) |
| `STRIPE_WEBHOOK_SECRET` | See below |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys (free tier) |
| `EMAIL_FROM` | e.g. `Invoicely <onboarding@resend.dev>` for testing |

### 3. Database

```bash
npx prisma migrate deploy   # apply migrations
npx prisma generate         # generate the client
```

### 4. Stripe webhook (local dev)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` secret it prints into `STRIPE_WEBHOOK_SECRET` in `.env`.

### 5. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Testing payments

Use Stripe's test card `4242 4242 4242 4242`, any future expiry date, any CVC, any postal code.

## Deployment (Vercel)

1. Push this repo to GitHub and import it into Vercel.
2. Add all variables from `.env` as Vercel Environment Variables (set `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` to the production URL).
3. Set the Vercel build command to also run migrations: `prisma migrate deploy && next build`.
4. In the Stripe Dashboard, add a webhook endpoint pointing at `https://<your-domain>/api/stripe/webhook`, subscribed to at least `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`. Use the signing secret it gives you as `STRIPE_WEBHOOK_SECRET` in Vercel.

## Project structure

```
src/
  app/                    # routes (App Router)
    (marketing) page.tsx  # landing page
    login/ signup/        # auth pages
    forgot-password/ reset-password/
    dashboard/            # protected app (overview, clients, invoices)
    billing/              # plan + cancel subscription
    api/                  # route handlers (signup, stripe webhook, invoice PDF)
  components/             # client components (forms, buttons)
  lib/                    # auth config, prisma client, stripe, business logic
prisma/
  schema.prisma           # data model
  migrations/
```
