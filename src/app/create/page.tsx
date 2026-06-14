"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { THEMES, getTheme } from "@/lib/themes";
import { FONTS, getFont } from "@/lib/fonts";

const DRAFT_KEY = "storebuilder_draft";

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

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (res.ok) {
        const json = await res.json();
        setLogoUrl(json.url);
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
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    router.push("/signup");
  }

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
            No account needed yet — build first, sign up to publish.
          </span>
          <Link href="/login" className="font-semibold text-[#143c3a]">
            Sign in
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold">Build your store</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Pick a theme and customize. You&apos;ll only sign up when you
              publish.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
            <Field label="Store name" value={storeName} onChange={setStoreName} placeholder="Ali Electronics" />
            <Field label="Business type" value={businessType} onChange={setBusinessType} placeholder="Electronics, Grocery, Perfume..." />
            <Field label="Tagline" value={tagline} onChange={setTagline} placeholder="Best deals in town" />
            <div>
              <span className="text-sm font-semibold text-zinc-600">Logo (optional)</span>
              <div className="mt-1 flex items-center gap-3">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="logo" className="size-10 rounded-lg border border-zinc-200 object-cover" />
                ) : null}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                  onChange={onLogo}
                  className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#143c3a] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </div>
              {uploading ? <p className="mt-1 text-xs text-zinc-500">Uploading…</p> : null}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-zinc-700">Theme</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {THEMES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => pickTheme(t.key)}
                  className={`rounded-lg border p-2 text-center text-xs font-semibold transition ${
                    themeKey === t.key
                      ? "border-[#143c3a] ring-1 ring-[#143c3a]"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <span
                    className="mb-1.5 block h-7 w-full rounded"
                    style={{ background: `linear-gradient(135deg, ${t.brandColor}, ${t.accentColor})` }}
                  />
                  {t.name}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              <ColorField label="Brand color" value={brandColor} onChange={setBrandColor} />
              <ColorField label="Accent color" value={accentColor} onChange={setAccentColor} />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-zinc-700">Font</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FONTS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFontKey(f.key)}
                  className={`rounded-lg border p-2 text-left transition ${
                    fontKey === f.key
                      ? "border-[#143c3a] ring-1 ring-[#143c3a]"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <span className="block text-base font-bold" style={{ fontFamily: f.css }}>
                    {f.label}
                  </span>
                  <span className="text-[11px] text-zinc-500">{f.category}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={publish}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a]"
          >
            Publish my store <ArrowRight size={18} />
          </button>
        </div>

        {/* Live preview */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Live preview
          </p>
          <div
            className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm"
            style={{ fontFamily: font.css }}
          >
            <div className="px-4 py-1.5 text-center text-xs font-semibold text-white" style={{ background: brandColor }}>
              {tagline.trim() || "Free delivery this week"}
            </div>
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
              <span className="rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ background: brandColor }}>
                Order
              </span>
            </div>
            <div style={{ background: theme.bg }}>
              <div className="px-6 py-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
                  {businessType.trim() || "Online store"}
                </p>
                <h2 className={`mt-2 text-3xl font-bold leading-tight ${theme.uppercase ? "uppercase tracking-wide" : ""}`}>
                  {tagline.trim() || `Welcome to ${name}`}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 px-6 pb-8 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`overflow-hidden border border-black/10 bg-white ${theme.radius}`}>
                    <div className="aspect-square w-full" style={{ background: `linear-gradient(135deg, ${brandColor}, ${accentColor})` }} />
                    <div className="p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: accentColor }}>
                          PKR
                        </span>
                        <Star size={11} style={{ color: accentColor }} fill="currentColor" />
                      </div>
                      <p className="mt-1.5 text-sm font-bold">Product {i}</p>
                      <p className="text-xs font-bold">Rs {(i * 1500).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-zinc-900"
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 cursor-pointer rounded border border-zinc-300"
      />
      <span className="text-sm font-semibold text-zinc-600">{label}</span>
    </label>
  );
}
