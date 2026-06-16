"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
} from "lucide-react";
import { THEMES, getTheme } from "@/lib/themes";
import { FONTS, getFont } from "@/lib/fonts";
import {
  ADDABLE_SECTIONS,
  DEFAULT_LAYOUT,
  SECTION_FIELDS,
  SECTION_LABELS,
  type Section,
  type SectionType,
} from "@/lib/sections";
import { SectionFieldInput } from "@/components/storefront/section-field-input";
import { STARTER_TEMPLATES, type StarterTemplate } from "@/lib/templates";

const DRAFT_KEY = "storebuilder_draft";

let counter = 0;
const newId = () => `s-${Date.now()}-${counter++}`;

const previewProducts = [
  {
    name: "Aura Headphones",
    price: "Rs 8,900",
    image: "/media/preview-products/headphones.png?v=2",
  },
  {
    name: "Luna Handbag",
    price: "Rs 14,500",
    image: "/media/preview-products/handbag.png?v=2",
  },
  {
    name: "Noir Perfume",
    price: "Rs 6,200",
    image: "/media/preview-products/perfume.png?v=2",
  },
];

type Ctx = {
  name: string;
  businessType: string;
  tagline: string;
  brand: string;
  accent: string;
  radius: string;
};

export default function CreatePage() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [themeKey, setThemeKey] = useState(THEMES[0].key);
  const [brandColor, setBrandColor] = useState(THEMES[0].brandColor);
  const [accentColor, setAccentColor] = useState(THEMES[0].accentColor);
  const [tagline, setTagline] = useState("");
  const [fontKey, setFontKey] = useState<string>(THEMES[0].defaultFont);
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sections, setSections] = useState<Section[]>(DEFAULT_LAYOUT);
  const [templateKey, setTemplateKey] = useState<string>("");
  const [tab, setTab] = useState<"templates" | "design" | "sections">("templates");
  const previewRef = useRef<HTMLDivElement>(null);
  const [scrollTick, setScrollTick] = useState(0);
  const [lastAddedId, setLastAddedId] = useState<string>("");

  // When a section is added, scroll the live preview to it so the change is visible.
  useEffect(() => {
    if (scrollTick === 0) return;
    const el = previewRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [scrollTick]);

  // The "just added" highlight fades on its own after a moment.
  useEffect(() => {
    if (!lastAddedId) return;
    const t = setTimeout(() => setLastAddedId(""), 2600);
    return () => clearTimeout(t);
  }, [lastAddedId]);

  const theme = useMemo(() => getTheme(themeKey), [themeKey]);
  const font = useMemo(() => getFont(fontKey), [fontKey]);
  const name = storeName.trim() || "Your Store";
  const logoText = name.slice(0, 2).toUpperCase();

  function pickTheme(key: string) {
    const t = getTheme(key);
    setThemeKey(t.key);
    setBrandColor(t.brandColor);
    setAccentColor(t.accentColor);
    setFontKey(t.defaultFont);
  }

  function applyTemplate(t: StarterTemplate) {
    setTemplateKey(t.key);
    setThemeKey(t.themeKey);
    setBrandColor(t.brandColor);
    setAccentColor(t.accentColor);
    setFontKey(t.fontKey);
    if (!businessType.trim()) setBusinessType(t.businessType);
    if (!tagline.trim()) setTagline(t.tagline);
    // deep-clone so later edits don't mutate the shared template constant
    setSections(t.layout.map((sec) => ({ ...sec, props: { ...sec.props } })));
    setTab("design");
  }

  // --- section ops ---
  const move = (i: number, d: -1 | 1) =>
    setSections((prev) => {
      const next = [...prev];
      const j = i + d;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const toggle = (i: number) =>
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, visible: !s.visible } : s)));
  const remove = (i: number) => setSections((prev) => prev.filter((_, idx) => idx !== i));
  const add = (type: SectionType) => {
    const id = newId();
    setSections((prev) => [...prev, { id, type, visible: true, props: {} }]);
    setLastAddedId(id);
    setScrollTick((n) => n + 1);
  };
  const setProp = (i: number, key: string, value: string) =>
    setSections((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, props: { ...s.props, [key]: value } } : s)),
    );

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (res.ok) setLogoUrl((await res.json()).url);
    } finally {
      setUploading(false);
    }
  }

  function publish() {
    const draft = {
      storeName: storeName.trim() || "My Store",
      businessType: businessType.trim(),
      themeKey,
      brandColor,
      accentColor,
      tagline: tagline.trim(),
      logoText,
      fontKey,
      logoUrl,
      templateKey,
      layout: sections,
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    router.push("/signup");
  }

  const ctx: Ctx = { name, businessType, tagline, brand: brandColor, accent: accentColor, radius: theme.radius };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-[#143c3a] text-white">
            <ShoppingBag size={16} />
          </span>
          <span className="font-bold">StoreBuilder</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-zinc-500 sm:inline">
            Build first — sign up only when you publish.
          </span>
          <Link href="/login" className="font-semibold text-[#143c3a]">Sign in</Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Build your store</h1>
            <p className="mt-1 text-sm text-zinc-500">Design the look and lay out your page. Live preview on the right.</p>
          </div>

          <div className="flex gap-2 rounded-lg border border-zinc-200 bg-white p-1">
            {(["templates", "design", "sections"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
                  tab === t ? "bg-[#143c3a] text-white" : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {t === "design" ? "Design" : t === "sections" ? "Page sections" : "Templates"}
              </button>
            ))}
          </div>

          {tab === "templates" ? (
            <TemplatesTab activeKey={templateKey} onPick={applyTemplate} />
          ) : tab === "design" ? (
            <DesignTab
              {...{ storeName, setStoreName, businessType, setBusinessType, tagline, setTagline,
                logoUrl, onLogo, uploading, themeKey, pickTheme, brandColor, setBrandColor,
                accentColor, setAccentColor, fontKey, setFontKey }}
            />
          ) : (
            <SectionsTab
              sections={sections}
              onMove={move}
              onToggle={toggle}
              onRemove={remove}
              onAdd={add}
              onSetProp={setProp}
            />
          )}

          <button
            onClick={publish}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a]"
          >
            Publish my store <ArrowRight size={18} />
          </button>
        </div>

        {/* Live preview */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">Live preview</p>
          <div
            className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm"
            style={{ fontFamily: font.css, background: theme.bg }}
          >
            <div className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="logo" className="size-8 rounded-lg object-cover" />
                ) : (
                  <span className="grid size-8 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: brandColor }}>
                    {logoText}
                  </span>
                )}
                <span className="font-bold">{name}</span>
              </div>
              <span className="rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ background: brandColor }}>Cart</span>
            </div>
            <div ref={previewRef} className="max-h-[70vh] overflow-y-auto scroll-smooth">
              {sections.filter((s) => s.visible).map((s) => {
                const isNew = s.id === lastAddedId;
                return (
                  <div
                    key={s.id}
                    className={`relative transition-all duration-500 ${
                      isNew ? "z-10 ring-4 ring-inset ring-[#143c3a]" : ""
                    }`}
                  >
                    {isNew ? (
                      <span className="pointer-events-none absolute right-2 top-2 z-20 animate-bounce rounded-full bg-[#143c3a] px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                        ✓ {SECTION_LABELS[s.type]} added
                      </span>
                    ) : null}
                    <PreviewSection section={s} ctx={ctx} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Design tab ---------------- */
function DesignTab(p: {
  storeName: string; setStoreName: (v: string) => void;
  businessType: string; setBusinessType: (v: string) => void;
  tagline: string; setTagline: (v: string) => void;
  logoUrl: string; onLogo: (e: React.ChangeEvent<HTMLInputElement>) => void; uploading: boolean;
  themeKey: string; pickTheme: (k: string) => void;
  brandColor: string; setBrandColor: (v: string) => void;
  accentColor: string; setAccentColor: (v: string) => void;
  fontKey: string; setFontKey: (v: string) => void;
}) {
  return (
    <>
      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
        <TextField label="Store name" value={p.storeName} onChange={p.setStoreName} placeholder="Ali Electronics" />
        <TextField label="Business type" value={p.businessType} onChange={p.setBusinessType} placeholder="Electronics, Grocery, Perfume..." />
        <TextField label="Tagline" value={p.tagline} onChange={p.setTagline} placeholder="Best deals in town" />
        <div>
          <span className="text-sm font-semibold text-zinc-600">Logo (optional)</span>
          <div className="mt-1 flex items-center gap-3">
            {p.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logoUrl} alt="logo" className="size-10 rounded-lg border border-zinc-200 object-cover" />
            ) : null}
            <input type="file" accept="image/*" onChange={p.onLogo}
              className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#143c3a] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
          </div>
          {p.uploading ? <p className="mt-1 text-xs text-zinc-500">Uploading…</p> : null}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-zinc-700">Theme</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {THEMES.map((t) => (
            <button key={t.key} onClick={() => p.pickTheme(t.key)}
              className={`rounded-lg border p-2 text-center text-xs font-semibold transition ${
                p.themeKey === t.key ? "border-[#143c3a] ring-1 ring-[#143c3a]" : "border-zinc-200 hover:border-zinc-300"
              }`}>
              <span className="mb-1.5 block h-7 w-full rounded" style={{ background: `linear-gradient(135deg, ${t.brandColor}, ${t.accentColor})` }} />
              {t.name}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          <ColorField label="Brand color" value={p.brandColor} onChange={p.setBrandColor} />
          <ColorField label="Accent color" value={p.accentColor} onChange={p.setAccentColor} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-zinc-700">Font</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FONTS.map((f) => (
            <button key={f.key} onClick={() => p.setFontKey(f.key)}
              className={`rounded-lg border p-2 text-left transition ${
                p.fontKey === f.key ? "border-[#143c3a] ring-1 ring-[#143c3a]" : "border-zinc-200 hover:border-zinc-300"
              }`}>
              <span className="block text-base font-bold" style={{ fontFamily: f.css }}>{f.label}</span>
              <span className="text-[11px] text-zinc-500">{f.category}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- Sections tab ---------------- */
function SectionsTab({
  sections, onMove, onToggle, onRemove, onAdd, onSetProp,
}: {
  sections: Section[];
  onMove: (i: number, d: -1 | 1) => void;
  onToggle: (i: number) => void;
  onRemove: (i: number) => void;
  onAdd: (t: SectionType) => void;
  onSetProp: (i: number, key: string, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-3">
        <p className="mb-2 text-sm font-semibold text-zinc-700">Your page sections</p>
        <div className="space-y-1.5">
          {sections.map((s, i) => (
            <div key={s.id} className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2">
              <div className="flex items-center gap-1">
                <span className="min-w-0 flex-1 truncate text-sm font-bold">{SECTION_LABELS[s.type]}</span>
                <button onClick={() => onMove(i, -1)} className="grid size-7 shrink-0 place-items-center rounded border border-zinc-200 bg-white" title="Up"><ChevronUp size={14} /></button>
                <button onClick={() => onMove(i, 1)} className="grid size-7 shrink-0 place-items-center rounded border border-zinc-200 bg-white" title="Down"><ChevronDown size={14} /></button>
                <button onClick={() => onToggle(i)} className="grid size-7 shrink-0 place-items-center rounded border border-zinc-200 bg-white" title={s.visible ? "Hide" : "Show"}>{s.visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                <button onClick={() => onRemove(i)} className="grid size-7 shrink-0 place-items-center rounded border border-[#a23b3b]/40 text-[#a23b3b]" title="Remove"><Trash2 size={14} /></button>
              </div>
              {SECTION_FIELDS[s.type] ? (
                <div className="mt-2 grid gap-1.5">
                  {SECTION_FIELDS[s.type]!.map((f) => (
                    <SectionFieldInput
                      key={f.key}
                      field={f}
                      value={s.props[f.key] ?? ""}
                      onChange={(v) => onSetProp(i, f.key, v)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-3">
        <p className="mb-2 text-sm font-semibold text-zinc-700">Add a section</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {ADDABLE_SECTIONS.map((t) => (
            <button key={t} onClick={() => onAdd(t)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-left text-xs font-semibold transition hover:border-[#143c3a]">
              <Plus size={13} className="shrink-0" />
              <span className="min-w-0 truncate">{SECTION_LABELS[t]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Templates tab ---------------- */
function TemplatesTab({
  activeKey,
  onPick,
}: {
  activeKey: string;
  onPick: (t: StarterTemplate) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-700">Start from a template</p>
      <p className="mt-1 text-xs text-zinc-500">
        Pick a ready-made store — colours, fonts and a full homepage are filled in.
        You can change everything afterwards.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {STARTER_TEMPLATES.map((t) => {
          const active = activeKey === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onPick(t)}
              className={`group rounded-xl border p-4 text-left transition ${
                active
                  ? "border-[#143c3a] ring-1 ring-[#143c3a]"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <span
                className="flex h-20 w-full items-center justify-center rounded-lg text-3xl"
                style={{
                  background: `linear-gradient(135deg, ${t.brandColor}, ${t.accentColor})`,
                }}
              >
                {t.emoji}
              </span>
              <p className="mt-3 text-sm font-bold">{t.name}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{t.description}</p>
              <span className="mt-2 inline-block text-xs font-semibold text-[#143c3a]">
                {active ? "✓ Applied" : "Use this template →"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Preview section renderer ---------------- */
function PreviewSection({ section, ctx }: { section: Section; ctx: Ctx }) {
  const p = section.props ?? {};
  switch (section.type) {
    case "announcement":
      return <div className="px-4 py-1.5 text-center text-xs font-semibold text-white" style={{ background: ctx.brand }}>{p.text || `Welcome to ${ctx.name}`}</div>;
    case "hero":
      return (
        <div className="px-6 py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: ctx.accent }}>{ctx.businessType || "Online store"}</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight">{p.heading || ctx.tagline || `Welcome to ${ctx.name}`}</h2>
          {p.subheading ? <p className="mt-2 text-sm text-[#555]">{p.subheading}</p> : null}
        </div>
      );
    case "products":
      return (
        <div className="px-6 pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-lg font-bold">{p.title || "Products"}</p>
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#555]">
              Sample photos
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {previewProducts.map((product) => (
              <div
                key={product.name}
                className={`overflow-hidden border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${ctx.radius}`}
              >
                <div className="aspect-square w-full overflow-hidden bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-bold">{product.name}</p>
                  <p className="text-xs">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "richText":
      return (
        <div className="px-6 py-8 text-center">
          {p.heading ? <h3 className="text-2xl font-bold">{p.heading}</h3> : null}
          {p.body ? <p className="mt-2 text-sm text-[#555]">{p.body}</p> : null}
        </div>
      );
    case "banner":
      return <div className="px-6 py-6 text-center text-lg font-bold text-white" style={{ background: ctx.accent }}>{p.text || "Special offer"}</div>;
    case "features": {
      const items = (p.items || "Fast delivery, Cash on delivery, Easy returns").split(",").map((s) => s.trim()).filter(Boolean);
      return (
        <div className="px-6 py-6">
          {p.title ? <p className="mb-3 font-bold">{p.title}</p> : null}
          <div className="grid grid-cols-2 gap-2">
            {items.slice(0, 4).map((it) => (
              <div key={it} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold">✓ {it}</div>
            ))}
          </div>
        </div>
      );
    }
    case "reviews":
      return (
        <div className="px-6 py-6">
          <p className="mb-3 font-bold">{p.title || "What customers say"}</p>
          <div className="grid grid-cols-2 gap-2">
            {[p.r1 || "Ayesha — Great quality!", p.r2 || "Bilal — Fast delivery"].map((r, i) => (
              <div key={i} className="rounded-lg border border-black/10 bg-white p-3">
                <div className="flex gap-0.5" style={{ color: ctx.accent }}>{[0,1,2,3,4].map((s) => <Star key={s} size={11} fill="currentColor" />)}</div>
                <p className="mt-1 text-xs text-[#555]">{r}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "faq":
      return (
        <div className="px-6 py-6">
          <p className="mb-2 font-bold">{p.title || "FAQ"}</p>
          {[p.q1 || "Do you deliver? | Yes", p.q2].filter(Boolean).map((q, i) => (
            <div key={i} className="border-b border-black/10 py-2 text-sm font-semibold">{(q || "").split("|")[0]}</div>
          ))}
        </div>
      );
    case "whatsapp":
      return <div className="px-6 py-6 text-center"><span className="inline-block rounded-lg px-5 py-2.5 text-sm font-bold text-white" style={{ background: ctx.brand }}>{p.text || "Order on WhatsApp"}</span></div>;
    case "imageBanner":
      return (
        <div className="flex min-h-32 items-center justify-center px-6 py-8 text-center text-white"
          style={{ background: p.imageUrl ? `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)), center/cover url(${p.imageUrl})` : `linear-gradient(135deg, ${ctx.brand}, ${ctx.accent})` }}>
          <p className="text-xl font-bold">{p.heading || "Banner heading"}</p>
        </div>
      );
    case "countdown":
      return <div className="px-6 py-6 text-center"><p className="font-bold">{p.title || "Sale ends soon"}</p><div className="mt-2 flex justify-center gap-2">{["00","12","45","30"].map((n,i) => <span key={i} className="rounded px-2 py-1 text-sm font-bold text-white" style={{ background: i===0?ctx.brand:ctx.accent }}>{n}</span>)}</div></div>;
    case "video":
      return <div className="px-6 py-6"><div className="aspect-video w-full rounded-lg bg-black/80 grid place-items-center text-white text-sm">▶ {p.title || "Video"}</div></div>;
    case "newsletter":
      return <div className="px-6 py-6 text-center"><p className="font-bold">{p.title || "Get 10% off"}</p><div className="mx-auto mt-2 flex max-w-xs gap-1"><span className="h-9 flex-1 rounded-lg border border-black/15 bg-white" /><span className="rounded-lg px-3 text-xs font-bold text-white grid place-items-center" style={{ background: ctx.brand }}>Join</span></div></div>;
    case "slider": {
      const imgs = [p.image1, p.image2, p.image3].filter(Boolean);
      return <div className="aspect-[3/1] w-full" style={{ background: imgs[0] ? `center/cover no-repeat url(${imgs[0]})` : `linear-gradient(135deg, ${ctx.brand}, ${ctx.accent})` }} />;
    }
    case "gallery": {
      const imgs = ["g1","g2","g3","g4","g5","g6"].map((k) => p[k]).filter(Boolean);
      return <div className="px-6 py-6"><div className="grid grid-cols-3 gap-2">{(imgs.length ? imgs : [0,1,2,3,4,5]).slice(0,6).map((src,i) => <div key={i} className="aspect-square rounded" style={{ background: typeof src === "string" ? `center/cover url(${src})` : `linear-gradient(135deg, ${ctx.brand}, ${ctx.accent})` }} />)}</div></div>;
    }
    case "deals":
      return <div className="px-6 py-6"><p className="mb-2 font-bold">{p.title || "Deals"}</p><div className="grid grid-cols-3 gap-2">{[p.d1img,p.d2img,p.d3img].map((src,i) => <div key={i} className="overflow-hidden rounded border border-black/10 bg-white"><div className="aspect-[4/3]" style={{ background: src ? `center/cover url(${src})` : `linear-gradient(135deg,${ctx.brand},${ctx.accent})` }} /><div className="p-1.5 text-[10px] font-bold">{([p.d1,p.d2,p.d3][i]||"Deal").split("|")[0]}</div></div>)}</div></div>;
    case "menuList": {
      const rows = (p.items || "Zinger Burger | 650\nFamily Deal | 1800").split("\n").filter(Boolean).slice(0,4);
      return <div className="px-6 py-6"><p className="mb-2 font-bold">{p.title || "Menu"}</p>{rows.map((l,i) => { const a=l.split("|"); return <div key={i} className="flex justify-between border-b border-black/10 py-1.5 text-sm"><span className="font-semibold">{a[0]?.trim()}</span><span className="font-mono font-bold" style={{ color: ctx.brand }}>{a[1]?.trim()}</span></div>; })}</div>;
    }
    case "steps": {
      const steps = [p.s1,p.s2,p.s3].filter(Boolean);
      return <div className="px-6 py-6"><p className="mb-2 font-bold">{p.title || "How it works"}</p><div className="grid grid-cols-3 gap-2">{(steps.length?steps:["Browse","Order","Receive"]).map((s,i) => <div key={i} className="rounded border border-black/10 bg-white p-2 text-center"><span className="mx-auto grid size-6 place-items-center rounded-full text-xs font-bold text-white" style={{ background: ctx.brand }}>{i+1}</span><p className="mt-1 text-[11px] font-semibold">{s}</p></div>)}</div></div>;
    }
    case "stats": {
      const stats = [p.n1,p.n2,p.n3,p.n4].filter(Boolean).map((n)=>(n||"").split("|"));
      return <div className="px-6 py-6 text-white" style={{ background: ctx.brand }}><div className="grid grid-cols-4 gap-2 text-center">{(stats.length?stats:[["50+","Branches"],["1M+","Orders"],["4.9","Rating"],["24/7","Support"]]).map((st,i)=><div key={i}><p className="text-xl font-bold">{st[0]}</p><p className="text-[10px] opacity-80">{st[1]}</p></div>)}</div></div>;
    }
    case "imageText": {
      const right = (p.side||"").toLowerCase()==="right";
      return <div className="px-6 py-6"><div className={`grid grid-cols-2 items-center gap-3 ${right?"[&>*:first-child]:order-2":""}`}><div className="aspect-[4/3] rounded" style={{ background: p.image ? `center/cover url(${p.image})` : `linear-gradient(135deg,${ctx.brand},${ctx.accent})` }} /><div><p className="font-bold">{p.heading||"Heading"}</p><p className="mt-1 text-xs text-[#555]">{p.body||"Description text"}</p></div></div></div>;
    }
    case "cta":
      return <div className="px-6 py-8 text-center text-white" style={{ background: p.bgImage ? `linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),center/cover url(${p.bgImage})` : ctx.brand }}><p className="text-xl font-bold">{p.heading||"Call to action"}</p><span className="mt-2 inline-block rounded bg-white px-3 py-1.5 text-xs font-bold" style={{ color: ctx.brand }}>{p.buttonText||"Shop now"}</span></div>;
    case "contactBar":
      return <div className="px-6 py-2.5 text-center text-xs font-semibold text-white" style={{ background: ctx.brand }}>{[p.phone&&`📞 ${p.phone}`, p.address&&`📍 ${p.address}`].filter(Boolean).join("   ") || "📞 021-111-666-111   📍 Your address"}</div>;
    default:
      return null;
  }
}

/* ---------------- field helpers ---------------- */
function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-600">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-zinc-900" />
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-zinc-300" />
      <span className="text-sm font-semibold text-zinc-600">{label}</span>
    </label>
  );
}
