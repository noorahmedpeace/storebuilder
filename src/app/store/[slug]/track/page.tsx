import { notFound, redirect } from "next/navigation";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { findOrdersByPhone } from "@/lib/repositories/checkout";
import { getCartCount } from "@/lib/repositories/cart";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";
import { reorderAction } from "../cart-actions";

export const metadata = { title: "Track order" };

async function searchAction(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  redirect(`/store/${slug}/track?phone=${encodeURIComponent(phone)}`);
}

const STEPS = ["PENDING", "PAID", "PACKING", "SHIPPED", "DELIVERED"];

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ phone?: string }>;
}) {
  const { slug } = await params;
  const { phone } = await searchParams;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const cartCount = await getCartCount(store.id);
  const orders = phone ? await findOrdersByPhone(store.id, phone) : null;

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <StoreHeader store={store} brand={brand} cartCount={cartCount} />
      <section className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
        <h1 className="text-4xl font-bold">Track your order</h1>
        <p className="mt-2 text-[#555d59]">Enter the phone number you ordered with.</p>

        <form action={searchAction} className="mt-6 flex gap-2">
          <input type="hidden" name="slug" value={store.slug} />
          <input
            name="phone"
            required
            defaultValue={phone ?? ""}
            placeholder="+9230..."
            className="h-11 flex-1 rounded-lg border border-black/15 bg-white px-3 outline-none focus:border-black/40"
          />
          <button className="h-11 rounded-lg px-5 text-sm font-bold text-white" style={{ background: brand }}>
            Track
          </button>
        </form>

        {orders ? (
          orders.length === 0 ? (
            <p className="mt-8 text-[#68716d]">No orders found for that number.</p>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => {
                const stepIdx = STEPS.indexOf(order.status);
                return (
                  <div key={order.id} className="rounded-xl border border-black/10 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <span className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ background: brand }}>
                        {order.status}
                      </span>
                    </div>
                    {stepIdx >= 0 ? (
                      <div className="mt-4 flex gap-1">
                        {STEPS.map((s, i) => (
                          <div
                            key={s}
                            className="h-1.5 flex-1 rounded-full"
                            style={{ background: i <= stepIdx ? brand : "rgba(0,0,0,0.1)" }}
                            title={s}
                          />
                        ))}
                      </div>
                    ) : null}
                    <ul className="mt-4 space-y-1 text-sm text-[#555d59]">
                      {order.items.map((i) => (
                        <li key={i.id}>
                          {i.variant.product.title} × {i.quantity}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono font-bold">
                        {store.currency} {Number(order.total).toLocaleString()}
                      </span>
                      <form action={reorderAction}>
                        <input type="hidden" name="storeId" value={store.id} />
                        <input type="hidden" name="slug" value={store.slug} />
                        <input type="hidden" name="orderId" value={order.id} />
                        <button className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-bold" style={{ color: brand }}>
                          Reorder
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : null}
      </section>
    </main>
  );
}
