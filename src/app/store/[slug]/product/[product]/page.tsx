import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { getProductBySlug } from "@/lib/repositories/products";
import { getCartCount } from "@/lib/repositories/cart";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";
import { AddToCart } from "@/components/storefront/add-to-cart";
import { ProductJsonLd } from "@/components/storefront/json-ld";

function waLink(whatsapp: string | null, text: string) {
  if (!whatsapp) return null;
  const d = whatsapp.replace(/[^0-9]/g, "");
  return d ? `https://wa.me/${d}?text=${encodeURIComponent(text)}` : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}): Promise<Metadata> {
  const { slug, product } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "Not found" };
  const p = await getProductBySlug(store.id, product);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.seoTitle || p.title} · ${store.name}`,
    description: p.seoDescription || p.description?.slice(0, 150),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}) {
  const { slug, product: productSlug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  const product = await getProductBySlug(store.id, productSlug);
  if (!product) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const accent = store.accentColor || theme.accentColor;
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const variant = product.variants[0];
  const price = variant ? Number(variant.price) : null;
  const cartCount = await getCartCount(store.id);
  const order = waLink(
    store.whatsapp,
    `Hi ${store.name}, I'd like to order: ${product.title}`,
  );

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <ProductJsonLd
        name={product.title}
        description={product.description}
        image={product.images[0]?.url}
        price={price}
        currency={store.currency}
        storeName={store.name}
      />
      <StoreHeader store={store} brand={brand} cartCount={cartCount} />

      <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <Link href={`/store/${store.slug}`} className="text-sm font-semibold text-[#5d6561] hover:underline">
          ← Back to {store.name}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className={`overflow-hidden border border-black/10 bg-white ${theme.radius}`}>
            <div
              className="aspect-square w-full"
              style={{
                background: product.images[0]
                  ? `center/cover no-repeat url(${product.images[0].url})`
                  : `linear-gradient(135deg, ${brand}, ${accent})`,
              }}
            />
            {product.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-2 p-2">
                {product.images.slice(0, 4).map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square rounded-md"
                    style={{ background: `center/cover no-repeat url(${img.url})` }}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col">
            {product.category ? (
              <Link
                href={`/store/${store.slug}/category/${product.category.slug}`}
                className="text-sm font-bold uppercase tracking-[0.2em] hover:underline"
                style={{ color: accent }}
              >
                {product.category.name}
              </Link>
            ) : null}
            <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">{product.title}</h1>
            <p className="mt-4 font-mono text-3xl font-bold" style={{ color: brand }}>
              {price !== null ? `${store.currency} ${price.toLocaleString()}` : "—"}
            </p>
            <p className="mt-5 leading-8 text-[#555d59]">{product.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {variant ? (
                <AddToCart
                  storeId={store.id}
                  slug={store.slug}
                  variantId={variant.id}
                  brand={brand}
                  label="Add to cart"
                  className="h-12 px-6"
                />
              ) : null}
              {order ? (
                <a
                  href={order}
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-black/15 bg-white px-6 text-sm font-bold"
                  style={{ color: brand }}
                >
                  <MessageCircle size={16} /> Order on WhatsApp
                </a>
              ) : null}
            </div>

            {variant ? (
              <p className="mt-4 text-xs text-[#68716d]">SKU: {variant.sku}</p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
