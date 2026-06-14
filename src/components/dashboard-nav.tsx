"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  Boxes,
  FolderTree,
  Globe,
  LayoutDashboard,
  LayoutTemplate,
  Package,
  Palette,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

export const NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/catalog", label: "Catalog", icon: FolderTree },
  { href: "/dashboard/marketing", label: "Marketing", icon: BadgePercent },
  { href: "/dashboard/theme", label: "Theme", icon: Palette },
  { href: "/dashboard/builder", label: "Builder", icon: LayoutTemplate },
  { href: "/dashboard/domains", label: "Domains", icon: Globe },
];

function useActive() {
  const pathname = usePathname();
  return (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function DashboardNav() {
  const isActive = useActive();
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {NAV.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-[#143c3a] text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <item.icon size={17} className={active ? "" : "text-zinc-400"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardMobileNav() {
  const isActive = useActive();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-zinc-200 bg-white px-3 py-2 lg:hidden">
      {NAV.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-[#143c3a] text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <item.icon size={15} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function CurrentSection() {
  const isActive = useActive();
  const current = [...NAV].reverse().find((item) => isActive(item));
  return (
    <p className="text-sm font-semibold text-zinc-900">
      {current?.label ?? "Dashboard"}
    </p>
  );
}
