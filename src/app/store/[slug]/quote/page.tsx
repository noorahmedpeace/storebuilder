import { notFound, redirect } from "next/navigation";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { createLead } from "@/lib/repositories/leads";
import { getCartCount } from "@/lib/repositories/cart";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";

export const metadata = { title: "Request a quote" };

async function submitQuote(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug") ?? "");
  const storeId = String(formData.get("storeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const product = String(formData.get("product") ?? "").trim();
  const qty = String(formData.get("qty") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (storeId && name && phone) {
    await createLead(storeId, {
      name,
      phone,
      email: String(formData.get("email") ?? "").trim() || undefined,
      message: `Product: ${product || "—"} | Qty: ${qty || "—"}${note ? ` | ${note}` : ""}`,
      kind: "quote",
    });
  }
  redirect(`/store/${slug}/quote?sent=1`);
}

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string; product?: string }>;
}) {
  const { slug } = await params;
  const { sent, product } = await searchParams;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const cartCount = await getCartCount(store.id);

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <StoreHeader store={store} brand={brand} cartCount={cartCount} />
      <section className="mx-auto max-w-2xl px-5 py-10 lg:px-8">
        <h1 className="text-4xl font-bold">Request a bulk quote</h1>
        <p className="mt-2 text-[#555d59]">
          Buying in quantity? Tell us what you need and we&apos;ll send wholesale pricing.
        </p>

        <div className="mt-6 rounded-xl border border-black/10 bg-white p-6">
          {sent ? (
            <div className="rounded-lg bg-[#f6faf7] p-6 text-center">
              <p className="text-lg font-bold" style={{ color: brand }}>Quote request sent ✅</p>
              <p className="mt-1 text-sm text-[#555d59]">Our team will contact you with pricing.</p>
            </div>
          ) : (
            <form action={submitQuote} className="space-y-4">
              <input type="hidden" name="slug" value={store.slug} />
              <input type="hidden" name="storeId" value={store.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Name" required />
                <Field name="phone" label="Phone" required placeholder="+9230..." />
                <Field name="email" label="Email (optional)" type="email" />
                <Field name="product" label="Product" defaultValue={product} placeholder="Which product?" />
                <Field name="qty" label="Quantity / MOQ" placeholder="e.g. 500 units" />
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-[#4f5b58]">Notes</span>
                <textarea
                  name="note"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-black/15 bg-[#faf9f6] px-3 py-2 outline-none focus:border-black/40"
                  placeholder="Delivery city, timeline, specs..."
                />
              </label>
              <button type="submit" className="h-11 rounded-lg px-6 text-sm font-bold text-white" style={{ background: brand }}>
                Request quote
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-[#faf9f6] px-3 outline-none focus:border-black/40"
      />
    </label>
  );
}
