import Link from "next/link";
import { Box, CheckCircle2, LayoutDashboard, Store, WandSparkles } from "lucide-react";

export const metadata = { title: "Demo store created - StoreBuilder" };

export default async function DemoSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string; slug?: string }>;
}) {
  const params = await searchParams;
  const store = params.store || "Your Demo Store";
  const slug = params.slug || "demo-store";

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 text-[#171717]">
      <section className="mx-auto max-w-4xl rounded-lg border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-lg bg-[#143c3a] text-white">
            <CheckCircle2 size={24} />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#54706b]">
              Preview mode
            </p>
            <h1 className="text-3xl font-bold">Your store flow is ready</h1>
          </div>
        </div>

        <p className="mt-5 max-w-2xl leading-8 text-[#4f5b58]">
          <strong>{store}</strong> was accepted in demo mode. Add a production
          database on Vercel to save real stores, products, orders, customers,
          and theme settings.
        </p>

        <div className="mt-6 rounded-lg bg-[#f7f4ee] p-4">
          <p className="font-mono text-sm text-[#143c3a]">/{slug}</p>
          <p className="mt-2 text-sm text-[#5d6561]">
            This will become your live store URL after database provisioning.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Preview dashboard",
              text: "See products, orders, inventory, marketing, and analytics.",
              href: "/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "3D builder plan",
              text: "Review the immersive builder and asset pipeline.",
              href: "/immersive-builder",
              icon: Box,
            },
            {
              title: "Theme engine",
              text: "Explore templates, colors, typography, and sections.",
              href: "/themes",
              icon: WandSparkles,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-lg border border-black/10 bg-[#f7f4ee] p-5 transition hover:border-[#143c3a]"
            >
              <item.icon className="text-[#143c3a]" size={22} />
              <h2 className="mt-4 font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5d6561]">
                {item.text}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-black/15 px-4 text-sm font-bold text-[#143c3a]"
          >
            Back home
          </Link>
          <Link
            href="/store/oud-reserve"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#143c3a] px-4 text-sm font-bold text-white"
          >
            Demo storefront <Store size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
