import { notFound, redirect } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { createLead } from "@/lib/repositories/leads";
import { getCartCount } from "@/lib/repositories/cart";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";

export const metadata = { title: "Contact" };

async function submitLead(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug") ?? "");
  const storeId = String(formData.get("storeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (storeId && name && phone) {
    await createLead(storeId, {
      name,
      phone,
      email: String(formData.get("email") ?? "").trim() || undefined,
      message: String(formData.get("message") ?? "").trim() || undefined,
      kind: "contact",
    });
  }
  redirect(`/store/${slug}/contact?sent=1`);
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { slug } = await params;
  const { sent } = await searchParams;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const cartCount = await getCartCount(store.id);
  const wa = store.whatsapp?.replace(/[^0-9]/g, "");

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <StoreHeader store={store} brand={brand} cartCount={cartCount} />
      <section className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        <h1 className="text-4xl font-bold">Contact {store.name}</h1>
        <p className="mt-2 text-[#555d59]">
          Have a question or a bulk order? Send us a message and we&apos;ll get back to you.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-black/10 bg-white p-6">
            {sent ? (
              <div className="rounded-lg bg-[#f6faf7] p-6 text-center">
                <p className="text-lg font-bold" style={{ color: brand }}>
                  Thank you! ✅
                </p>
                <p className="mt-1 text-sm text-[#555d59]">
                  Your message has been received. We&apos;ll contact you soon.
                </p>
              </div>
            ) : (
              <form action={submitLead} className="space-y-4">
                <input type="hidden" name="slug" value={store.slug} />
                <input type="hidden" name="storeId" value={store.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="name" label="Name" required />
                  <Field name="phone" label="Phone" required placeholder="+9230..." />
                  <Field name="email" label="Email (optional)" type="email" />
                </div>
                <label className="block">
                  <span className="text-sm font-semibold text-[#4f5b58]">Message</span>
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-black/15 bg-[#faf9f6] px-3 py-2 outline-none focus:border-black/40"
                    placeholder="What do you need? (e.g. bulk quantity, custom order)"
                  />
                </label>
                <button
                  type="submit"
                  className="h-11 rounded-lg px-6 text-sm font-bold text-white"
                  style={{ background: brand }}
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          <div className="h-fit rounded-xl border border-black/10 bg-white p-6">
            <h2 className="font-bold">Reach us</h2>
            {wa ? (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white"
                style={{ background: "#25D366" }}
              >
                <MessageCircle size={16} /> WhatsApp us
              </a>
            ) : null}
            <p className="mt-4 text-sm text-[#68716d]">
              We typically reply within a few hours during business days.
            </p>
          </div>
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
