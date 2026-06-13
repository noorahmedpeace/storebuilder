# BazaarOS Commerce Cloud

Pakistan-first multi-tenant ecommerce SaaS platform prototype based on the PDF build request.

## Routes

- `/` - product website and platform overview
- `/admin` - Super Admin command center
- `/dashboard` - tenant merchant dashboard
- `/store/oud-reserve` - demo storefront
- `/architecture` - engineering blueprint
- `/operations` - domains, support, feature flags, agency/franchise operations
- `/themes` - theme marketplace and section builder
- `/growth` - SEO, AI, and automation engine
- `/commerce` - payments, couriers, subscriptions, monetization
- `/marketplace` - premium apps and services
- `/security` - tenant isolation, RBAC, audit, WAF, backups

## Current Build

- Next.js App Router with TypeScript and TailwindCSS
- Prisma 7 with PostgreSQL driver adapter and centralized `prisma.config.ts`
- Shared navigation, panels, metrics, and SaaS mock data
- Super Admin modules for stores, subscriptions, revenue, domains, support, feature flags, AI monitoring, and audit/security
- Merchant dashboard modules for products, orders, inventory, customers, marketing, SEO tools, and automation
- Demo storefront with product cards, reviews/trust badges, payments/courier positioning, and WhatsApp checkout CTA
- Prisma schema draft for tenant-safe commerce data using `storeId`
- Mock API handlers for stores, products, orders, and AI campaigns
- RBAC request guard using `x-user-role` and tenant scope through `x-store-id`

## Run

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Database Setup

Start a local Postgres (real Postgres via `embedded-postgres`, no Docker, data
in `./.pgdata`). Leave it running in its own terminal:

```bash
npm run db:local
```

Create `.env` from `.env.example` (the default `DATABASE_URL` already points at
the local server), then run:

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

> Alternatively, set `DATABASE_URL` to a cloud Postgres (Neon/Supabase) and skip
> `npm run db:local`. The Prisma client uses the `@prisma/adapter-pg` driver
> adapter; the migration URL is read from `prisma.config.ts`.

### Seeded logins (password: `password123`)

```text
owner@oudreserve.com   STORE_OWNER (store: oud-reserve)
admin@bazaaros.pk      platform admin
```

### Dev-only API testing without logging in

In development, tenant APIs honor a header bypass so curl works without a
session (production uses the NextAuth session only):

```text
x-user-role: STORE_OWNER
x-store-id: <store id>
```

Platform admin requests:

```text
x-user-role: SUPER_ADMIN
```

## Verify

```bash
npm run lint
npm run build
```

## API Draft

- `GET /api/admin/stores`
- `POST /api/admin/stores`
- `GET /api/products`
- `POST /api/products`
- `GET /api/orders`
- `POST /api/ai/campaigns`

## Next Engineering Milestones

1. Add Prisma, PostgreSQL connection, migrations, and seed data.
2. Add authentication with store-scoped RBAC.
3. Replace mock data with server-side repository functions.
4. Implement product CRUD and order status mutations.
5. Add payment and courier webhook abstractions.
6. Add theme settings, SEO metadata generation, and AI credit tracking.
