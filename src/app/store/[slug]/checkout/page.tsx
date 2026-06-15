import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { cartTotals, getCart } from "@/lib/repositories/cart";
import { SHIPPING_FEE } from "@/lib/repositories/checkout";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";
import { checkoutAction } from "../cart-actions";

export const metadata = { title: "Checkout" };

const ERRORS: Record<string, string> = {
  empty: "Your cart is empty.",
  error: "Could not place the order. Please try again.",
};

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
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
        <h1 className="text-3xl font-bold">Checkout</h1>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-white/60 p-12 text-center">
            <p className="font-bold">Your cart is empty</p>
            <Link href={`/store/${store.slug}`} className="mt-3 inline-block rounded-lg px-5 py-2 text-sm font-bold text-white" style={{ background: brand }}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <form action={checkoutAction} className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
              <input type="hidden" name="storeId" value={store.id} />
              <input type="hidden" name="slug" value={store.slug} />
              {error ? (
                <p className="rounded-lg bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#a23b3b]">
                  {ERRORS[error] ?? ERRORS.error}
                </p>
              ) : null}
              <h2 className="font-bold">Delivery details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Full name" required />
                <Field name="phone" label="Phone" placeholder="+9230..." required />
                <Field name="email" label="Email (optional)" type="email" />
                <Field name="city" label="City" required />
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-[#4f5b58]">Delivery address</span>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-black/15 bg-[#faf9f6] px-3 py-2 outline-none focus:border-black/40"
                />
              </label>

              <div className="rounded-lg border border-black/10 bg-[#f6faf7] p-3 text-sm font-semibold" style={{ color: brand }}>
                Payment: Cash on Delivery (COD)
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-lg text-sm font-bold text-white"
                style={{ background: brand }}
              >
                Place order · {store.currency} {totals!.total.toLocaleString()}
              </button>
            </form>

            <div className="h-fit rounded-xl border border-black/10 bg-white p-5">
              <h2 className="font-bold">Your order</h2>
              <div className="mt-4 space-y-2 text-sm">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between gap-3 text-[#555d59]">
                    <span className="truncate">{i.variant.product.title} × {i.quantity}</span>
                    <span className="font-mono">{store.currency} {(Number(i.variant.price) * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-black/10 pt-2 text-[#555d59]">
                  <span>Shipping</span>
                  <span className="font-mono">{store.currency} {totals!.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="font-mono">{store.currency} {totals!.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#4f5b58]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-[#faf9f6] px-3 outline-none focus:border-black/40"
      />
    </label>
  );
}
