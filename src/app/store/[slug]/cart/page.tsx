import Link from "next/link";
import { notFound } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { cartTotals, getCart } from "@/lib/repositories/cart";
import { SHIPPING_FEE } from "@/lib/repositories/checkout";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";
import { updateItemAction, removeItemAction } from "../cart-actions";

export const metadata = { title: "Cart" };

export default async function CartPage({
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
  const cart = await getCart(store.id);
  const items = cart?.items ?? [];
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const totals = cart ? cartTotals(cart, items.length ? SHIPPING_FEE : 0) : null;

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <StoreHeader store={store} brand={brand} cartCount={count} />

      <section className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        <h1 className="text-3xl font-bold">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-white/60 p-12 text-center">
            <p className="font-bold">Your cart is empty</p>
            <Link
              href={`/store/${store.slug}`}
              className="mt-3 inline-block rounded-lg px-5 py-2 text-sm font-bold text-white"
              style={{ background: brand }}
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
            <div className="space-y-3">
              {items.map((item) => {
                const price = Number(item.variant.price);
                const img = item.variant.product.images[0]?.url;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-3"
                  >
                    <div
                      className="size-16 shrink-0 rounded-lg"
                      style={{
                        background: img
                          ? `center/cover no-repeat url(${img})`
                          : `linear-gradient(135deg, ${brand}, ${brand})`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{item.variant.product.title}</p>
                      <p className="text-sm text-[#68716d]">
                        {store.currency} {price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <QtyButton storeId={store.id} slug={store.slug} itemId={item.id} qty={item.quantity - 1}>
                        <Minus size={14} />
                      </QtyButton>
                      <span className="w-8 text-center font-mono font-bold">{item.quantity}</span>
                      <QtyButton storeId={store.id} slug={store.slug} itemId={item.id} qty={item.quantity + 1}>
                        <Plus size={14} />
                      </QtyButton>
                    </div>
                    <span className="w-24 text-right font-mono font-bold">
                      {store.currency} {(price * item.quantity).toLocaleString()}
                    </span>
                    <form action={removeItemAction}>
                      <input type="hidden" name="storeId" value={store.id} />
                      <input type="hidden" name="slug" value={store.slug} />
                      <input type="hidden" name="itemId" value={item.id} />
                      <button className="grid size-8 place-items-center rounded-lg border border-[#a23b3b]/40 text-[#a23b3b]">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-xl border border-black/10 bg-white p-5">
              <h2 className="font-bold">Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={`${store.currency} ${totals!.subtotal.toLocaleString()}`} />
                <Row label="Shipping" value={`${store.currency} ${totals!.shippingFee.toLocaleString()}`} />
                <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="font-mono">{store.currency} {totals!.total.toLocaleString()}</span>
                </div>
              </div>
              <Link
                href={`/store/${store.slug}/checkout`}
                className="mt-5 block rounded-lg py-3 text-center text-sm font-bold text-white"
                style={{ background: brand }}
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#555d59]">
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function QtyButton({
  storeId,
  slug,
  itemId,
  qty,
  children,
}: {
  storeId: string;
  slug: string;
  itemId: string;
  qty: number;
  children: React.ReactNode;
}) {
  return (
    <form action={updateItemAction}>
      <input type="hidden" name="storeId" value={storeId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="qty" value={qty} />
      <button className="grid size-8 place-items-center rounded-lg border border-black/15 hover:border-black/40">
        {children}
      </button>
    </form>
  );
}
