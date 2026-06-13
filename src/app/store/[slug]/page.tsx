import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, ShoppingBag, Star } from "lucide-react";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { getTheme } from "@/lib/themes";

function waLink(whatsapp: string | null, text: string) {
  if (!whatsapp) return null;
  const digits = whatsapp.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "Store not found" };
  const title = store.name;
  const description = store.tagline ?? `Shop ${store.name} online.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const accent = store.accentColor || theme.accentColor;
  const heading = store.heroHeading ?? store.name;
  const sub =
    store.heroSubheading ??
    store.tagline ??
    `Discover products from ${store.name}.`;

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg }}>
      {store.announcement ? (
        <div
          className="px-5 py-2 text-center text-sm font-semibold text-white"
          style={{ background: brand }}
        >
          {store.announcement}
        </div>
      ) : null}

      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              className="grid size-10 place-items-center rounded-lg font-bold text-white"
              style={{ background: brand }}
            >
              {store.logoText ?? store.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-xl font-bold">{store.name}</span>
          </div>
          {waLink(store.whatsapp, `Hi ${store.name}, I'd like to order.`) ? (
            <a
              href={waLink(store.whatsapp, `Hi ${store.name}, I'd like to order.`)!}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold text-white"
              style={{ background: brand }}
            >
              <MessageCircle size={16} /> Order on WhatsApp
            </a>
          ) : null}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <p
          className="text-sm font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {store.businessType || "Online store"}
        </p>
        <h1 className="mt-3 max-w-3xl text-5xl font-bold leading-[1.05] md:text-6xl">
          {heading}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#555d59]">{sub}</p>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <h2 className="mb-7 text-3xl font-bold">Products</h2>

        {store.products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/15 bg-white/60 p-12 text-center">
            <ShoppingBag className="mx-auto" style={{ color: brand }} />
            <p className="mt-3 font-bold">Coming soon</p>
            <p className="mt-1 text-sm text-[#68716d]">
              This store hasn&apos;t published any products yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {store.products.map((product) => {
              const price = product.variants[0]
                ? Number(product.variants[0].price)
                : null;
              const order = waLink(
                store.whatsapp,
                `Hi ${store.name}, I'd like to order: ${product.title}`,
              );
              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm"
                >
                  <div
                    className="aspect-square w-full"
                    style={{
                      background: product.images[0]
                        ? `center/cover no-repeat url(${product.images[0].url})`
                        : `linear-gradient(135deg, ${brand}, ${accent})`,
                    }}
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="rounded-lg px-2 py-1 text-xs font-bold text-white"
                        style={{ background: accent }}
                      >
                        {store.currency}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-bold" style={{ color: accent }}>
                        <Star size={14} fill="currentColor" /> New
                      </span>
                    </div>
                    <h3 className="mt-3 font-bold">{product.title}</h3>
                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-[#5d6561]">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-mono text-lg font-bold">
                        {price !== null
                          ? `${store.currency} ${price.toLocaleString()}`
                          : "—"}
                      </span>
                      {order ? (
                        <a
                          href={order}
                          className="rounded-lg px-3 py-2 text-sm font-bold text-white"
                          style={{ background: brand }}
                        >
                          Order
                        </a>
                      ) : (
                        <span className="rounded-lg px-3 py-2 text-sm font-bold text-white" style={{ background: brand }}>
                          Order
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="px-5 py-10 text-white lg:px-8" style={{ background: brand }}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-bold">{store.name}</p>
            <p className="mt-2 text-white/70">Powered by BazaarOS Commerce Cloud.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
