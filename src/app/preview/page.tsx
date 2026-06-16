"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTheme } from "@/lib/themes";
import { getFont } from "@/lib/fonts";
import { normalizeLayout, type Section } from "@/lib/sections";
import { STARTER_TEMPLATES } from "@/lib/templates";
import { PreviewSection, type Ctx } from "@/app/create/page";

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

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* preview toolbar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-white/90 px-4 py-2 backdrop-blur">
        <Link href="/create" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900">
          <ArrowLeft size={15} /> Back to editor
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Preview</span>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#143c3a] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0f2c2a]"
        >
          Publish <ArrowRight size={15} />
        </Link>
      </div>

      {/* the store, full width */}
      <div className="mx-auto max-w-3xl shadow-xl">
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
              <PreviewSection key={s.id} section={s} ctx={ctx} />
            ))}
          <div className="px-6 py-8 text-center text-xs text-[#8a8a8a]">
            © {name} · Powered by StoreBuilder
          </div>
        </div>
      </div>
    </div>
  );
}
