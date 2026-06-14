import Link from "next/link";
import { ExternalLink, LogOut, Store } from "lucide-react";
import { signOut } from "@/auth";
import { getStoreSettings } from "@/lib/repositories/stores";
import { getSessionContext } from "@/lib/session";
import {
  CurrentSection,
  DashboardMobileNav,
  DashboardNav,
} from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionContext();
  const settings = session.storeId
    ? await getStoreSettings(session.storeId)
    : null;
  const initials = (session.name ?? "Store")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
          <div className="flex h-16 items-center gap-2.5 border-b border-zinc-200 px-5">
            <span className="grid size-8 place-items-center rounded-lg bg-[#143c3a] text-white">
              <Store size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                BazaarOS
              </p>
              <p className="truncate text-sm font-semibold leading-none">
                {settings?.name ?? session.name ?? "Workspace"}
              </p>
            </div>
          </div>

          <DashboardNav />

          <div className="mt-auto border-t border-zinc-200 p-3">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <LogOut size={17} className="text-zinc-400" />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-5 backdrop-blur lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="grid size-8 place-items-center rounded-lg bg-[#143c3a] text-white">
                <Store size={16} />
              </span>
              <span className="text-sm font-bold">BazaarOS</span>
            </div>
            <div className="hidden lg:block">
              <CurrentSection />
            </div>
            <div className="flex items-center gap-3">
              {settings?.slug ? (
                <Link
                  href={`/store/${settings.slug}`}
                  target="_blank"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  View store <ExternalLink size={14} />
                </Link>
              ) : null}
              <span className="grid size-9 place-items-center rounded-full bg-[#143c3a] text-xs font-bold text-white">
                {initials}
              </span>
            </div>
          </header>

          <DashboardMobileNav />

          <main className="flex-1 p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
