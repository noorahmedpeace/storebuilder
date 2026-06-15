import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { getCartCount } from "@/lib/repositories/cart";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";

export const metadata = { title: "About" };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const cartCount = await getCartCount(store.id);

  const about =
    store.aboutText ||
    `${store.name} is ${store.businessType ? `a ${store.businessType.toLowerCase()} business` : "a business"} dedicated to quality products and reliable service. ${store.tagline ?? ""} We focus on fair prices, fast delivery, and looking after every customer.`;

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <StoreHeader store={store} brand={brand} cartCount={cartCount} />
      <section className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: brand }}>
          About us
        </p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">{store.name}</h1>
        <div className="mt-6 space-y-4 text-lg leading-8 text-[#444]">
          {about.split("\n").filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
