import Link from "next/link";
import { ShoppingCart } from "lucide-react";

type HeaderStore = {
  name: string;
  slug: string;
  logoText: string | null;
  logoUrl: string | null;
};

/** Shared storefront chrome for product/cart/checkout/order pages. */
export function StoreHeader({
  store,
  brand,
  cartCount = 0,
}: {
  store: HeaderStore;
  brand: string;
  cartCount?: number;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href={`/store/${store.slug}`} className="flex items-center gap-3">
          {store.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={store.logoUrl} alt={store.name} className="size-10 rounded-lg object-cover" />
          ) : (
            <span
              className="grid size-10 place-items-center rounded-lg font-bold text-white"
              style={{ background: brand }}
            >
              {store.logoText ?? store.name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="text-xl font-bold">{store.name}</span>
        </Link>
        <Link
          href={`/store/${store.slug}/cart`}
          className="relative inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold text-white"
          style={{ background: brand }}
        >
          <ShoppingCart size={16} /> Cart
          {cartCount > 0 ? (
            <span className="ml-1 grid min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-bold" style={{ color: brand }}>
              {cartCount}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
