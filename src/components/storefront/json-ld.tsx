/** Server-rendered JSON-LD for SEO + AI search (Google rich results, ChatGPT). */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function StoreJsonLd({
  name,
  description,
  logoUrl,
}: {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Store",
        name,
        ...(description ? { description } : {}),
        ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency,
  inStock = true,
  storeName,
}: {
  name: string;
  description?: string | null;
  image?: string | null;
  price?: number | null;
  currency: string;
  inStock?: boolean;
  storeName: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        ...(description ? { description } : {}),
        ...(image ? { image } : {}),
        brand: { "@type": "Brand", name: storeName },
        ...(price != null
          ? {
              offers: {
                "@type": "Offer",
                price,
                priceCurrency: currency,
                availability: inStock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              },
            }
          : {}),
      }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}
