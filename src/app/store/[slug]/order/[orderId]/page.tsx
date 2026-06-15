import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { getOrderForStore } from "@/lib/repositories/checkout";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";

export const metadata = { title: "Order confirmed" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ slug: string; orderId: string }>;
}) {
  const { slug, orderId } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  const order = await getOrderForStore(store.id, orderId);
  if (!order) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const ref = order.id.slice(0, 8).toUpperCase();

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <StoreHeader store={store} brand={brand} />

      <section className="mx-auto max-w-2xl px-5 py-14 lg:px-8">
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
          <CheckCircle2 className="mx-auto" size={48} style={{ color: brand }} />
          <h1 className="mt-4 text-3xl font-bold">Order confirmed!</h1>
          <p className="mt-2 text-[#555d59]">
            Thank you, {order.customerName ?? "there"}. Your order{" "}
            <span className="font-mono font-bold">#{ref}</span> has been placed.
          </p>
          <p className="mt-1 text-sm text-[#68716d]">
            Payment: {order.paymentMethod ?? "COD"} · Status: {order.status}
          </p>

          <div className="mt-6 space-y-2 rounded-xl border border-black/10 bg-[#faf9f6] p-4 text-left text-sm">
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between gap-3">
                <span className="truncate">
                  {i.variant.product.title} × {i.quantity}
                </span>
                <span className="font-mono">
                  {store.currency} {(Number(i.price) * i.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-black/10 pt-2 text-[#555d59]">
              <span>Shipping</span>
              <span className="font-mono">{store.currency} {Number(order.shippingFee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="font-mono">{store.currency} {Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          {order.shippingAddress ? (
            <p className="mt-4 text-sm text-[#68716d]">
              Delivering to: {order.shippingAddress}, {order.shippingCity}
            </p>
          ) : null}

          <Link
            href={`/store/${store.slug}`}
            className="mt-7 inline-block rounded-lg px-6 py-3 text-sm font-bold text-white"
            style={{ background: brand }}
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
