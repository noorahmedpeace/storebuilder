import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Super Admin" },
  { href: "/dashboard", label: "Merchant" },
  { href: "/store/oud-reserve", label: "Storefront" },
  { href: "/growth", label: "Growth" },
  { href: "/operations", label: "Ops" },
  { href: "/commerce", label: "Commerce" },
  { href: "/themes", label: "Themes" },
  { href: "/marketplace", label: "Apps" },
  { href: "/security", label: "Security" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f4ee]/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-[#143c3a] text-white">
            <ShoppingBag size={20} />
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#54706b]">
              BazaarOS
            </span>
            <span className="block text-lg font-bold">Commerce Cloud</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium text-[#4f5b58] xl:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/admin"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#143c3a] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2c2a]"
        >
          Open app <ChevronRight size={16} />
        </Link>
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
          <h1 className="mt-3 text-4xl font-bold tracking-normal md:text-5xl">
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
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[#68716d]">{label}</p>
      <p className="mt-2 font-mono text-3xl font-bold text-[#143c3a]">
        {value}
      </p>
      <p className="mt-2 text-sm font-semibold text-[#4d8b70]">{change}</p>
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
    <div className="rounded-lg border border-dashed border-black/15 bg-[#f7f4ee] p-8 text-center">
      <p className="font-bold text-[#143c3a]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#68716d]">{description}</p>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {action ? (
          <span className="rounded-lg bg-[#e7ece2] px-3 py-2 text-sm font-bold text-[#143c3a]">
            {action}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}
