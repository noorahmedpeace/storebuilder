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
import type { CSSProperties } from "react";
import { AutoplayVideo } from "@/components/autoplay-video";
import { MarketingHeader } from "@/components/app-shell";
import { ImmersiveShowcase } from "@/components/immersive-showcase";
import { IntegrationMotionShowcase } from "@/components/integration-motion-showcase";
import { MotionHydrator } from "@/components/motion-hydrator";
import { AnimatedHeadline } from "@/components/motion/animated-headline";
import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { TiltCard } from "@/components/motion/tilt-card";

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
const motionRail = [
  "Storefronts",
  "Payments",
  "Themes",
  "AI content",
  "SEO",
  "Courier flows",
  "Analytics",
  "Marketplace apps",
  "Automation",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#171717]">
      <MotionHydrator />
      <MarketingHeader />

      <section className="relative overflow-hidden border-b border-white/10 bg-[#06110f] text-white">
        <AutoplayVideo
          className="ambient-video absolute inset-0 h-full w-full object-cover opacity-55"
          src="/media/ambient-hero-background.mp4"
          hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(80,183,154,0.24),transparent_32%),radial-gradient(circle_at_24%_12%,rgba(243,183,79,0.16),transparent_28%),linear-gradient(90deg,#06110f_0%,rgba(6,17,15,0.94)_34%,rgba(6,17,15,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06110f] to-transparent" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:gap-10 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="motion-reveal mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-[#88f5d5]/22 bg-[#88f5d5]/10 px-3 py-2 text-sm font-black text-[#d4fff1] shadow-[0_0_35px_rgba(80,183,154,0.16)] backdrop-blur">
              <Sparkles size={16} />
              Premium commerce launch system
            </div>
            <h1
              className="hero-command-title font-display max-w-3xl text-5xl font-black leading-[0.96] tracking-normal sm:text-6xl md:text-7xl lg:text-7xl"
              style={{ "--delay": "90ms" } as CSSProperties}
            >
              Build stores that feel expensive.
            </h1>
            <p
              className="motion-reveal mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/72"
              style={{ "--delay": "160ms" } as CSSProperties}
            >
              StoreBuilder Cloud gives every business a polished storefront,
              merchant dashboard, payments, automations, AI growth tools, and
              immersive 3D product moments from one global commerce platform.
            </p>
            <div
              className="motion-reveal mt-7 flex flex-col gap-3 sm:flex-row"
              style={{ "--delay": "240ms" } as CSSProperties}
            >
              <Magnetic>
                <a
                  href="/create"
                  className="nav-cta-prism magnetic-button inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-black text-[#06110f] transition"
                >
                  Create your store <Store size={17} />
                </a>
              </Magnetic>
              <Magnetic strength={0.22}>
                <a
                  href="/immersive-builder"
                  className="magnetic-button inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/14 bg-white/8 px-5 text-sm font-black text-white backdrop-blur transition hover:border-[#88f5d5]/55 hover:bg-white/12"
                >
                  3D builder plan <BarChart3 size={17} />
                </a>
              </Magnetic>
            </div>
          </div>

          <div
            className="motion-reveal order-2 -mx-1 md:order-none md:mx-0"
            style={{ "--delay": "180ms" } as CSSProperties}
          >
            <TiltCard max={4}>
              <ImmersiveShowcase />
            </TiltCard>
          </div>

          <div className="order-3 grid grid-cols-2 gap-3 sm:grid-cols-4 md:col-span-2">
            {stats.map((item, index) => (
              <div
                key={item.label}
                className="motion-reveal hero-stat-tile rounded-lg border border-white/10 bg-white/7 p-4 shadow-sm backdrop-blur"
                style={{ "--delay": `${120 + index * 70}ms` } as CSSProperties}
              >
                <p className="font-mono text-xl font-bold text-[#d4fff1]">
                  {item.value}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/52">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <Marquee
            items={motionRail}
            className="motion-reveal order-4 rounded-lg border border-white/10 bg-white/7 py-3 text-white/72 backdrop-blur md:col-span-2"
          />
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#102321] px-5 py-14 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f3b74f]">
              Immersive advantage
            </p>
            <h2 className="kinetic-heading mt-3 text-4xl font-bold tracking-normal">
              <AnimatedHeadline text="A 3D store builder that still ranks in search." />
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
          <div
            className="motion-reveal"
            style={{ "--delay": "140ms" } as CSSProperties}
          >
            <TiltCard max={3}>
              <IntegrationMotionShowcase />
            </TiltCard>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
            Complete platform
          </p>
          <h2 className="kinetic-heading mt-3 text-4xl font-bold tracking-normal">
            <AnimatedHeadline text="Built as commerce infrastructure, not a website builder." />
          </h2>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((item, index) => (
            <TiltCard
              key={item.title}
              className="motion-reveal premium-surface rounded-lg border border-black/10 bg-white p-6 shadow-sm"
              style={{ "--delay": `${index * 70}ms` } as CSSProperties}
            >
              <article>
              <item.icon className="text-[#143c3a]" size={26} />
              <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#5b625f]">{item.text}</p>
            </article>
            </TiltCard>
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
              <h2 className="kinetic-heading mt-3 text-4xl font-bold tracking-normal">
                <AnimatedHeadline text="Every business gets its own admin panel and branded storefront." />
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

            <div
              className="motion-reveal premium-surface rounded-lg border border-black/10 bg-white p-4 shadow-xl"
              style={{ "--delay": "120ms" } as CSSProperties}
            >
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
            <h2 className="kinetic-heading mt-3 text-4xl font-bold tracking-normal">
              <AnimatedHeadline text="Tenant isolation across app, ORM, and database layers." />
            </h2>
            <p className="mt-4 leading-8 text-[#4f5b58]">
              Every tenant-owned table carries store_id, backed by application
              guards, Prisma query scoping, database indexes, audit logs, and
              operational monitoring.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {architecture.map(([title, text], index) => (
              <div
                key={title}
                className="motion-reveal premium-surface rounded-lg border border-black/10 bg-white p-5"
                style={{ "--delay": `${index * 70}ms` } as CSSProperties}
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
          <div className="motion-reveal premium-surface rounded-lg border border-white/15 p-6">
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
          <div
            className="motion-reveal premium-surface rounded-lg border border-white/15 p-6"
            style={{ "--delay": "90ms" } as CSSProperties}
          >
            <LockKeyhole className="text-[#f3b74f]" />
            <h3 className="mt-5 text-2xl font-bold">Enterprise security</h3>
            <p className="mt-3 leading-7 text-white/70">
              RBAC, 2FA, rate limiting, webhook signatures, encrypted secrets,
              WAF rules, automated backups, and activity audit trails.
            </p>
          </div>
          <div
            className="motion-reveal premium-surface rounded-lg border border-white/15 p-6"
            style={{ "--delay": "180ms" } as CSSProperties}
          >
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
            <h2 className="kinetic-heading mt-3 text-4xl font-bold tracking-normal">
              <AnimatedHeadline text="Start with the revenue core, then expand into marketplace and AI." />
            </h2>
          </div>
          <div className="space-y-3">
            {roadmap.map((item, index) => (
              <div
                key={item}
                className="motion-reveal premium-surface flex items-center gap-4 rounded-lg border border-black/10 bg-white p-4"
                style={{ "--delay": `${index * 80}ms` } as CSSProperties}
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
