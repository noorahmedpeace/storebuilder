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

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode failed"));
    img.src = src;
  });
}

/** Downscale + compress an uploaded image so the draft stays small enough for
 *  sessionStorage and the published layout JSON doesn't balloon. */
async function fileToCompressedDataUrl(file: File, maxDim = 1100, quality = 0.82): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  try {
    const img = await loadImage(dataUrl);
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const cx = canvas.getContext("2d");
    if (!cx) return dataUrl;
    cx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return dataUrl;
  }
}

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
  const [advanced, setAdvanced] = useState(false);
  const [showAddPalette, setShowAddPalette] = useState(false);
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

  // Tap a photo slot in the preview -> pick a file -> show instantly (data URL),
  // then swap in the hosted URL if the server upload succeeds.
  function pickImageFor(i: number, key: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const dataUrl = await fileToCompressedDataUrl(file);
      setProp(i, key, dataUrl);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/uploads", { method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          if (url) setProp(i, key, url);
        }
      } catch {
        /* keep the data URL */
      }
    };
    input.click();
  }

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Instant local preview (also the fallback on serverless hosts where the
      // filesystem write fails), then swap in the hosted URL if upload works.
      const dataUrl = await fileToCompressedDataUrl(file, 400, 0.85);
      setLogoUrl(dataUrl);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/uploads", { method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          if (url) setLogoUrl(url);
        }
      } catch {
        /* keep the data URL preview */
      }
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
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Draft too big for sessionStorage (large images). Drop inline data-URL
      // images so publishing still works; merchant can re-add photos after signup.
      try {
        const slimLayout = sections.map((s) => ({
          ...s,
          props: Object.fromEntries(
            Object.entries(s.props).filter(
              ([, v]) => !(typeof v === "string" && v.startsWith("data:")),
            ),
          ),
        }));
        const slimLogo = logoUrl.startsWith("data:") ? "" : logoUrl;
        sessionStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ ...draft, logoUrl: slimLogo, layout: slimLayout }),
        );
      } catch {
        /* give up on persisting the draft; still navigate */
      }
    }
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

      <div className="mx-auto grid max-w-7xl items-start gap-6 px-5 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Build your store</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Ek template chuno, basics badlo, aur publish karo. Bas teen step.
            </p>
          </div>

          {/* Step 1 — template */}
          <TemplatesTab activeKey={templateKey} onPick={applyTemplate} />

          {/* Step 2 — basics */}
          <EssentialsCard
            {...{ storeName, setStoreName, tagline, setTagline, logoUrl, onLogo,
              uploading, brandColor, setBrandColor, accentColor, setAccentColor }}
          />

          {/* Add a section — easy, in the main flow */}
          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <button
              onClick={() => setShowAddPalette((v) => !v)}
              className="flex w-full items-center justify-between text-sm font-semibold text-zinc-700"
            >
              <span>➕ Add a section</span>
              {showAddPalette ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showAddPalette ? (
              <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {ADDABLE_SECTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => add(t)}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-left text-xs font-semibold transition hover:border-[#143c3a]"
                  >
                    <Plus size={13} className="shrink-0" />
                    <span className="min-w-0 truncate">{SECTION_LABELS[t]}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Advanced — reorder / hide / remove sections */}
          <div>
            <button
              onClick={() => setAdvanced((a) => !a)}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300"
            >
              <span>⚙️ Customize (advanced) — fonts, theme &amp; sections</span>
              {advanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {advanced ? (
              <div className="mt-3 space-y-3">
                <StyleCard
                  {...{ businessType, setBusinessType, themeKey, pickTheme, fontKey, setFontKey }}
                />
                <SectionsTab
                  sections={sections}
                  onMove={move}
                  onToggle={toggle}
                  onRemove={remove}
                  onAdd={add}
                  onSetProp={setProp}
                />
              </div>
            ) : null}
          </div>

          <button
            onClick={publish}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a]"
          >
            Publish my store <ArrowRight size={18} />
          </button>
        </div>

        {/* Live preview (sticky so it stays in view while editing) */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <p className="mb-2 text-xs font-medium text-zinc-500">
            <span className="uppercase tracking-wider text-zinc-400">Live preview</span>
            <span className="ml-2 rounded-full bg-[#143c3a]/10 px-2 py-0.5 font-semibold text-[#143c3a]">✎ Tap any text or photo to edit</span>
          </p>
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
              {sections.map((s, index) => {
                if (!s.visible) return null;
                const isNew = s.id === lastAddedId;
                const ed: Editor = {
                  set: (key, value) => setProp(index, key, value),
                  pick: (key) => pickImageFor(index, key),
                };
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
                    <PreviewSection section={s} ctx={ctx} ed={ed} />
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

/* ---------------- Essentials (always visible, simple) ---------------- */
function EssentialsCard(p: {
  storeName: string; setStoreName: (v: string) => void;
  tagline: string; setTagline: (v: string) => void;
  logoUrl: string; onLogo: (e: React.ChangeEvent<HTMLInputElement>) => void; uploading: boolean;
  brandColor: string; setBrandColor: (v: string) => void;
  accentColor: string; setAccentColor: (v: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-700">Your basics</p>
      <TextField label="Store name" value={p.storeName} onChange={p.setStoreName} placeholder="Ali Electronics" />
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
      <div className="flex flex-wrap gap-4">
        <ColorField label="Brand color" value={p.brandColor} onChange={p.setBrandColor} />
        <ColorField label="Accent color" value={p.accentColor} onChange={p.setAccentColor} />
      </div>
    </div>
  );
}

/* ---------------- Style (advanced: business type, theme, font) ---------------- */
function StyleCard(p: {
  businessType: string; setBusinessType: (v: string) => void;
  themeKey: string; pickTheme: (k: string) => void;
  fontKey: string; setFontKey: (v: string) => void;
}) {
  return (
    <>
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <TextField label="Business type" value={p.businessType} onChange={p.setBusinessType} placeholder="Electronics, Grocery, Perfume..." />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-zinc-700">Theme (colour preset)</p>
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

/* ---------------- Auto-rotating slideshow (builder preview) ---------------- */
function SliderPreview({
  imgs,
  brand,
  accent,
  caption,
}: {
  imgs: string[];
  brand: string;
  accent: string;
  caption?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % imgs.length), 2500);
    return () => clearInterval(id);
  }, [imgs.length]);

  if (!imgs.length) {
    return (
      <div
        className="grid aspect-[3/1] w-full place-items-center"
        style={{ background: `linear-gradient(135deg, ${brand}, ${accent})` }}
      >
        <span className="rounded-full bg-black/35 px-3 py-1 text-xs font-bold text-white">
          📷 Add slideshow photos
        </span>
      </div>
    );
  }

  const cur = i % imgs.length;
  return (
    <div className="relative aspect-[3/1] w-full overflow-hidden">
      {imgs.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: idx === cur ? 1 : 0, background: `center/cover no-repeat url(${src})` }}
        />
      ))}
      {caption ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-sm font-bold text-white">
          {caption}
        </div>
      ) : null}
      {imgs.length > 1 ? (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {imgs.map((_, idx) => (
            <span
              key={idx}
              className="size-1.5 rounded-full"
              style={{ background: idx === cur ? "#fff" : "rgba(255,255,255,0.5)" }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Tap-to-edit text, in place. Uses contentEditable so the typography stays
 *  exactly as rendered. Saves on blur; external value changes are synced in
 *  only while the node isn't being edited. */
function EditableText({
  value,
  placeholder,
  onSave,
  area = false,
  className = "",
}: {
  value: string;
  placeholder?: string;
  onSave: (v: string) => void;
  area?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (el.textContent !== value) el.textContent = value;
  }, [value]);

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-ph={placeholder}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (!area && e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
      onBlur={(e) => {
        const t = e.currentTarget.textContent || "";
        if (t !== value) onSave(t);
      }}
      className={`cursor-text rounded outline-none ring-1 ring-transparent hover:bg-yellow-200/40 focus:bg-yellow-100/80 focus:text-zinc-900 focus:ring-[#143c3a] empty:before:opacity-40 empty:before:content-[attr(data-ph)] ${className}`}
    />
  );
}

/** An image area in the builder preview: shows the photo, or a clear
 *  "add a photo here" placeholder. Clickable when `onPick` is given. */
function MediaBox({
  src,
  brand,
  accent,
  className = "",
  label = "📷 Photo",
  onPick,
}: {
  src?: string;
  brand: string;
  accent: string;
  className?: string;
  label?: string;
  onPick?: () => void;
}) {
  const inner = src ? (
    <div className={`relative ${className}`} style={{ background: `center/cover no-repeat url(${src})` }}>
      {onPick ? (
        <span className="absolute right-1 top-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white">✎ Change</span>
      ) : null}
    </div>
  ) : (
    <div className={`grid place-items-center ${className}`} style={{ background: `linear-gradient(135deg, ${brand}, ${accent})` }}>
      <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white">{label}</span>
    </div>
  );
  if (!onPick) return inner;
  return (
    <button type="button" onClick={onPick} className="block w-full text-left" title="Click to add / change photo">
      {inner}
    </button>
  );
}

type Editor = { set: (key: string, value: string) => void; pick: (key: string) => void };

/** Dashed "+ Add ..." button shown inside editable sections. */
function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 w-full rounded-lg border border-dashed border-[#143c3a]/40 py-1.5 text-xs font-bold text-[#143c3a] transition hover:bg-[#143c3a]/5"
    >
      {label}
    </button>
  );
}

/* ---------------- Preview section renderer ---------------- */
function PreviewSection({ section, ctx, ed }: { section: Section; ctx: Ctx; ed?: Editor }) {
  const p = section.props ?? {};
  // text helper: editable when `ed` is present, plain text otherwise
  const T = (key: string, current: string, placeholder: string, area = false, className = "") =>
    ed ? (
      <EditableText value={current} placeholder={placeholder} area={area} className={className} onSave={(v) => ed.set(key, v)} />
    ) : (
      <>{current || placeholder}</>
    );
  // edit one "a | b | c" part of a prop, preserving the others
  const setPart = (key: string, raw: string, idx: number, v: string) => {
    const parts = raw.split("|").map((s) => s.trim());
    while (parts.length <= idx) parts.push("");
    parts[idx] = v;
    ed?.set(key, parts.join(" | "));
  };
  // how many items to show in a repeatable list (deals, gallery, faq…)
  const listCount = (def: number, has: (i: number) => boolean) => {
    let n = Math.max(def, Number(p._count) || 0);
    for (let i = 1; i <= 24; i++) if (has(i)) n = Math.max(n, i);
    return Math.min(n, 24);
  };
  const addItem = (count: number) => ed?.set("_count", String(count + 1));

  switch (section.type) {
    case "announcement":
      return <div className="px-4 py-1.5 text-center text-xs font-semibold text-white" style={{ background: ctx.brand }}>{T("text", p.text || "", `Welcome to ${ctx.name}`)}</div>;
    case "hero":
      return (
        <div className="px-6 py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: ctx.accent }}>{ctx.businessType || "Online store"}</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight">{T("heading", p.heading || "", ctx.tagline || `Welcome to ${ctx.name}`)}</h2>
          <p className="mt-2 text-sm text-[#555]">{T("subheading", p.subheading || "", "Add a subheading", true)}</p>
        </div>
      );
    case "products": {
      const count = listCount(0, (i) => !!(p[`pr${i}`] || p[`pr${i}img`]));
      const showSamples = count === 0;
      return (
        <div className="px-6 pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-lg font-bold">{T("title", p.title || "", "Products")}</p>
            {showSamples ? (
              <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#555]">Sample — add yours</span>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {showSamples
              ? previewProducts.map((product) => (
                  <div key={product.name} className={`overflow-hidden border border-black/10 bg-white shadow-sm ${ctx.radius}`}>
                    <div className="aspect-square w-full overflow-hidden bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-bold">{product.name}</p>
                      <p className="text-xs">{product.price}</p>
                    </div>
                  </div>
                ))
              : Array.from({ length: count }, (_, k) => k + 1).map((i) => {
                  const raw = p[`pr${i}`] || "";
                  const name = (raw.split("|")[0] || "").trim();
                  const price = (raw.split("|")[1] || "").trim();
                  return (
                    <div key={i} className={`overflow-hidden border border-black/10 bg-white shadow-sm ${ctx.radius}`}>
                      <MediaBox src={p[`pr${i}img`] || undefined} brand={ctx.brand} accent={ctx.accent} className="aspect-square" onPick={ed ? () => ed.pick(`pr${i}img`) : undefined} />
                      <div className="p-2">
                        <p className="truncate text-xs font-bold">{ed ? <EditableText value={name} placeholder="Product name" onSave={(v) => setPart(`pr${i}`, raw, 0, v)} /> : name}</p>
                        <p className="text-xs">{ed ? <EditableText value={price} placeholder="Price" onSave={(v) => setPart(`pr${i}`, raw, 1, v)} /> : price}</p>
                      </div>
                    </div>
                  );
                })}
          </div>
          {ed ? <AddBtn onClick={() => addItem(count)} label="+ Add product" /> : null}
        </div>
      );
    }
    case "richText":
      return (
        <div className="px-6 py-8 text-center">
          <h3 className="text-2xl font-bold">{T("heading", p.heading || "", "Heading")}</h3>
          <p className="mt-2 text-sm text-[#555]">{T("body", p.body || "", "Add some text", true)}</p>
        </div>
      );
    case "banner":
      return <div className="px-6 py-6 text-center text-lg font-bold text-white" style={{ background: ctx.accent }}>{T("text", p.text || "", "Special offer")}</div>;
    case "features": {
      const items = (p.items || "Fast delivery, Cash on delivery, Easy returns").split(",").map((s) => s.trim()).filter(Boolean);
      return (
        <div className="px-6 py-6">
          <p className="mb-3 font-bold">{T("title", p.title || "", "Why shop with us")}</p>
          <div className="grid grid-cols-2 gap-2">
            {items.slice(0, 4).map((it, i) => (
              <div key={i} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold">✓ {ed ? <EditableText value={it} placeholder="Perk" onSave={(v) => { const arr = [...items]; arr[i] = v; ed.set("items", arr.join(", ")); }} /> : it}</div>
            ))}
          </div>
        </div>
      );
    }
    case "reviews": {
      const defaults = ["Ayesha — Great quality!", "Bilal — Fast delivery", "Sara — Loved it!"];
      const count = listCount(2, (i) => !!p[`r${i}`]);
      return (
        <div className="px-6 py-6">
          <p className="mb-3 font-bold">{T("title", p.title || "", "What customers say")}</p>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: count }, (_, k) => k + 1).map((i) => (
              <div key={i} className="rounded-lg border border-black/10 bg-white p-3">
                <div className="flex gap-0.5" style={{ color: ctx.accent }}>{[0,1,2,3,4].map((s) => <Star key={s} size={11} fill="currentColor" />)}</div>
                <p className="mt-1 text-xs text-[#555]">{T(`r${i}`, p[`r${i}`] || "", defaults[i - 1] || "Name — quote", true)}</p>
              </div>
            ))}
          </div>
          {ed ? <AddBtn onClick={() => addItem(count)} label="+ Add review" /> : null}
        </div>
      );
    }
    case "faq": {
      const count = listCount(2, (i) => !!p[`q${i}`]);
      return (
        <div className="px-6 py-6">
          <p className="mb-2 font-bold">{T("title", p.title || "", "FAQ")}</p>
          {Array.from({ length: count }, (_, k) => k + 1).map((i) => {
            const raw = p[`q${i}`] || "";
            const q = (raw.split("|")[0] || "").trim();
            return (
              <div key={i} className="border-b border-black/10 py-2 text-sm font-semibold">
                {ed ? <EditableText value={q} placeholder="Add a question" onSave={(v) => setPart(`q${i}`, raw || " | ", 0, v)} /> : q}
              </div>
            );
          })}
          {ed ? <AddBtn onClick={() => addItem(count)} label="+ Add question" /> : null}
        </div>
      );
    }
    case "whatsapp":
      return <div className="px-6 py-6 text-center"><span className="inline-block rounded-lg px-5 py-2.5 text-sm font-bold text-white" style={{ background: ctx.brand }}>{T("text", p.text || "", "Order on WhatsApp")}</span></div>;
    case "imageBanner":
      return (
        <div className="relative flex min-h-32 items-center justify-center px-6 py-8 text-center text-white"
          style={{ background: p.imageUrl ? `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)), center/cover url(${p.imageUrl})` : `linear-gradient(135deg, ${ctx.brand}, ${ctx.accent})` }}>
          <p className="text-xl font-bold">{T("heading", p.heading || "", "Banner heading")}</p>
          {ed ? <button type="button" onClick={() => ed.pick("imageUrl")} className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold">{p.imageUrl ? "✎ Change photo" : "📷 Add background photo"}</button> : null}
        </div>
      );
    case "countdown":
      return <div className="px-6 py-6 text-center"><p className="font-bold">{T("title", p.title || "", "Sale ends soon")}</p><div className="mt-2 flex justify-center gap-2">{["00","12","45","30"].map((n,i) => <span key={i} className="rounded px-2 py-1 text-sm font-bold text-white" style={{ background: i===0?ctx.brand:ctx.accent }}>{n}</span>)}</div></div>;
    case "video":
      return <div className="px-6 py-6"><div className="aspect-video w-full rounded-lg bg-black/80 grid place-items-center text-white text-sm">▶ {T("title", p.title || "", "Video")}</div></div>;
    case "newsletter":
      return <div className="px-6 py-6 text-center"><p className="font-bold">{T("title", p.title || "", "Get 10% off")}</p><div className="mx-auto mt-2 flex max-w-xs gap-1"><span className="h-9 flex-1 rounded-lg border border-black/15 bg-white" /><span className="rounded-lg px-3 text-xs font-bold text-white grid place-items-center" style={{ background: ctx.brand }}>Join</span></div></div>;
    case "slider": {
      const imgs = [p.image1, p.image2, p.image3].filter(Boolean) as string[];
      if (!ed) return <SliderPreview imgs={imgs} brand={ctx.brand} accent={ctx.accent} caption={p.caption} />;
      return (
        <div>
          <SliderPreview imgs={imgs} brand={ctx.brand} accent={ctx.accent} caption={p.caption} />
          <div className="grid grid-cols-3 gap-2 p-3">
            {["image1","image2","image3"].map((k) => (
              <MediaBox key={k} src={p[k] || undefined} brand={ctx.brand} accent={ctx.accent} className="aspect-video rounded" label="📷 Slide" onPick={() => ed.pick(k)} />
            ))}
          </div>
          <p className="px-3 pb-3 text-center text-xs text-[#555]">{T("caption", p.caption || "", "Slide caption (optional)")}</p>
        </div>
      );
    }
    case "gallery": {
      const count = listCount(6, (i) => !!p[`g${i}`]);
      return (
        <div className="px-6 py-6">
          <p className="mb-2 font-bold">{T("title", p.title || "", "Photo gallery")}</p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: count }, (_, k) => k + 1).map((i) => (
              <MediaBox key={i} src={p[`g${i}`] || undefined} brand={ctx.brand} accent={ctx.accent} className="aspect-square rounded" onPick={ed ? () => ed.pick(`g${i}`) : undefined} />
            ))}
          </div>
          {ed ? <AddBtn onClick={() => addItem(count)} label="+ Add photo" /> : null}
        </div>
      );
    }
    case "deals": {
      const count = listCount(3, (i) => !!(p[`d${i}`] || p[`d${i}img`]));
      return (
        <div className="px-6 py-6">
          <p className="mb-2 font-bold">{T("title", p.title || "", "Deals")}</p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: count }, (_, k) => k + 1).map((i) => {
              const nameKey = `d${i}`;
              const imgKey = `d${i}img`;
              const raw = p[nameKey] || "";
              const name = (raw.split("|")[0] || "").trim();
              const price = (raw.split("|")[1] || "").trim();
              return (
                <div key={i} className="overflow-hidden rounded border border-black/10 bg-white">
                  <MediaBox src={p[imgKey] || undefined} brand={ctx.brand} accent={ctx.accent} className="aspect-[4/3]" onPick={ed ? () => ed.pick(imgKey) : undefined} />
                  <div className="p-1.5 text-[10px] font-bold">{ed ? <EditableText value={name} placeholder="Name" onSave={(v) => setPart(nameKey, raw, 0, v)} /> : name}</div>
                  <div className="px-1.5 pb-1.5 text-[10px] text-[#555]">{ed ? <EditableText value={price} placeholder="Price" onSave={(v) => setPart(nameKey, raw, 1, v)} /> : price}</div>
                </div>
              );
            })}
          </div>
          {ed ? <AddBtn onClick={() => addItem(count)} label="+ Add deal" /> : null}
        </div>
      );
    }
    case "menuList": {
      const raw = p.items || "Zinger Burger | 650\nFamily Deal | 1800";
      const allRows = raw.split("\n").filter(Boolean);
      const rows = allRows;
      const setCell = (rowIdx: number, partIdx: number, v: string) => {
        const next = [...allRows];
        const parts = (next[rowIdx] || "").split("|").map((s) => s.trim());
        while (parts.length <= partIdx) parts.push("");
        parts[partIdx] = v;
        next[rowIdx] = parts.join(" | ");
        ed?.set("items", next.join("\n"));
      };
      return (
        <div className="px-6 py-6">
          <p className="mb-2 font-bold">{T("title", p.title || "", "Menu")}</p>
          {rows.map((l, i) => {
            const a = l.split("|");
            const name = (a[0] || "").trim();
            const price = (a[1] || "").trim();
            return (
              <div key={i} className="flex justify-between border-b border-black/10 py-1.5 text-sm">
                <span className="font-semibold">{ed ? <EditableText value={name} placeholder="Item" onSave={(v) => setCell(i, 0, v)} /> : name}</span>
                <span className="font-mono font-bold" style={{ color: ctx.brand }}>{ed ? <EditableText value={price} placeholder="0" onSave={(v) => setCell(i, 1, v)} /> : price}</span>
              </div>
            );
          })}
          {ed ? <AddBtn onClick={() => ed.set("items", `${raw}\nNew item | 0`)} label="+ Add menu item" /> : null}
        </div>
      );
    }
    case "steps": {
      const defaults = ["Browse", "Order", "Receive", "Enjoy"];
      const count = listCount(3, (i) => !!p[`s${i}`]);
      return (
        <div className="px-6 py-6">
          <p className="mb-2 font-bold">{T("title", p.title || "", "How it works")}</p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: count }, (_, k) => k + 1).map((i) => (
              <div key={i} className="rounded border border-black/10 bg-white p-2 text-center">
                <span className="mx-auto grid size-6 place-items-center rounded-full text-xs font-bold text-white" style={{ background: ctx.brand }}>{i}</span>
                <p className="mt-1 text-[11px] font-semibold">{T(`s${i}`, p[`s${i}`] || "", defaults[i - 1] || "Step")}</p>
              </div>
            ))}
          </div>
          {ed ? <AddBtn onClick={() => addItem(count)} label="+ Add step" /> : null}
        </div>
      );
    }
    case "stats": {
      const keys = ["n1","n2","n3","n4"];
      const defaults = [["50+","Branches"],["1M+","Orders"],["4.9","Rating"],["24/7","Support"]];
      return (
        <div className="px-6 py-6 text-white" style={{ background: ctx.brand }}>
          <div className="grid grid-cols-4 gap-2 text-center">
            {keys.map((k, i) => {
              const raw = p[k] || "";
              const val = (raw.split("|")[0] || "").trim() || defaults[i][0];
              const label = (raw.split("|")[1] || "").trim() || defaults[i][1];
              return (
                <div key={i}>
                  <p className="text-xl font-bold">{ed ? <EditableText value={val} placeholder="0" onSave={(v) => setPart(k, raw || " | ", 0, v)} /> : val}</p>
                  <p className="text-[10px] opacity-80">{ed ? <EditableText value={label} placeholder="Label" onSave={(v) => setPart(k, raw || " | ", 1, v)} /> : label}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    case "imageText": {
      const right = (p.side || "").toLowerCase() === "right";
      return (
        <div className="px-6 py-6">
          <div className={`grid grid-cols-2 items-center gap-3 ${right ? "[&>*:first-child]:order-2" : ""}`}>
            <MediaBox src={p.image || undefined} brand={ctx.brand} accent={ctx.accent} className="aspect-[4/3] rounded" onPick={ed ? () => ed.pick("image") : undefined} />
            <div>
              <p className="font-bold">{T("heading", p.heading || "", "Heading")}</p>
              <p className="mt-1 text-xs text-[#555]">{T("body", p.body || "", "Description text", true)}</p>
            </div>
          </div>
        </div>
      );
    }
    case "cta":
      return (
        <div className="relative px-6 py-8 text-center text-white" style={{ background: p.bgImage ? `linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),center/cover url(${p.bgImage})` : ctx.brand }}>
          <p className="text-xl font-bold">{T("heading", p.heading || "", "Call to action")}</p>
          <p className="mt-1 text-xs opacity-90">{T("subheading", p.subheading || "", "Add a subtext")}</p>
          <span className="mt-2 inline-block rounded bg-white px-3 py-1.5 text-xs font-bold" style={{ color: ctx.brand }}>{T("buttonText", p.buttonText || "", "Shop now")}</span>
          {ed ? <button type="button" onClick={() => ed.pick("bgImage")} className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold">{p.bgImage ? "✎ Change photo" : "📷 Add background photo"}</button> : null}
        </div>
      );
    case "contactBar":
      return (
        <div className="px-6 py-2.5 text-center text-xs font-semibold text-white" style={{ background: ctx.brand }}>
          📞 {T("phone", p.phone || "", "021-111-666-111")}   📍 {T("address", p.address || "", "Your address")}
        </div>
      );
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
