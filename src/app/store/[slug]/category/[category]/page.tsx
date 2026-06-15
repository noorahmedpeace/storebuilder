import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { getStorefrontCategory } from "@/lib/repositories/catalog";
import { getCartCount } from "@/lib/repositories/cart";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";
import { AddToCart } from "@/components/storefront/add-to-cart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; category: string }>;
}): Promise<Metadata> {
  const { slug, category } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "Not found" };
  const cat = await getStorefrontCategory(store.id, category);
  return { title: `${cat?.name ?? "Category"} · ${store.name}` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; category: string }>;
}) {
  const { slug, category: categorySlug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  const category = await getStorefrontCategory(store.id, categorySlug);
  if (!category) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const accent = store.accentColor || theme.accentColor;
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const cartCount = await getCartCount(store.id);

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <StoreHeader store={store} brand={brand} cartCount={cartCount} />
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <Link href={`/store/${store.slug}`} className="text-sm font-semibold text-[#5d6561] hover:underline">
          ← {store.name}
        </Link>
        <h1 className="mt-3 text-4xl font-bold">{category.name}</h1>

        {category.products.length === 0 ? (
          <p className="mt-6 text-[#68716d]">No products in this category yet.</p>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.products.map((product) => {
              const price = product.variants[0] ? Number(product.variants[0].price) : null;
              return (
                <article key={product.id} className={`overflow-hidden border border-black/10 bg-white shadow-sm ${theme.radius}`}>
                  <Link href={`/store/${store.slug}/product/${product.slug}`} className="block aspect-square w-full">
                    <div
                      className="h-full w-full"
                      style={{
                        background: product.images[0]
                          ? `center/cover no-repeat url(${product.images[0].url})`
                          : `linear-gradient(135deg, ${brand}, ${accent})`,
                      }}
                    />
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: accent }}>
                        {store.currency}
                      </span>
                      <Star size={14} style={{ color: accent }} fill="currentColor" />
                    </div>
                    <Link href={`/store/${store.slug}/product/${product.slug}`}>
                      <h3 className="mt-3 text-lg font-bold hover:underline">{product.title}</h3>
                    </Link>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-lg font-bold">
                        {price !== null ? `${store.currency} ${price.toLocaleString()}` : "—"}
                      </span>
                      {product.variants[0] ? (
                        <AddToCart storeId={store.id} slug={store.slug} variantId={product.variants[0].id} brand={brand} label="Add" />
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
