# StoreBuilder Cloud — End‑to‑End Platform Blueprint

> A functional specification of the **entire** platform: every surface, actor, journey,
> module, and how each should work — plus what is **already built** vs **missing**.
> Design/visuals are intentionally out of scope here (this is about *what* and *how it works*).
>
> **Status legend:** ✅ built & working · 🟡 partial / mock / local-only · ❌ not built yet

---

## 0. The product in one line

A multi‑tenant SaaS where any business can **build, publish, run, and grow** an online store
from one platform — without developers. (Pakistan/emerging‑market first: COD, WhatsApp, local
couriers, local payments.)

### The 4 surfaces
| # | Surface | Who uses it | Purpose | Status |
|---|---------|-------------|---------|--------|
| A | **Marketing site** (`/`) | Visitors | Acquisition — explain + convert | ✅ (motion polish ongoing) |
| B | **Builder + Merchant app** (`/create`, `/dashboard/*`) | Merchant owner/staff | Build & operate the store | ✅ core |
| C | **Storefront** (`/store/<slug>`, custom domain) | Shoppers (the merchant's customers) | Browse & buy | 🟡 browse yes, buy no |
| D | **Super Admin** (`/admin`) | Platform owner (you) | Run the whole platform | ✅ read, 🟡 actions |

---

## 1. Actors / personas

1. **Visitor** — lands on marketing site, not signed up.
2. **Merchant owner** — signs up, owns a store (tenant). Full store control.
3. **Staff** — invited by owner, scoped permissions (RBAC). *Invite flow ❌; RBAC roles ✅.*
4. **Shopper / customer** — the merchant's buyer on the storefront. *No shopper account yet ❌.*
5. **Super admin** — you; sees/controls all tenants. ✅
6. **Agency / reseller / franchise** — future; manages many stores / white‑label. ❌

---

## 2. THE END‑TO‑END JOURNEYS (start → finish)

### 2.1 Merchant journey — acquisition to a growing store
| Step | What happens | How it works | Status |
|------|--------------|--------------|--------|
| 1 | Land on marketing site | `/` — value prop, social proof, CTA | ✅ |
| 2 | Click **Create** (no login) | → `/create` public builder | ✅ |
| 3 | **Build**: pick theme, colors, font, logo, tagline, sections | client builder + live preview; draft in sessionStorage | ✅ |
| 4 | Click **Publish** | → `/signup` carrying the draft | ✅ |
| 5 | **Create account** | name/email/password → store provisioned (tenant + owner + theme) in one transaction; auto‑login | ✅ |
| 6 | Land in **dashboard** | `/dashboard` overview (live counts) | ✅ |
| 7 | **Add products** (+ images) | `/dashboard/products` CRUD + upload | ✅ |
| 8 | **Arrange storefront** | `/dashboard/builder` drag‑drop sections; `/dashboard/theme` branding | ✅ |
| 9 | **Connect domain** | `/dashboard/domains` — buy on Namecheap / connect own → DNS → verify → primary | ✅ (Vercel project add = 1 manual step) |
| 10 | **Store is live** | `/store/<slug>` and the custom domain serve the store | ✅ |
| 11 | **Receive orders** | currently **"Order on WhatsApp"** only — no on‑site cart/checkout | 🟡 → ❌ real checkout |
| 12 | **Fulfill orders** | `/dashboard/orders` status transitions + packing slip | ✅ (manual) |
| 13 | **Book courier / print label** | courier integration | ❌ |
| 14 | **Manage inventory/customers** | stock adjust, low‑stock, customer CRUD + tags | ✅ |
| 15 | **Market & grow** | coupons ✅; bundles/flash/BOGO ❌; email/SMS/WhatsApp campaigns ❌; AI ❌ |
| 16 | **See analytics** | overview counts ✅; revenue/conversion/repeat charts ❌ |
| 17 | **Billing / upgrade plan** | subscription exists on store; no paywall/usage enforcement | 🟡 |

**The single biggest gap to be a real store:** steps **11–13** (cart → checkout → payment → courier).
Until then a "store" can show products but **cannot take an order on‑site**.

### 2.2 Shopper journey — the store's customer (mostly ❌ today)
Browse storefront ✅ → product detail page ❌ (no per‑product page yet) → **add to cart** ❌ →
**cart** ❌ → **checkout** (address, shipping, payment) ❌ → **pay** (COD/EasyPaisa/JazzCash/Raast/Stripe) ❌ →
**order confirmation + email/WhatsApp** ❌ → **track shipment** ❌ → **review** ❌ → **reorder** ❌.
*Today the only conversion path is a WhatsApp message — fine for v1, but not a real ecommerce loop.*

### 2.3 Super‑admin journey
Login (super‑admin only, gated) ✅ → platform KPIs (stores, GMV, orders, customers, plans — real DB) ✅ →
store list per tenant ✅ → **manage** (suspend/refund/impersonate) ❌ → subscriptions/revenue depth ❌ →
support inbox ❌ → feature flags (real toggles) ❌ → domains overview ❌ → audit log viewer ❌.

### 2.4 Lifecycle state machines (how things "start and end")
- **Store:** `TRIAL → LIVE → SUSPENDED / REVIEW`. (enum ✅; transitions not enforced 🟡)
- **Order:** `DRAFT → PENDING → PAID → PACKING → SHIPPED → DELIVERED` (+ `CANCELLED`, `REFUNDED`). ✅ enforced
- **Subscription:** `trialing → active → past_due → canceled`. (field ✅; lifecycle/billing ❌)
- **Domain:** `added(unverified) → verified → primary`. ✅
- **Payment:** `pending → paid → refunded / failed`. (model ✅; real provider flow ❌)

---

## 3. MODULES — purpose · sub‑features · how it works · status

### A. Accounts, Auth & RBAC ✅
- Email/password (NextAuth v5, bcrypt). Session carries `userId`, active `storeId`, `role`.
- Roles: SUPER_ADMIN, STORE_OWNER, STORE_STAFF, SUPPORT. Permission checks on API + server actions.
- **Missing:** staff invite flow ❌, password reset ❌, email verification ❌, 2FA ❌ (field exists), social login ❌.

### B. Store Builder ✅ (strong)
- Public no‑login builder; theme presets (8), font (6), brand/accent colors, logo upload, tagline.
- **Section drag‑and‑drop builder** (10 section types): announcement, hero, products, rich text,
  banner, image banner, video, countdown, features, reviews, FAQ, newsletter, WhatsApp CTA.
- Live preview; layout saved per store (JSON).
- **Missing:** per‑section advanced settings ❌, undo/redo ❌, template marketplace ❌, mobile preview toggle ❌, save‑as‑draft/publish versioning ❌.

### C. Catalog 🟡
- ✅ Products (title/slug/desc/status/SEO fields), one variant + price, images (upload), categories.
- **Missing:** multiple variants/options (size/color matrix) ❌, attributes ❌, collections (separate from categories) 🟡, bulk CSV import/export ❌, digital products ❌, product‑level SEO/schema 🟡.

### D. Storefront Engine 🟡
- ✅ Renders store by slug **and** custom domain; section layout; theme/font/colors; SEO `<title>/<meta>/OG`.
- **Missing pages:** product detail page ❌, category/collection listing pages ❌, cart ❌, checkout ❌,
  customer account ❌, wishlist ❌, blog ❌, search ❌, contact form (real submit) ❌.
- **Missing:** structured data (Product/Offer/Review/Breadcrumb JSON‑LD) ❌, sitemap.xml ❌, robots.txt 🟡.

### E. Cart & Checkout ❌ (highest priority gap)
- Needs: cart (guest + persisted), line items, quantities, coupon apply, shipping method + fee,
  tax rules, order summary, address capture, checkout → creates Order + Payment + (optional) Shipment.
- New models needed: **Cart, CartItem** (+ maybe ShippingZone, TaxRate).

### F. Payments ❌
- Needs provider abstraction + each gateway: **COD** (easy), **EasyPaisa, JazzCash, Raast** (PK), **Stripe** (intl).
- Webhooks (verify signature), payment status reconciliation, refunds/partial refunds.
- Models exist (`Payment`); integration + webhook routes ❌. Secrets: `.env` placeholders exist.

### G. Orders & Fulfillment ✅ (manual) / 🟡
- ✅ List, detail, status transitions (legal‑transition map), packing slip.
- **Missing:** returns/RMA ❌, refunds UI ❌, partial fulfillment ❌, order notes/timeline ❌, invoices (PDF) ❌, customer notifications on status change ❌.

### H. Inventory & Warehouses ✅ / 🟡
- ✅ Stock per variant×warehouse, adjust (+/−, clamp ≥0), low‑stock highlight.
- **Missing:** inventory logs/history ❌, auto‑decrement on order ❌ (depends on checkout), multi‑warehouse allocation ❌, stock transfers ❌.

### I. Customers (CRM) ✅ / 🟡
- ✅ CRUD, tags, order history (read).
- **Missing:** segments (saved filters) ❌, customer detail timeline ❌, store‑credit/loyalty ❌, shopper‑facing accounts ❌.

### J. Marketing 🟡
- ✅ Coupons (percent/fixed, validity).
- **Missing:** bundles ❌, flash sales ❌, BOGO ❌, free‑shipping rules ❌, abandoned‑cart ❌, campaigns (email/SMS/WhatsApp) ❌, landing‑page generator ❌.

### K. Couriers / Shipping ❌
- Needs abstraction layer + adapters: **Leopards, TCS, Call Courier, Trax**. Create booking, get tracking #, label, status webhooks, rate calc, COD reconciliation.

### L. SEO Engine 🟡
- ✅ Dynamic title/description/OG per store.
- **Missing:** XML sitemap, robots, canonical tags, JSON‑LD schema (Product/Offer/Review/FAQ/Org/LocalBusiness/Breadcrumb), internal‑linking, SEO audit, broken‑link detection, per‑page meta editor.

### M. AI System ❌
- Phase 1: product descriptions, meta title/desc, alt text, FAQs. Phase 2: blog, collection copy, email, WhatsApp replies. Phase 3: recommendations, segmentation, inventory forecast, fraud. Phase 4: "Launch campaign" autonomous bundle.
- Needs: AI provider (Claude), **AI credits metering** (`AiUsage` model ❌), per‑store quotas.
- Note: a mock `/api/ai/campaigns` exists; not wired to a real model.

### N. Automation Engine ❌
- Trigger→action workflows: Order received (notify/inventory/invoice), cart abandonment (reminders),
  post‑purchase (review request, cross‑sell, reorder), retention (win‑back, seasonal).
- Needs: a job queue / scheduler + event bus + workflow definitions.

### O. Notifications ❌
- Channels: **Email** (transactional + marketing), **SMS**, **WhatsApp** (Business API). Templates, per‑store sender identity, delivery logs. (RESEND/WhatsApp tokens are `.env` placeholders.)

### P. Analytics 🟡
- ✅ Dashboard live counts; super‑admin GMV/counts.
- **Missing:** revenue/orders over time, conversion rate, AOV, repeat‑purchase, traffic (PostHog), top products, funnels, cohort.

### Q. Domains & DNS ✅
- ✅ Buy (Namecheap link), connect own domain, DNS instructions, real DNS verify, primary, host‑based routing.
- **Missing:** auto‑add to Vercel via API (1 manual step today) ❌, SSL status display ❌, subdomain option ❌, business‑email reselling ❌.

### R. Subscriptions & Billing 🟡
- ✅ Each store has a subscription record + plan.
- **Missing:** plan catalog + pricing page, paywall/feature gating by plan, usage metering (AI credits, storage, bandwidth), Stripe billing, invoices, dunning, store setup fees, add‑ons.

### S. Super Admin (depth) ✅ read / 🟡 actions
- ✅ Real KPIs, store list, plan breakdown, role‑gated.
- **Missing:** suspend/activate store, impersonate/login‑as, refunds, support tickets, theme/app marketplace mgmt, white‑label, agency/franchise, feature‑flag toggles (real), AI‑cost & storage/bandwidth monitoring, audit‑log viewer, churn/MRR/ARR analytics.

### T. Media / Storage 🟡
- ✅ Image upload (validated) to **local `public/uploads`**.
- **Missing:** Cloudflare **R2/S3** in production (local FS won't persist on Vercel), image optimization/CDN, file size/type quotas per plan. (Abstraction `saveUpload` is swap‑ready.)

### U. Security 🟡
- ✅ Tenant isolation (`storeId` everywhere), RBAC (app + server actions), unique‑constraint handling, DNS‑verified domains, super‑admin gate.
- **Missing:** rate limiting ❌, audit‑log writes ❌ (model exists), 2FA ❌, webhook signature verification ❌ (needed for payments/couriers), secret encryption ❌, automated backups ❌, WAF ❌, CSRF beyond NextAuth, bot/abuse protection on public upload/newsletter.

### V. Infra / Observability 🟡
- ✅ Next.js 16 + Prisma 7 + Postgres; local embedded‑pg for dev; Vercel deploy.
- **Missing:** Redis (cache/queues/rate‑limit) ❌, Sentry ❌, PostHog ❌, OpenTelemetry ❌, CI/CD pipeline + tests ❌, staging env ❌.

---

## 4. Data model — current vs needed

**Built ✅:** Store, Domain, User, Role, Permission, StoreMember, Customer, Category, Product,
ProductVariant, ProductImage, Warehouse, InventoryItem, Order, OrderItem, Payment, Shipment,
Coupon, Review, Subscription, AuditLog, NewsletterSubscriber.

**Needed next ❌:** Cart, CartItem, ShippingZone/Rate, TaxRate, ProductOption/OptionValue (variant
matrix), Collection, Address, AiUsage, NotificationLog, AutomationWorkflow/Run, WebhookEvent,
Invoice, Plan, UsageRecord, SupportTicket, Page/BlogPost, WishlistItem, Review (wire to storefront),
FeatureFlag (real), Agency/WhiteLabel.

---

## 5. Gap analysis → recommended build order (phased)

> Ordered by "what makes it a *real* business tool fastest."

- **Phase 1 — Close the buying loop (make it sellable).** Cart + CartItem, product detail page,
  on‑site checkout, **COD** order placement, auto stock‑decrement, order confirmation
  (email/WhatsApp). *Without this it's a catalog, not a store.*
- **Phase 2 — Online payments.** Provider abstraction + EasyPaisa/JazzCash/Raast + Stripe; webhooks
  (verified) + reconciliation + refunds.
- **Phase 3 — Shipping & couriers.** Courier abstraction + Leopards/TCS/CallCourier/Trax; label +
  tracking + COD reconciliation; shipping rates at checkout.
- **Phase 4 — Notifications + transactional comms.** Email (Resend) + WhatsApp + SMS; order/shipping
  templates. (Unlocks Phase 5.)
- **Phase 5 — SEO + analytics (growth visibility).** Sitemap/robots/canonical/JSON‑LD; real
  analytics (PostHog + revenue/conversion dashboards).
- **Phase 6 — Marketing + automation.** Bundles/flash/BOGO/free‑ship; abandoned‑cart + post‑purchase
  + win‑back workflows (needs a scheduler + Redis queue).
- **Phase 7 — AI layer.** Product/meta/alt/FAQ generation + credits metering; then recommendations.
- **Phase 8 — Billing & plan gating.** Plan catalog, paywall, usage metering, Stripe billing, invoices.
- **Phase 9 — Super‑admin depth + security hardening.** Suspend/impersonate/support/flags/audit;
  rate‑limit, 2FA, backups, R2 storage, Sentry, CI/CD.
- **Phase 10 — Scale features.** Agencies, white‑label, franchise, marketplace apps/themes, multi‑branch.

---

## 6. Non‑functional requirements

- **Performance:** storefront LCP < 2.5s, SSR content always; lazy 3D/heavy media; image CDN; cache hot reads (Redis).
- **Scale targets:** 1,000+ stores, 1M+ monthly visitors, 500+ peak RPS (per original brief).
- **Multi‑tenancy:** every tenant row carries `storeId`; enforce at app + query layer (done) and add DB‑level RLS later.
- **i18n / RTL:** Urdu + RTL support for storefront & checkout (emerging‑market) — ❌ not started.
- **Accessibility:** WCAG AA on storefront + checkout; `prefers-reduced-motion` honored (done in motion layer).
- **Compliance:** privacy policy, data export/delete, PCI‑safe payments (use hosted gateways), secret management.

---

## 7. One‑paragraph summary

The platform's **build → publish → operate** spine is real and working: a no‑login builder, instant
tenant provisioning, themed/section‑built storefronts on custom domains, and merchant ops (products,
orders, inventory, customers, coupons). The **selling loop is the missing half**: there is no on‑site
cart, checkout, payment, or courier — today a shopper can only message on WhatsApp. The fastest path
to a "complete" website is **Phase 1–3** (cart → checkout → COD/payments → couriers), after which
SEO, analytics, marketing/automation, AI, and billing turn it from a store builder into a true
commerce operating system.
