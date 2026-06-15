import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { getCartCount } from "@/lib/repositories/cart";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { StoreHeader } from "@/components/storefront/store-header";

const POLICIES: Record<string, { title: string; body: (name: string) => string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: (n) => [
      `${n} respects your privacy. We collect only the information needed to process your orders and respond to your enquiries — such as your name, phone, address, and email.`,
      "We never sell your personal data. Information is shared only with delivery partners to fulfil your order.",
      "You may request access to, or deletion of, your data at any time by contacting us.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: (n) => [
      `By placing an order with ${n}, you agree to these terms. Prices and availability may change without notice.`,
      "Orders are confirmed once we contact you. We reserve the right to cancel any order due to stock or pricing errors.",
      "Cash on Delivery is available in supported areas; please ensure someone is available to receive and pay for the order.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    body: (n) => [
      `${n} ships across the supported regions via trusted couriers. Delivery typically takes 2–5 business days.`,
      "Shipping fees are shown at checkout. You will receive updates about your order over phone or WhatsApp.",
      "If your area is not serviceable, our team will contact you with alternatives.",
    ],
  },
  refund: {
    title: "Return & Refund Policy",
    body: (n) => [
      `${n} accepts returns of unused items in original condition within 7 days of delivery.`,
      "To start a return, contact us with your order number. Damaged or incorrect items are replaced or refunded at no extra cost.",
      "Refunds are processed once the returned item is received and inspected.",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ policy: string }>;
}): Promise<Metadata> {
  const { policy } = await params;
  return { title: POLICIES[policy]?.title ?? "Policy" };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string; policy: string }>;
}) {
  const { slug, policy } = await params;
  const def = POLICIES[policy];
  if (!def) notFound();
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const cartCount = await getCartCount(store.id);

  return (
    <main className="min-h-screen text-[#171717]" style={{ background: theme.bg, fontFamily: font.css }}>
      <StoreHeader store={store} brand={brand} cartCount={cartCount} />
      <section className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
        <h1 className="text-4xl font-bold">{def.title}</h1>
        <div className="mt-6 space-y-4 leading-8 text-[#444]">
          {def.body(store.name).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
