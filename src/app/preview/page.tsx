"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Monitor, Smartphone, X } from "lucide-react";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { normalizeLayout, type Section } from "@/lib/sections";
import { STARTER_TEMPLATES } from "@/lib/templates";
import { PreviewSection, type Ctx, type PreviewItem } from "@/app/create/page";

const DRAFT_KEY = "storebuilder_draft";

type Draft = {
  storeName?: string;
  businessType?: string;
  tagline?: string;
  brandColor?: string;
  accentColor?: string;
  fontKey?: string;
  logoUrl?: string;
  themeKey?: string;
  layout?: unknown;
};

export default function PreviewPage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [device, setDevice] = useState<"phone" | "desktop" | null>(null);
  const [selected, setSelected] = useState<PreviewItem | null>(null);

  useEffect(() => {
    let d: Draft | null = null;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) d = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(d);
    setLoaded(true);
  }, []);

  // Fall back to the first starter template so the page is never empty.
  const fallback = STARTER_TEMPLATES[0];
  const themeKey = draft?.themeKey || fallback.themeKey;
  const theme = useMemo(() => getTheme(themeKey), [themeKey]);
  const brand = draft?.brandColor || theme.brandColor;
  const accent = draft?.accentColor || theme.accentColor;
  const font = getFont(draft?.fontKey || theme.defaultFont);
  const name = draft?.storeName || fallback.businessType;
  const logoText = name.slice(0, 2).toUpperCase();

  const sections: Section[] = useMemo(
    () => normalizeLayout(draft?.layout ?? fallback.layout),
    [draft, fallback.layout],
  );

  const ctx: Ctx = {
    name,
    businessType: draft?.businessType || fallback.businessType,
    tagline: draft?.tagline || fallback.tagline,
    brand,
    accent,
    radius: theme.radius,
  };

  if (!loaded) {
    return <main className="grid min-h-screen place-items-center bg-zinc-50 text-zinc-400">Loading preview…</main>;
  }

  // Ask once: phone or desktop?
  if (!device) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-100 px-5 text-zinc-900">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Preview {name}</h1>
          <p className="mt-1 text-sm text-zinc-500">How do you want to see your store?</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setDevice("phone")}
              className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 px-4 py-6 font-semibold transition hover:border-[#143c3a] hover:bg-[#143c3a]/5"
            >
              <Smartphone size={28} className="text-[#143c3a]" /> Phone
            </button>
            <button
              onClick={() => setDevice("desktop")}
              className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 px-4 py-6 font-semibold transition hover:border-[#143c3a] hover:bg-[#143c3a]/5"
            >
              <Monitor size={28} className="text-[#143c3a]" /> Desktop
            </button>
          </div>
          <Link href="/create" className="mt-5 inline-block text-sm font-semibold text-zinc-500 hover:underline">
            ← Back to editor
          </Link>
        </div>
      </main>
    );
  }

  const isPhone = device === "phone";

  const storeContent = (
    <div style={{ background: theme.bg, fontFamily: font.css }}>
      <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          {draft?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.logoUrl} alt="logo" className="size-9 rounded-lg object-cover" />
          ) : (
            <span className="grid size-9 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: brand }}>
              {logoText}
            </span>
          )}
          <span className="text-lg font-bold">{name}</span>
        </div>
        <span className="rounded-lg px-4 py-2 text-sm font-bold text-white" style={{ background: brand }}>
          Cart
        </span>
      </div>
      {sections
        .filter((s) => s.visible)
        .map((s) => (
          <PreviewSection key={s.id} section={s} ctx={ctx} onOpenItem={setSelected} />
        ))}
      <div className="px-6 py-8 text-center text-xs text-[#8a8a8a]">
        © {name} · Powered by StoreBuilder
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* preview toolbar */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-black/10 bg-white/90 px-4 py-2 backdrop-blur">
        <Link href="/create" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900">
          <ArrowLeft size={15} /> <span className="hidden sm:inline">Back to editor</span>
        </Link>

        <div className="flex rounded-lg border border-zinc-200 bg-white p-0.5">
          <button
            onClick={() => setDevice("phone")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${isPhone ? "bg-[#143c3a] text-white" : "text-zinc-600"}`}
          >
            <Smartphone size={14} /> Phone
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${!isPhone ? "bg-[#143c3a] text-white" : "text-zinc-600"}`}
          >
            <Monitor size={14} /> Desktop
          </button>
        </div>

        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#143c3a] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0f2c2a]"
        >
          Publish <ArrowRight size={15} />
        </Link>
      </div>

      {/* device frame */}
      {isPhone ? (
        <div className="mx-auto my-6 w-[390px] max-w-[94vw] overflow-hidden rounded-[2.4rem] border-[10px] border-zinc-900 shadow-2xl">
          {storeContent}
        </div>
      ) : (
        <div className="mx-auto my-6 max-w-6xl overflow-hidden rounded-xl border border-zinc-200 shadow-xl">
          {storeContent}
        </div>
      )}

      {/* product detail popup (preview) */}
      {selected ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div
                className="aspect-[4/3] w-full"
                style={{ background: selected.img ? `center/cover no-repeat url(${selected.img})` : `linear-gradient(135deg, ${brand}, ${accent})` }}
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-zinc-700 shadow"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold">{selected.name || "Product"}</h3>
              {selected.price ? (
                <p className="mt-1 font-mono text-lg font-bold" style={{ color: brand }}>
                  Rs {selected.price.replace(/^rs\.?\s*/i, "")}
                </p>
              ) : null}
              {selected.desc ? <p className="mt-3 text-sm leading-6 text-[#555]">{selected.desc}</p> : null}
              <button
                className="mt-5 h-11 w-full rounded-lg font-bold text-white"
                style={{ background: brand }}
                onClick={() => setSelected(null)}
              >
                Add to cart
              </button>
              <p className="mt-2 text-center text-xs text-zinc-400">
                This is a preview. Add-to-cart &amp; checkout work on your published store.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
