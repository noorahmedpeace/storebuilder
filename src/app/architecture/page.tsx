import {
  Bot,
  Cloud,
  Database,
  KeyRound,
  LockKeyhole,
  Network,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { PageShell, Panel } from "@/components/app-shell";
import { techStack } from "@/lib/platform-data";

const systems = [
  {
    title: "Tenant resolution",
    icon: Network,
    text: "Resolve store by custom domain, subdomain, or admin session, then scope every tenant-owned query by storeId.",
  },
  {
    title: "Database layer",
    icon: Database,
    text: "PostgreSQL plus Prisma models for stores, domains, users, roles, catalog, inventory, orders, payments, subscriptions, and audit logs.",
  },
  {
    title: "Security",
    icon: ShieldCheck,
    text: "RBAC, 2FA-ready auth, webhook verification, encrypted secrets, WAF rules, rate limits, audit trails, and automated backups.",
  },
  {
    title: "Automation",
    icon: Workflow,
    text: "Event-driven workflows for order received, cart abandonment, post-purchase review requests, win-back campaigns, and seasonal promotions.",
  },
  {
    title: "AI platform",
    icon: Bot,
    text: "Usage-metered AI credits for product content, SEO metadata, alt text, FAQs, blog posts, WhatsApp replies, forecasting, and campaign generation.",
  },
  {
    title: "Infrastructure",
    icon: Cloud,
    text: "Vercel hosting, Redis cache, Cloudflare CDN and R2 storage, PostHog analytics, Sentry monitoring, and OpenTelemetry traces.",
  },
];

const apiGroups = [
  ["Stores", "GET /api/admin/stores, POST /api/admin/stores, PATCH /api/admin/stores/:id"],
  ["Catalog", "GET /api/products, POST /api/products, PATCH /api/products/:id"],
  ["Orders", "GET /api/orders, PATCH /api/orders/:id/status, POST /api/orders/:id/refund"],
  ["Payments", "POST /api/webhooks/jazzcash, /easypaisa, /stripe, /raast"],
  ["Couriers", "POST /api/shipments/rate, POST /api/shipments/book"],
  ["AI", "POST /api/ai/product-copy, /seo-audit, /campaigns"],
];

export default function ArchitecturePage() {
  return (
    <PageShell
      eyebrow="Engineering Blueprint"
      title="Production architecture for a true multi-tenant commerce SaaS."
      description="The implementation plan separates platform ownership from merchant tenancy, keeps data isolated through storeId, and prepares the app for payments, courier integrations, automation, AI, and scale."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {systems.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-black/10 bg-white p-6 shadow-sm"
          >
            <item.icon className="text-[#143c3a]" size={26} />
            <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
            <p className="mt-3 leading-7 text-[#5d6561]">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Panel title="Tenant isolation strategy" action="storeId required">
          <div className="space-y-3 text-sm leading-7 text-[#4f5b58]">
            <p>
              Application layer resolves the active store from domain, route,
              or authenticated merchant session before any tenant data loads.
            </p>
            <p>
              ORM layer exposes scoped repository functions so tenant-owned
              models always include storeId in reads, writes, updates, and
              deletes.
            </p>
            <p>
              Database layer enforces indexed storeId columns, unique composite
              constraints, audit logs, and optional row-level security policies.
            </p>
          </div>
        </Panel>

        <Panel title="API design" action="Route handlers">
          <div className="space-y-3">
            {apiGroups.map(([title, endpoints]) => (
              <div
                key={title}
                className="grid gap-2 rounded-lg border border-black/10 bg-[#f7f4ee] p-4 md:grid-cols-[130px_1fr]"
              >
                <span className="font-bold">{title}</span>
                <code className="text-sm text-[#4f5b58]">{endpoints}</code>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Auth and permissions" action="RBAC">
          <div className="grid gap-3 sm:grid-cols-2">
            {["Super Admin", "Support Agent", "Store Owner", "Store Staff"].map(
              (role) => (
                <div
                  key={role}
                  className="flex items-center gap-3 rounded-lg border border-black/10 bg-[#f7f4ee] p-4"
                >
                  <KeyRound className="text-[#143c3a]" size={18} />
                  <span className="font-bold">{role}</span>
                </div>
              ),
            )}
          </div>
        </Panel>

        <Panel title="Stack" action="PDF aligned">
          <div className="flex flex-wrap gap-2">
            {techStack.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-black/10 bg-[#f7f4ee] px-3 py-2 text-sm font-bold text-[#143c3a]"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-lg bg-[#143c3a] p-4 text-white">
            <LockKeyhole className="mt-1 shrink-0 text-[#f3b74f]" size={18} />
            <p className="text-sm leading-7 text-white/75">
              Never rely on navigation guards alone. Every server action, route
              handler, and database operation must re-check user role, store
              access, and feature entitlements.
            </p>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
