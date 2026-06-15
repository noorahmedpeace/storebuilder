import Link from "next/link";
import {
  ChevronRight,
  Menu,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Super Admin" },
  { href: "/dashboard", label: "Merchant" },
  { href: "/store/oud-reserve", label: "Storefront" },
  { href: "/growth", label: "Growth" },
  { href: "/operations", label: "Ops" },
  { href: "/commerce", label: "Commerce" },
  { href: "/themes", label: "Themes" },
  { href: "/immersive-builder", label: "3D Builder" },
  { href: "/marketplace", label: "Apps" },
  { href: "/security", label: "Security" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f7f4ee]/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white/72 px-3 py-2 shadow-[0_18px_60px_rgba(20,60,58,0.10)] backdrop-blur-xl lg:px-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid size-10 place-items-center overflow-hidden rounded-lg bg-[#143c3a] text-white shadow-lg shadow-[#143c3a]/20">
            <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.24),transparent)] opacity-0 transition group-hover:translate-x-full group-hover:opacity-100" />
            <ShoppingBag size={20} className="relative" />
          </span>
          <span className="leading-none">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-[#54706b]">
              StoreBuilder
            </span>
            <span className="font-display block text-base font-extrabold text-[#101514] sm:text-lg">
              Commerce Cloud
            </span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-lg border border-black/5 bg-[#f7f4ee]/72 p-1 text-sm font-bold text-[#4f5b58] xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 transition hover:bg-white hover:text-[#143c3a] hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden h-10 items-center gap-2 rounded-lg border border-[#c6d1c7] bg-[#f7f4ee]/75 px-3 text-xs font-bold uppercase tracking-[0.16em] text-[#143c3a] lg:inline-flex">
            <Sparkles size={14} />
            Live
          </span>
          <Link
            href="/login"
            className="hidden h-10 items-center rounded-lg border border-black/10 bg-white/80 px-4 text-sm font-bold text-[#143c3a] transition hover:border-[#143c3a] hover:bg-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/create"
            className="magnetic-button inline-flex h-10 items-center gap-2 rounded-lg bg-[#143c3a] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f2c2a]"
          >
            Create store <ChevronRight size={16} />
          </Link>
          <button
            type="button"
            aria-label="Open navigation"
            className="grid size-10 place-items-center rounded-lg border border-black/10 bg-white/80 text-[#143c3a] xl:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
        </div>
        <nav className="mt-2 flex gap-2 overflow-x-auto pb-1 text-sm font-bold text-[#4f5b58] xl:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-lg border border-black/10 bg-white/72 px-3 py-2 backdrop-blur transition hover:border-[#143c3a] hover:text-[#143c3a]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#171717]">
      <MarketingHeader />
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
            {eyebrow}
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-normal md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#4f5b58]">
            {description}
          </p>
        </div>
        {children}
      </section>
    </main>
  );
}

export function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  const trimmed = change.trim();
  const positive = trimmed.startsWith("+");
  const negative = trimmed.startsWith("-");
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-zinc-300">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
        {value}
      </p>
      <p
        className={`mt-1.5 flex items-center gap-1 text-sm font-medium ${
          positive ? "text-emerald-600" : negative ? "text-red-600" : "text-zinc-400"
        }`}
      >
        {positive ? <TrendingUp size={14} /> : negative ? <TrendingDown size={14} /> : null}
        {change}
      </p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-10 text-center">
      <p className="font-semibold text-zinc-900">{title}</p>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-zinc-500">{description}</p>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        {typeof action === "string" ? (
          <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
            {action}
          </span>
        ) : (
          action ?? null
        )}
      </div>
      {children}
    </section>
  );
}
