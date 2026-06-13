import Link from "next/link";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { storefrontProducts } from "@/lib/platform-data";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-[#fbfaf5] text-[#171717]">
      <div className="bg-[#143c3a] px-5 py-2 text-center text-sm font-semibold text-white">
        Free delivery in Lahore over Rs 10,000. WhatsApp support available.
      </div>

      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#fbfaf5]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-2xl font-bold">
            Oud Reserve
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#595f5c] md:flex">
            <a href="#shop">Shop</a>
            <a href="#reviews">Reviews</a>
            <a href="#contact">Contact</a>
            <Link href="/dashboard">Merchant admin</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button className="grid size-10 place-items-center rounded-lg border border-black/10 bg-white">
              <Search size={18} />
            </button>
            <button className="grid size-10 place-items-center rounded-lg border border-black/10 bg-white">
              <Heart size={18} />
            </button>
            <button className="grid size-10 place-items-center rounded-lg bg-[#143c3a] text-white">
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
            {slug.replaceAll("-", " ")} storefront
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-[1.02] md:text-7xl">
            Luxury oud perfumes for modern gifting.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#555d59]">
            Premium fragrance collections with COD, Raast, JazzCash, reviews,
            schema-ready product pages, and WhatsApp assisted checkout.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#shop"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#143c3a] px-5 text-sm font-bold text-white"
            >
              Shop collection
            </a>
            <a
              href="https://wa.me/923001234567"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-5 text-sm font-bold text-[#143c3a]"
            >
              <MessageCircle size={17} /> Order on WhatsApp
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-black/10 bg-[#143c3a] p-4 shadow-2xl">
          <div className="aspect-[4/3] rounded-lg bg-[linear-gradient(135deg,#f6ead4_0%,#d3a44d_42%,#143c3a_100%)]" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["4.9/5", "customer rating"],
              ["24h", "dispatch"],
              ["COD", "available"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg bg-white/10 p-4 text-white">
                <p className="font-mono text-2xl font-bold">{value}</p>
                <p className="text-sm text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6128]">
              Featured
            </p>
            <h2 className="mt-2 text-4xl font-bold">Best sellers</h2>
          </div>
          <span className="hidden rounded-lg bg-[#e7ece2] px-3 py-2 text-sm font-bold text-[#143c3a] sm:inline-flex">
            SEO schema enabled
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {storefrontProducts.map((product, index) => (
            <article
              key={product.name}
              className="rounded-lg border border-black/10 bg-white p-4 shadow-sm"
            >
              <div
                className={[
                  "aspect-square rounded-lg",
                  index === 0
                    ? "bg-[linear-gradient(135deg,#143c3a,#d6a747)]"
                    : index === 1
                      ? "bg-[linear-gradient(135deg,#f3d7a0,#9a6128)]"
                      : "bg-[linear-gradient(135deg,#f7f4ee,#c17f7c)]",
                ].join(" ")}
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-lg bg-[#e7ece2] px-3 py-1 text-xs font-bold text-[#143c3a]">
                  {product.tag}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-[#9a6128]">
                  <Star size={15} fill="currentColor" /> 4.9
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold">{product.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-[#5d6561]">
                {product.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-mono text-lg font-bold">
                  {product.price}
                </span>
                <button className="rounded-lg bg-[#143c3a] px-4 py-2 text-sm font-bold text-white">
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="reviews"
        className="border-y border-black/10 bg-[#e7ece2] px-5 py-12 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            [Truck, "Fast courier dispatch", "Leopards, TCS, Call Courier, and Trax adapters."],
            [ShieldCheck, "Trusted checkout", "COD, JazzCash, EasyPaisa, Raast, and Stripe ready."],
            [BadgeCheck, "Verified reviews", "Product, offer, review, and rating schema supported."],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-lg bg-white p-6">
              <Icon className="text-[#143c3a]" />
              <h3 className="mt-5 text-xl font-bold">{title as string}</h3>
              <p className="mt-3 leading-7 text-[#5d6561]">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="bg-[#143c3a] px-5 py-10 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-bold">Oud Reserve</p>
            <p className="mt-2 text-white/70">
              Powered by BazaarOS Commerce Cloud.
            </p>
          </div>
          <a
            href="https://wa.me/923001234567"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-[#143c3a]"
          >
            <MessageCircle size={17} /> WhatsApp support
          </a>
        </div>
      </footer>
    </main>
  );
}
