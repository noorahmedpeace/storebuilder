import Link from "next/link";
import {
  ChevronRight,
  CircleDot,
  Menu,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatedHeadline } from "@/components/motion/animated-headline";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Merchant" },
  { href: "/store/oud-reserve", label: "Storefront" },
  { href: "/growth", label: "Growth" },
  { href: "/immersive-builder", label: "3D Builder" },
];

const secondaryLinks = [
  { href: "/admin", label: "Super Admin" },
  { href: "/operations", label: "Operations" },
  { href: "/commerce", label: "Commerce" },
  { href: "/themes", label: "Themes" },
  { href: "/marketplace", label: "Apps" },
  { href: "/security", label: "Security" },
];

const allLinks = [...primaryLinks, ...secondaryLinks];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#06110f]/94 px-3 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl">
        <div className="nav-command-deck grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-white/12 bg-[#081916]/88 px-3 text-white shadow-[0_26px_90px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.08)] lg:grid-cols-[1fr_auto_1fr] lg:px-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="nav-logo-cube grid size-11 shrink-0 place-items-center rounded-md border border-[#c9fff0]/18 bg-[#d4fff1]/9 text-[#d4fff1] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_16px_35px_rgba(80,183,154,0.16)] transition group-hover:border-[#d4fff1]/45 group-hover:bg-[#d4fff1] group-hover:text-[#06110f]">
              <ShoppingBag size={19} />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#88f5d5]">
                StoreBuilder
              </span>
              <span className="font-display mt-1 block truncate text-base font-extrabold text-white sm:text-lg">
                Commerce Cloud
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-lg border border-white/10 bg-black/28 p-1 text-sm font-bold text-white/66 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-glow rounded-[7px] px-3 py-2 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <details className="group relative">
              <summary className="nav-link-glow cursor-pointer list-none rounded-[7px] px-3 py-2 transition hover:text-white">
                More
              </summary>
              <div className="absolute right-0 top-11 w-56 rounded-lg border border-white/12 bg-[#071512]/96 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-white/76 transition hover:bg-[#d4fff1] hover:text-[#071512]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          <div className="ml-auto flex items-center justify-end gap-2">
            <span className="hidden h-10 items-center gap-2 rounded-md border border-[#f3b74f]/20 bg-[#f3b74f]/8 px-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#ffd98d] xl:inline-flex">
              <CircleDot size={12} className="animate-pulse" />
              Live
            </span>
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-md border border-white/12 bg-white/5 px-4 text-sm font-bold text-white/78 transition hover:border-white/30 hover:bg-white hover:text-[#06110f] sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/create"
              className="magnetic-button inline-flex h-10 items-center gap-2 rounded-md bg-[#d4fff1] px-4 text-sm font-extrabold text-[#06110f] shadow-[0_0_0_1px_rgba(212,255,241,0.2),0_18px_38px_rgba(80,183,154,0.2)] transition hover:bg-white"
            >
              <Sparkles size={15} />
              Create store <ChevronRight size={16} />
            </Link>
            <details className="relative lg:hidden">
              <summary
                aria-label="Open navigation"
                className="grid size-10 cursor-pointer list-none place-items-center rounded-md border border-white/14 bg-white/10 text-white"
              >
                <Menu size={18} />
              </summary>
              <nav className="absolute right-0 top-12 z-40 grid w-64 gap-1 rounded-lg border border-white/12 bg-[#071512]/98 p-2 shadow-2xl backdrop-blur-xl">
                {allLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm font-bold text-white/78 transition hover:bg-[#d4fff1] hover:text-[#071512]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
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
          <h1 className="kinetic-heading font-display mt-3 text-4xl font-bold tracking-normal md:text-5xl">
            <AnimatedHeadline text={title} />
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
