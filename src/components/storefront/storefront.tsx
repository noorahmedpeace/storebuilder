import { Check, MessageCircle, ShoppingBag, Star } from "lucide-react";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { normalizeLayout, type Section } from "@/lib/sections";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { AnimatedHeadline } from "@/components/motion/animated-headline";
import { Aurora } from "@/components/motion/aurora";
import { Countdown } from "./countdown";
import { NewsletterForm } from "./newsletter-form";

export type StoreData = NonNullable<Awaited<ReturnType<typeof getStoreBySlug>>>;

function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function waLink(whatsapp: string | null, text: string) {
  if (!whatsapp) return null;
  const digits = whatsapp.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function Storefront({ store }: { store: StoreData }) {
  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const accent = store.accentColor || theme.accentColor;
  const sections = normalizeLayout(store.layout).filter((s) => s.visible);
  const font = getFont(store.fontKey ?? theme.defaultFont);

  return (
    <main
      className="min-h-screen text-[#171717]"
      style={{ background: theme.bg, fontFamily: font.css }}
    >
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            {store.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.logoUrl}
                alt={store.name}
                className="size-10 rounded-lg object-cover"
              />
            ) : (
              <span
                className="grid size-10 place-items-center rounded-lg font-bold text-white"
                style={{ background: brand }}
              >
                {store.logoText ?? store.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="text-xl font-bold">{store.name}</span>
          </div>
          {waLink(store.whatsapp, `Hi ${store.name}, I'd like to order.`) ? (
            <a
              href={waLink(store.whatsapp, `Hi ${store.name}, I'd like to order.`)!}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold text-white"
              style={{ background: brand }}
            >
              <MessageCircle size={16} /> Order on WhatsApp
            </a>
          ) : null}
        </div>
      </header>

      {sections.map((section) => (
        <Reveal key={section.id}>
          <SectionView
            section={section}
            store={store}
            theme={theme}
            brand={brand}
            accent={accent}
          />
        </Reveal>
      ))}

      <footer className="px-5 py-10 text-white lg:px-8" style={{ background: brand }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-2xl font-bold">{store.name}</p>
          <p className="mt-2 text-white/70">Powered by StoreBuilder Cloud.</p>
        </div>
      </footer>
    </main>
  );
}

function SectionView({
  section,
  store,
  theme,
  brand,
  accent,
}: {
  section: Section;
  store: StoreData;
  theme: ReturnType<typeof getTheme>;
  brand: string;
  accent: string;
}) {
  const p = section.props ?? {};
  const head = "";
  const upper = theme.uppercase ? "uppercase tracking-wide" : "";

  switch (section.type) {
    case "announcement": {
      const text = p.text || store.announcement;
      if (!text) return null;
      return (
        <div
          className="px-5 py-2 text-center text-sm font-semibold text-white"
          style={{ background: brand }}
        >
          {text}
        </div>
      );
    }

    case "hero": {
      const heading = p.heading || store.heroHeading || store.name;
      const sub =
        p.subheading ||
        store.heroSubheading ||
        store.tagline ||
        `Discover products from ${store.name}.`;
      return (
        <section className="relative overflow-hidden">
          <Aurora from={accent} via={brand} to={accent} className="opacity-40" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
            <p
              className="text-sm font-bold uppercase tracking-[0.25em]"
              style={{ color: accent }}
            >
              {store.businessType || "Online store"}
            </p>
            <h1
              className={`mt-4 max-w-3xl text-5xl font-bold leading-[1.03] md:text-7xl ${head} ${upper}`}
            >
              <AnimatedHeadline text={heading} />
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#555d59]">{sub}</p>
          </div>
        </section>
      );
    }

    case "products":
      return (
        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <h2 className={`mb-7 text-3xl font-bold ${head} ${upper}`}>
            {p.title || "Products"}
          </h2>
          {store.products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-12 text-center">
              <ShoppingBag className="mx-auto" style={{ color: brand }} />
              <p className="mt-3 font-bold">Coming soon</p>
              <p className="mt-1 text-sm text-[#68716d]">
                This store hasn&apos;t published any products yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {store.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  store={store}
                  theme={theme}
                  brand={brand}
                  accent={accent}
                />
              ))}
            </div>
          )}
        </section>
      );

    case "richText":
      if (!p.heading && !p.body) return null;
      return (
        <section className="mx-auto max-w-3xl px-5 py-12 text-center lg:px-8">
          {p.heading ? (
            <h2 className={`text-3xl font-bold ${head} ${upper}`}>{p.heading}</h2>
          ) : null}
          {p.body ? (
            <p className="mt-4 text-lg leading-8 text-[#555d59]">{p.body}</p>
          ) : null}
        </section>
      );

    case "banner":
      if (!p.text) return null;
      return (
        <section
          className="px-5 py-10 text-center text-2xl font-bold text-white lg:px-8"
          style={{ background: accent }}
        >
          {p.text}
        </section>
      );

    case "whatsapp": {
      const link = waLink(store.whatsapp, `Hi ${store.name}, I'd like to order.`);
      if (!link) return null;
      return (
        <section className="mx-auto max-w-7xl px-5 py-12 text-center lg:px-8">
          <a
            href={link}
            className="inline-flex h-12 items-center gap-2 rounded-lg px-6 text-base font-bold text-white"
            style={{ background: brand }}
          >
            <MessageCircle size={18} /> {p.text || "Order on WhatsApp"}
          </a>
        </section>
      );
    }

    case "features": {
      const items = (p.items || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!items.length) return null;
      return (
        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          {p.title ? (
            <h2 className={`mb-6 text-2xl font-bold ${upper}`}>{p.title}</h2>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4"
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-white"
                  style={{ background: brand }}
                >
                  <Check size={16} />
                </span>
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "reviews": {
      const reviews = [p.r1, p.r2, p.r3]
        .filter((r): r is string => Boolean(r && r.trim()))
        .map((r) => {
          const [name, ...rest] = r.split("—");
          const quote = rest.join("—").trim();
          return quote
            ? { name: name.trim(), quote }
            : { name: "Customer", quote: name.trim() };
        });
      if (!reviews.length) return null;
      return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className={`mb-6 text-3xl font-bold ${upper}`}>
            {p.title || "What customers say"}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-5">
                <div className="flex gap-0.5" style={{ color: accent }}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 leading-7 text-[#444]">“{r.quote}”</p>
                <p className="mt-3 text-sm font-bold">{r.name}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "faq": {
      const faqs = [p.q1, p.q2, p.q3]
        .filter((q): q is string => Boolean(q && q.trim()))
        .map((q) => {
          const [question, ...rest] = q.split("|");
          return { question: question.trim(), answer: rest.join("|").trim() };
        })
        .filter((f) => f.question);
      if (!faqs.length) return null;
      return (
        <section className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
          <h2 className={`mb-6 text-3xl font-bold ${upper}`}>
            {p.title || "Frequently asked questions"}
          </h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-xl border border-black/10 bg-white p-4">
                <summary className="cursor-pointer font-bold">{f.question}</summary>
                {f.answer ? (
                  <p className="mt-2 leading-7 text-[#555]">{f.answer}</p>
                ) : null}
              </details>
            ))}
          </div>
        </section>
      );
    }

    case "imageBanner": {
      if (!p.imageUrl) return null;
      return (
        <section className="relative">
          <div
            className="flex min-h-[280px] items-center justify-center px-5 py-16 text-center md:min-h-[360px]"
            style={{
              background: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)), center/cover no-repeat url(${p.imageUrl})`,
            }}
          >
            <div className="max-w-2xl text-white">
              {p.heading ? (
                <h2 className={`text-4xl font-bold md:text-5xl ${upper}`}>
                  {p.heading}
                </h2>
              ) : null}
              {p.text ? <p className="mt-3 text-lg text-white/85">{p.text}</p> : null}
            </div>
          </div>
        </section>
      );
    }

    case "video": {
      if (!p.url) return null;
      const yt = youtubeId(p.url);
      return (
        <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
          {p.title ? (
            <h2 className={`mb-6 text-3xl font-bold ${upper}`}>{p.title}</h2>
          ) : null}
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-black">
            {yt ? (
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${yt}`}
                title={p.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls className="aspect-video w-full" src={p.url} />
            )}
          </div>
        </section>
      );
    }

    case "countdown": {
      if (!p.endsAt) return null;
      return (
        <Countdown endsAt={p.endsAt} title={p.title} brand={brand} accent={accent} />
      );
    }

    case "newsletter":
      return (
        <NewsletterForm
          storeId={store.id}
          title={p.title}
          text={p.text}
          buttonLabel={p.buttonLabel}
          brand={brand}
        />
      );

    default:
      return null;
  }
}

function ProductCard({
  product,
  store,
  theme,
  brand,
  accent,
}: {
  product: StoreData["products"][number];
  store: StoreData;
  theme: ReturnType<typeof getTheme>;
  brand: string;
  accent: string;
}) {
  const price = product.variants[0] ? Number(product.variants[0].price) : null;
  const order = waLink(
    store.whatsapp,
    `Hi ${store.name}, I'd like to order: ${product.title}`,
  );
  const head = "";
  return (
    <TiltCard
      max={6}
      className={`group overflow-hidden border border-black/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl ${theme.radius}`}
    >
      <div className="aspect-square w-full overflow-hidden">
        <div
          className="h-full w-full transition duration-500 group-hover:scale-105"
          style={{
            background: product.images[0]
              ? `center/cover no-repeat url(${product.images[0].url})`
              : `linear-gradient(135deg, ${brand}, ${accent})`,
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
            style={{ background: accent }}
          >
            {store.currency}
          </span>
          <span className="flex items-center gap-1 text-sm font-bold" style={{ color: accent }}>
            <Star size={14} fill="currentColor" /> New
          </span>
        </div>
        <h3 className={`mt-3 text-lg font-bold ${head}`}>{product.title}</h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-[#5d6561]">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            {price !== null ? `${store.currency} ${price.toLocaleString()}` : "—"}
          </span>
          {order ? (
            <a
              href={order}
              className="rounded-lg px-3.5 py-2 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: brand }}
            >
              Order
            </a>
          ) : (
            <span
              className="rounded-lg px-3.5 py-2 text-sm font-bold text-white"
              style={{ background: brand }}
            >
              Order
            </span>
          )}
        </div>
      </div>
    </TiltCard>
  );
}
