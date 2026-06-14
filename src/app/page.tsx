import {
  BarChart3,
  Bot,
  Boxes,
  Building2,
  Check,
  Cloud,
  CreditCard,
  Database,
  Globe2,
  Layers3,
  LockKeyhole,
  Megaphone,
  PackageCheck,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Users,
  Workflow,
} from "lucide-react";
import { MarketingHeader } from "@/components/app-shell";
import { ImmersiveShowcase } from "@/components/immersive-showcase";

const stats = [
  { label: "Target stores", value: "1,000+" },
  { label: "Monthly visitors", value: "1M+" },
  { label: "Peak requests", value: "500/s" },
  { label: "Tenant tables", value: "store_id" },
];

const modules = [
  {
    icon: Store,
    title: "Store operating system",
    text: "Products, variants, inventory, orders, customers, coupons, invoices, returns, warehouses, and analytics in one tenant-safe console.",
  },
  {
    icon: Building2,
    title: "Super admin command center",
    text: "Manage stores, subscriptions, domains, revenue, feature flags, agencies, support, white labels, audit trails, and platform KPIs.",
  },
  {
    icon: Layers3,
    title: "Theme and storefront engine",
    text: "Mobile-first storefronts with sections, layout controls, typography, color settings, reviews, trust badges, wishlist, blog, cart, and checkout.",
  },
  {
    icon: Bot,
    title: "AI growth system",
    text: "Generate descriptions, SEO metadata, alt text, FAQs, blogs, WhatsApp replies, campaigns, recommendations, and forecasting workflows.",
  },
  {
    icon: CreditCard,
    title: "Pakistan payments",
    text: "COD, EasyPaisa, JazzCash, Raast, Stripe, refunds, partial refunds, webhooks, reconciliation, and transaction add-on billing.",
  },
  {
    icon: Workflow,
    title: "Automation engine",
    text: "Order notifications, inventory reduction, invoices, abandoned cart reminders, review requests, win-back flows, and seasonal campaigns.",
  },
];

const architecture = [
  ["Frontend", "Next.js App Router, TypeScript, TailwindCSS, component system"],
  ["Backend", "Server Actions, route handlers, Node.js services, webhook endpoints"],
  ["Data", "PostgreSQL, Prisma, tenant isolation, indexes, audit logs"],
  ["Scale", "Redis cache, Cloudflare CDN, R2 storage, Vercel deployment"],
  ["Growth", "PostHog analytics, SEO engine, AI credits, campaign automation"],
  ["Trust", "RBAC, 2FA, rate limits, WAF, backups, encrypted secrets"],
];

const roadmap = [
  "Tenant core, auth, billing, RBAC",
  "Merchant dashboard and catalog management",
  "Storefront, checkout, payments, couriers",
  "Themes, SEO, marketing, automation",
  "AI growth assistant and marketplace",
];

const payments = ["COD", "EasyPaisa", "JazzCash", "Raast", "Stripe"];
const couriers = ["Leopards", "TCS", "Call Courier", "Trax"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#171717]">
      <MarketingHeader />

      <section className="relative overflow-hidden border-b border-black/10 bg-[#f7f4ee]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-[#c6d1c7] bg-white px-3 py-2 text-sm font-semibold text-[#143c3a]">
              <Sparkles size={16} />
              SEO-first online store builder
            </div>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-normal text-[#111] md:text-6xl">
              StoreBuilder Cloud
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f5b58]">
              Create a professional ecommerce website, manage products and
              orders, accept payments, automate marketing, and grow with AI from
              one cloud platform built for every business category.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#143c3a] px-5 text-sm font-bold text-white transition hover:bg-[#0f2c2a]"
              >
                Create your store <Store size={17} />
              </a>
              <a
                href="/immersive-builder"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-5 text-sm font-bold text-[#143c3a] transition hover:border-[#143c3a]"
              >
                3D builder plan <BarChart3 size={17} />
              </a>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-black/10 bg-white p-4"
                >
                  <p className="font-mono text-xl font-bold text-[#143c3a]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#6b6f69]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ImmersiveShowcase />
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#102321] px-5 py-14 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f3b74f]">
              Immersive advantage
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-normal">
              A 3D store builder that still ranks in search.
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/72">
              Rich 3D template cards, product scenes, and marketplace previews
              sit above indexable HTML content, structured data, accessible
              labels, and lightweight fallbacks.
            </p>
            <a
              href="/immersive-builder"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-white px-5 text-sm font-bold text-[#143c3a]"
            >
              View immersive builder blueprint
            </a>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_20%_20%,#50b79a,transparent_24%),linear-gradient(135deg,#143c3a,#0a1716)] p-6">
            <div className="absolute left-[8%] top-[12%] h-28 w-44 rotate-[-10deg] rounded-lg border border-white/20 bg-white/14 shadow-2xl" />
            <div className="absolute right-[14%] top-[14%] h-36 w-32 rotate-[8deg] rounded-lg border border-white/20 bg-[#f3b74f]/80 shadow-2xl" />
            <div className="absolute bottom-[18%] left-[22%] h-32 w-56 rotate-[5deg] rounded-lg border border-white/20 bg-white/18 shadow-2xl" />
            <div className="absolute bottom-[10%] right-[12%] grid size-24 place-items-center rounded-full border border-white/20 bg-[#9fcfc0]/75 font-bold text-[#102321] shadow-2xl">
              SEO
            </div>
            <div className="absolute inset-x-6 bottom-6 rounded-lg border border-white/10 bg-black/25 p-4 backdrop-blur">
              <p className="font-mono text-xs text-white/60">
                SSR text + lazy WebGL + accessible fallback
              </p>
              <p className="mt-2 text-sm text-white/82">
                Designed to look premium without hiding content from search
                engines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
            Complete platform
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-normal">
            Built as commerce infrastructure, not a website builder.
          </h2>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-black/10 bg-white p-6 shadow-sm"
            >
              <item.icon className="text-[#143c3a]" size={26} />
              <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#5b625f]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="dashboards"
        className="border-y border-black/10 bg-[#e7ece2] px-5 py-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
                Merchant workspace
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-normal">
                Every business gets its own admin panel and branded storefront.
              </h2>
              <p className="mt-4 leading-8 text-[#4f5b58]">
                The merchant experience focuses on daily operations: catalog,
                orders, inventory, customers, marketing, analytics, SEO, and
                automation.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {payments.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-[#b8c5b6] bg-white px-3 py-2 text-sm font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-black/10 bg-white p-4 shadow-xl">
              <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
                <aside className="rounded-lg bg-[#143c3a] p-4 text-white">
                  <p className="text-sm font-semibold text-white/60">
                    Al Noor Electronics
                  </p>
                  <div className="mt-6 space-y-2 text-sm">
                    {[
                      ["Products", Boxes],
                      ["Orders", ShoppingBag],
                      ["Inventory", PackageCheck],
                      ["Customers", Users],
                      ["Marketing", Megaphone],
                      ["SEO", Search],
                    ].map(([label, Icon]) => (
                      <div
                        key={label as string}
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2"
                      >
                        <Icon size={16} />
                        <span>{label as string}</span>
                      </div>
                    ))}
                  </div>
                </aside>
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      ["Orders", "342"],
                      ["Revenue", "Rs 1.9M"],
                      ["Conversion", "4.8%"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-black/10 p-4"
                      >
                        <p className="text-sm text-[#6b6f69]">{label}</p>
                        <p className="mt-2 font-mono text-2xl font-bold">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-black/10 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold">Recent orders</h3>
                      <span className="text-sm font-semibold text-[#143c3a]">
                        synced
                      </span>
                    </div>
                    <div className="space-y-3">
                      {[
                        ["#PK-1924", "COD", "Ready for TCS", "Rs 14,500"],
                        ["#PK-1925", "JazzCash", "Paid", "Rs 8,900"],
                        ["#PK-1926", "Raast", "Packing slip", "Rs 22,100"],
                      ].map((row) => (
                        <div
                          key={row[0]}
                          className="grid grid-cols-4 gap-2 rounded-lg bg-[#f7f4ee] p-3 text-sm"
                        >
                          {row.map((cell) => (
                            <span key={cell}>{cell}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
              Architecture
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-normal">
              Tenant isolation across app, ORM, and database layers.
            </h2>
            <p className="mt-4 leading-8 text-[#4f5b58]">
              Every tenant-owned table carries store_id, backed by application
              guards, Prisma query scoping, database indexes, audit logs, and
              operational monitoring.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {architecture.map(([title, text]) => (
              <div
                key={title}
                className="rounded-lg border border-black/10 bg-white p-5"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#e7ece2] text-[#143c3a]">
                  {title === "Frontend" && <Globe2 size={20} />}
                  {title === "Backend" && <Route size={20} />}
                  {title === "Data" && <Database size={20} />}
                  {title === "Scale" && <Cloud size={20} />}
                  {title === "Growth" && <Sparkles size={20} />}
                  {title === "Trust" && <ShieldCheck size={20} />}
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-[#5b625f]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#143c3a] px-5 py-16 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-white/15 p-6">
            <Truck className="text-[#f3b74f]" />
            <h3 className="mt-5 text-2xl font-bold">Courier abstraction</h3>
            <p className="mt-3 leading-7 text-white/70">
              Ship through local courier adapters today and add future delivery
              partners without rewriting order workflows.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {couriers.map((item) => (
                <span key={item} className="rounded-lg bg-white/10 px-3 py-2 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/15 p-6">
            <LockKeyhole className="text-[#f3b74f]" />
            <h3 className="mt-5 text-2xl font-bold">Enterprise security</h3>
            <p className="mt-3 leading-7 text-white/70">
              RBAC, 2FA, rate limiting, webhook signatures, encrypted secrets,
              WAF rules, automated backups, and activity audit trails.
            </p>
          </div>
          <div className="rounded-lg border border-white/15 p-6">
            <Megaphone className="text-[#f3b74f]" />
            <h3 className="mt-5 text-2xl font-bold">Growth monetization</h3>
            <p className="mt-3 leading-7 text-white/70">
              Subscriptions, setup fees, transaction add-ons, themes, AI
              credits, WhatsApp automation, SEO services, agencies, and white
              label licensing.
            </p>
          </div>
        </div>
      </section>

      <section id="roadmap" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
              Delivery roadmap
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-normal">
              Start with the revenue core, then expand into marketplace and AI.
            </h2>
          </div>
          <div className="space-y-3">
            {roadmap.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-lg border border-black/10 bg-white p-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#143c3a] font-mono font-bold text-white">
                  {index + 1}
                </span>
                <span className="font-semibold">{item}</span>
                <Check className="ml-auto text-[#50a678]" size={20} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
