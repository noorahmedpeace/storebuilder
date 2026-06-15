"use client";

import { useEffect, useState } from "react";
import { getTheme } from "@/lib/themes";

const DRAFT_KEY = "storebuilder_draft";

type Draft = {
  storeName?: string;
  businessType?: string;
  themeKey?: string;
  brandColor?: string;
  accentColor?: string;
  tagline?: string;
  logoText?: string;
  fontKey?: string;
  logoUrl?: string;
  layout?: unknown;
};

export function DraftFields() {
  // Draft lives in sessionStorage (client only), so it can only be read after
  // mount — a deliberate post-mount state write.
  const [state, setState] = useState<{ loaded: boolean; draft: Draft | null }>({
    loaded: false,
    draft: null,
  });

  useEffect(() => {
    let draft: Draft | null = null;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) draft = JSON.parse(raw) as Draft;
    } catch {
      // ignore malformed draft
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ loaded: true, draft });
  }, []);

  const { loaded, draft } = state;
  if (!loaded) return null;

  if (draft?.storeName) {
    const theme = getTheme(draft.themeKey);
    const brand = draft.brandColor || theme.brandColor;
    const accent = draft.accentColor || theme.accentColor;
    return (
      <>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Publishing
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className="size-6 rounded"
              style={{ background: `linear-gradient(135deg, ${brand}, ${accent})` }}
            />
            <span className="font-semibold text-zinc-900">{draft.storeName}</span>
            <span className="text-sm text-zinc-500">· {theme.name}</span>
          </div>
          <a
            href="/create"
            className="mt-2 inline-block text-xs font-semibold text-[#143c3a]"
          >
            ← Edit design
          </a>
        </div>
        <input type="hidden" name="storeName" defaultValue={draft.storeName} />
        <input type="hidden" name="businessType" defaultValue={draft.businessType ?? ""} />
        <input type="hidden" name="themeKey" defaultValue={draft.themeKey ?? "modern-retail"} />
        <input type="hidden" name="brandColor" defaultValue={draft.brandColor ?? ""} />
        <input type="hidden" name="accentColor" defaultValue={draft.accentColor ?? ""} />
        <input type="hidden" name="tagline" defaultValue={draft.tagline ?? ""} />
        <input type="hidden" name="logoText" defaultValue={draft.logoText ?? ""} />
        <input type="hidden" name="fontKey" defaultValue={draft.fontKey ?? ""} />
        <input type="hidden" name="logoUrl" defaultValue={draft.logoUrl ?? ""} />
        <input
          type="hidden"
          name="layout"
          defaultValue={draft.layout ? JSON.stringify(draft.layout) : ""}
        />
      </>
    );
  }

  // No draft (someone opened /signup directly) — collect the store name here.
  return (
    <>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-600">Store name</span>
        <input
          name="storeName"
          required
          placeholder="Ali Electronics"
          className="mt-1 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-zinc-900"
        />
      </label>
      <input type="hidden" name="themeKey" defaultValue="modern-retail" />
    </>
  );
}
