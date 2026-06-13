import Link from "next/link";
import { MarketingHeader } from "@/components/app-shell";
import { signOut } from "@/auth";
import { getSessionContext } from "@/lib/session";

const moduleLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/inventory", label: "Inventory" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/catalog", label: "Catalog" },
  { href: "/dashboard/marketing", label: "Marketing" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionContext();

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#171717]">
      <MarketingHeader />
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
              Merchant Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {session.name ? `${session.name}'s workspace` : "Store workspace"}
            </h1>
          </div>
          {session.userId ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="h-10 rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold transition hover:border-[#143c3a]"
              >
                Sign out
              </button>
            </form>
          ) : null}
        </div>

        <nav className="mt-6 flex flex-wrap gap-2 border-b border-black/10 pb-3 text-sm font-semibold text-[#4f5b58]">
          {moduleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 transition hover:bg-[#e7ece2] hover:text-[#143c3a]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
