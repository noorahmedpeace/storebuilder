import Link from "next/link";
import { Check, MessageCircle, Search, ShoppingBag, ShoppingCart, Star } from "lucide-react";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { AddToCart } from "./add-to-cart";
import { StoreJsonLd } from "./json-ld";
import { Carousel } from "./carousel";
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

/** Loose match for search / category clicks: matches if any meaningful word of
 *  the query (singularised) appears in the text. Handles plural category names. */
function matchesQuery(text: string, query: string): boolean {
  const tokens = query
    .toLowerCase()
    .split(/[\s,&]+/)
    .map((w) => w.replace(/s$/, ""))
    .filter((w) => w.length > 2);
  if (!tokens.length) return true;
  const t = text.toLowerCase();
  return tokens.some((tok) => t.includes(tok));
}

export function Storefront({
  store,
  cartCount = 0,
  query = "",
}: {
  store: StoreData;
  cartCount?: number;
  query?: string;
}) {
  const theme = getTheme(store.themeKey);
  const brand = store.brandColor || theme.brandColor;
  const accent = store.accentColor || theme.accentColor;
  const sections = normalizeLayout(store.layout).filter((s) => s.visible);
  const font = getFont(store.fontKey ?? theme.defaultFont);
  const hasProducts = store.products.length > 0;

  return (
    <main
      className="min-h-screen text-[#171717]"
      style={{ background: theme.bg, fontFamily: font.css }}
    >
      <StoreJsonLd name={store.name} description={store.tagline} logoUrl={store.logoUrl} />
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
          <div className="flex items-center gap-2">
            {waLink(store.whatsapp, `Hi ${store.name}, I'd like to order.`) ? (
              <a
                href={waLink(store.whatsapp, `Hi ${store.name}, I'd like to order.`)!}
                className="hidden h-10 items-center gap-2 rounded-lg border border-black/10 bg-white px-4 text-sm font-bold sm:inline-flex"
                style={{ color: brand }}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            ) : null}
            <Link
              href={`/store/${store.slug}/cart`}
              className="relative inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold text-white"
              style={{ background: brand }}
            >
              <ShoppingCart size={16} /> Cart
              {cartCount > 0 ? (
                <span
                  className="ml-1 grid min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-bold"
                  style={{ color: brand }}
                >
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
        {hasProducts ? (
          <div className="mx-auto max-w-7xl px-5 pb-3 lg:px-8">
            <form action={`/store/${store.slug}`} className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                name="q"
                defaultValue={query}
                placeholder={`Search ${store.name}…`}
                className="h-10 w-full rounded-lg border border-black/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-black/30"
              />
            </form>
          </div>
        ) : null}
      </header>

      {query ? (
        <div className="mx-auto max-w-7xl px-5 pt-4 text-sm lg:px-8">
          <span className="text-[#5d6561]">Showing results for </span>
          <span className="font-bold">“{query}”</span>
          <Link href={`/store/${store.slug}`} className="ml-2 font-semibold underline" style={{ color: brand }}>
            clear
          </Link>
        </div>
      ) : null}

      {sections.map((section) => (
        <Reveal key={section.id}>
          <SectionView
            section={section}
            store={store}
            theme={theme}
            brand={brand}
            accent={accent}
            query={query}
          />
        </Reveal>
      ))}

      <footer className="px-5 py-10 text-white lg:px-8" style={{ background: brand }}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-2xl font-bold">{store.name}</p>
            <p className="mt-2 text-white/70">Powered by StoreBuilder Cloud.</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/85">
            <Link href={`/store/${store.slug}`}>Home</Link>
            <Link href={`/store/${store.slug}/about`}>About</Link>
            <Link href={`/store/${store.slug}/contact`}>Contact</Link>
            <Link href={`/store/${store.slug}/track`}>Track order</Link>
            <Link href={`/store/${store.slug}/cart`}>Cart</Link>
            <Link href={`/store/${store.slug}/policies/privacy`}>Privacy</Link>
            <Link href={`/store/${store.slug}/policies/terms`}>Terms</Link>
          </nav>
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
  query = "",
}: {
  section: Section;
  store: StoreData;
  theme: ReturnType<typeof getTheme>;
  brand: string;
  accent: string;
  query?: string;
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

    case "products": {
      // Builder-added product cards (image + "Name | Price"), shown until the
      // merchant adds real catalog products in the dashboard.
      const manual = Array.from({ length: 24 }, (_, k) => ({
        img: p[`pr${k + 1}img`],
        text: p[`pr${k + 1}`],
      })).filter((d) => d.text || d.img);
      const orderLink = waLink(store.whatsapp, `Hi ${store.name}, I'd like to order.`);
      const visibleProducts = query
        ? store.products.filter((pr) => matchesQuery(`${pr.title} ${pr.description ?? ""}`, query))
        : store.products;
      return (
        <section id="shop" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-16 lg:px-8">
          <h2 className={`mb-7 text-3xl font-bold ${head} ${upper}`}>
            {p.title || "Products"}
          </h2>
          {store.products.length > 0 ? (
            visibleProducts.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-5">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="w-full max-w-xs sm:w-60">
                    <ProductCard
                      product={product}
                      store={store}
                      theme={theme}
                      brand={brand}
                      accent={accent}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-black/15 bg-white/60 p-8 text-center text-[#68716d]">
                <p>No products in “{query}” yet.</p>
                <a href={`/store/${store.slug}`} className="mt-2 inline-block font-semibold underline" style={{ color: brand }}>
                  View all products
                </a>
              </div>
            )
          ) : manual.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-5">
              {manual.map((d, idx) => {
                const [pname, pprice] = (d.text || "").split("|").map((x) => x.trim());
                return (
                  <article key={idx} className={`w-full max-w-xs overflow-hidden border border-black/10 bg-white shadow-sm sm:w-60 ${theme.radius}`}>
                    <div
                      className="aspect-square w-full"
                      style={{ background: d.img ? `center/cover no-repeat url(${d.img})` : `linear-gradient(135deg, ${brand}, ${accent})` }}
                    />
                    <div className="p-4">
                      <p className="font-bold">{pname || "Product"}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        {pprice ? (
                          <span className="font-mono font-bold" style={{ color: brand }}>
                            {store.currency} {pprice}
                          </span>
                        ) : <span />}
                        {orderLink ? (
                          <a href={orderLink} className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ background: brand }}>
                            Order
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-12 text-center">
              <ShoppingBag className="mx-auto" style={{ color: brand }} />
              <p className="mt-3 font-bold">Coming soon</p>
              <p className="mt-1 text-sm text-[#68716d]">
                This store hasn&apos;t published any products yet.
              </p>
            </div>
          )}
        </section>
      );
    }

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
          <div className="flex flex-wrap justify-center gap-4">
            {items.map((item) => (
              <div
                key={item}
                className="flex w-full items-center gap-3 rounded-xl border border-black/10 bg-white p-4 sm:w-64"
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
      const reviews = Array.from({ length: 24 }, (_, k) => p[`r${k + 1}`])
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
          <div className="flex flex-wrap justify-center gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="w-full rounded-xl border border-black/10 bg-white p-5 sm:w-80">
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
      const faqs = Array.from({ length: 24 }, (_, k) => p[`q${k + 1}`])
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

    case "slider":
      return <Carousel images={[p.image1, p.image2, p.image3]} caption={p.caption} />;

    case "gallery": {
      const imgs = Array.from({ length: 24 }, (_, k) => p[`g${k + 1}`]).filter(Boolean);
      if (!imgs.length) return null;
      return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          {p.title ? <h2 className={`mb-6 text-3xl font-bold ${upper}`}>{p.title}</h2> : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {imgs.map((src, idx) => (
              <div
                key={idx}
                className={`aspect-square ${theme.radius}`}
                style={{ background: `center/cover no-repeat url(${src})` }}
              />
            ))}
          </div>
        </section>
      );
    }

    case "deals": {
      const deals = Array.from({ length: 24 }, (_, k) => ({
        img: p[`d${k + 1}img`],
        text: p[`d${k + 1}`],
      })).filter((d) => d.text || d.img);
      if (!deals.length) return null;
      return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className={`mb-6 text-3xl font-bold ${upper}`}>{p.title || "Deals"}</h2>
          <div className="flex flex-wrap justify-center gap-5">
            {deals.map((d, idx) => {
              const [dname, dprice] = (d.text || "").split("|").map((x) => x.trim());
              return (
                <article key={idx} className={`w-full max-w-sm overflow-hidden border border-black/10 bg-white shadow-sm sm:w-80 ${theme.radius}`}>
                  <div
                    className="aspect-[4/3] w-full"
                    style={{ background: d.img ? `center/cover no-repeat url(${d.img})` : `linear-gradient(135deg, ${brand}, ${accent})` }}
                  />
                  <div className="flex items-center justify-between p-4">
                    <span className="font-bold">{dname || "Deal"}</span>
                    {dprice ? (
                      <span className="rounded-lg px-3 py-1 text-sm font-bold text-white" style={{ background: brand }}>
                        {store.currency} {dprice}
                      </span>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      );
    }

    case "menuList": {
      const rows = (p.items || "")
        .split("\n")
        .map((l) => l.split("|").map((x) => x.trim()))
        .filter((parts) => parts[0]);
      if (!rows.length) return null;
      return (
        <section className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
          <h2 className={`mb-6 text-3xl font-bold ${upper}`}>{p.title || "Menu"}</h2>
          <div className="divide-y divide-black/10">
            {rows.map((parts, idx) => (
              <div key={idx} className="flex items-baseline justify-between gap-4 py-3">
                <div>
                  <p className="font-bold">{parts[0]}</p>
                  {parts[2] ? <p className="text-sm text-[#68716d]">{parts[2]}</p> : null}
                </div>
                {parts[1] ? (
                  <span className="whitespace-nowrap font-mono font-bold" style={{ color: brand }}>
                    {store.currency} {parts[1]}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "steps": {
      const steps = Array.from({ length: 24 }, (_, k) => p[`s${k + 1}`]).filter(Boolean);
      if (!steps.length) return null;
      return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className={`mb-6 text-3xl font-bold ${upper}`}>{p.title || "How it works"}</h2>
          <div className="flex flex-wrap justify-center gap-5">
            {steps.map((s, idx) => (
              <div key={idx} className="w-full rounded-xl border border-black/10 bg-white p-5 sm:w-64">
                <span className="grid size-9 place-items-center rounded-full text-sm font-bold text-white" style={{ background: brand }}>
                  {idx + 1}
                </span>
                <p className="mt-3 font-semibold">{s}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "stats": {
      const stats = Array.from({ length: 8 }, (_, k) => p[`n${k + 1}`])
        .filter(Boolean)
        .map((n) => (n || "").split("|").map((x) => x.trim()));
      if (!stats.length) return null;
      return (
        <section className="px-5 py-12 lg:px-8" style={{ background: brand }}>
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-6 text-center text-white">
            {stats.map((st, idx) => (
              <div key={idx} className="w-28">
                <p className="text-3xl font-bold md:text-4xl">{st[0]}</p>
                <p className="mt-1 text-sm text-white/75">{st[1]}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "imageText": {
      if (!p.image && !p.heading) return null;
      const right = (p.side || "").toLowerCase() === "right";
      return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className={`grid items-center gap-8 lg:grid-cols-2 ${right ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div
              className={`aspect-[4/3] w-full ${theme.radius}`}
              style={{ background: p.image ? `center/cover no-repeat url(${p.image})` : `linear-gradient(135deg, ${brand}, ${accent})` }}
            />
            <div>
              {p.heading ? <h2 className={`text-3xl font-bold ${upper}`}>{p.heading}</h2> : null}
              {p.body ? <p className="mt-4 leading-8 text-[#555d59]">{p.body}</p> : null}
            </div>
          </div>
        </section>
      );
    }

    case "cta":
      if (!p.heading) return null;
      return (
        <section
          className="relative px-5 py-16 text-center lg:px-8"
          style={{
            background: p.bgImage
              ? `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), center/cover no-repeat url(${p.bgImage})`
              : brand,
          }}
        >
          <h2 className={`text-3xl font-bold text-white md:text-4xl ${upper}`}>{p.heading}</h2>
          {p.subheading ? <p className="mx-auto mt-3 max-w-xl text-white/85">{p.subheading}</p> : null}
          <a
            href={`/store/${store.slug}`}
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold"
            style={{ color: brand }}
          >
            {p.buttonText || "Shop now"}
          </a>
        </section>
      );

    case "contactBar":
      if (!p.phone && !p.address) return null;
      return (
        <section className="px-5 py-4 text-sm font-semibold text-white lg:px-8" style={{ background: brand }}>
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-1 text-center">
            {p.phone ? <span>📞 {p.phone}</span> : null}
            {p.address ? <span>📍 {p.address}</span> : null}
            {p.hours ? <span>🕒 {p.hours}</span> : null}
          </div>
        </section>
      );

    case "categories": {
      const cats = Array.from({ length: 24 }, (_, k) => ({
        img: p[`c${k + 1}img`],
        name: p[`c${k + 1}`],
      })).filter((c) => c.name || c.img);
      if (!cats.length) return null;
      return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className={`mb-6 text-3xl font-bold ${upper}`}>
            {p.title || "Shop by category"}
          </h2>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-6">
            {cats.map((c, idx) => (
              <a
                key={idx}
                href={c.name ? `/store/${store.slug}?q=${encodeURIComponent(c.name)}#shop` : "#"}
                className="w-24 shrink-0 text-center transition hover:-translate-y-0.5"
              >
                <div
                  className="mx-auto size-20 rounded-full border border-black/10 shadow-sm"
                  style={{ background: c.img ? `center/cover no-repeat url(${c.img})` : `linear-gradient(135deg, ${brand}, ${accent})` }}
                />
                <p className="mt-2 text-xs font-semibold leading-tight">{c.name}</p>
              </a>
            ))}
          </div>
        </section>
      );
    }

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
      <Link
        href={`/store/${store.slug}/product/${product.slug}`}
        className="block aspect-square w-full overflow-hidden"
      >
        <div
          className="h-full w-full transition duration-500 group-hover:scale-105"
          style={{
            background: product.images[0]
              ? `center/cover no-repeat url(${product.images[0].url})`
              : `linear-gradient(135deg, ${brand}, ${accent})`,
          }}
        />
      </Link>
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
        <Link href={`/store/${store.slug}/product/${product.slug}`}>
          <h3 className={`mt-3 text-lg font-bold hover:underline ${head}`}>
            {product.title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-[#5d6561]">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-lg font-bold tracking-tight">
            {price !== null ? `${store.currency} ${price.toLocaleString()}` : "—"}
          </span>
          {product.variants[0] ? (
            <AddToCart
              storeId={store.id}
              slug={store.slug}
              variantId={product.variants[0].id}
              brand={brand}
              label="Add"
            />
          ) : order ? (
            <a
              href={order}
              className="rounded-lg px-3.5 py-2 text-sm font-bold text-white"
              style={{ background: brand }}
            >
              Order
            </a>
          ) : null}
        </div>
      </div>
    </TiltCard>
  );
}
