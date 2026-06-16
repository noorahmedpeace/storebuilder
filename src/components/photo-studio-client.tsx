"use client";

import { useCallback, useRef, useState } from "react";
import { Download, ImageOff, Loader2, Sparkles, Upload, X } from "lucide-react";

type Ratio = "1:1" | "4:5" | "16:9" | "9:16";
type Format = "png" | "jpg" | "webp";

const RATIOS: { key: Ratio; label: string; w: number; h: number }[] = [
  { key: "1:1", label: "Square 1:1", w: 1080, h: 1080 },
  { key: "4:5", label: "Portrait 4:5", w: 1080, h: 1350 },
  { key: "16:9", label: "Wide 16:9", w: 1920, h: 1080 },
  { key: "9:16", label: "Story 9:16", w: 1080, h: 1920 },
];

const MIME: Record<Format, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
};

type Item = {
  id: string;
  name: string;
  original: string; // data URI
  status: "idle" | "processing" | "done" | "error";
  cutout?: string; // data URI (transparent)
  error?: string;
};

let idCounter = 0;
const nextId = () => `img-${Date.now()}-${idCounter++}`;

function fileToDataUri(file: File): Promise<string> {
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

/** Compose the cutout onto a framed canvas of the given aspect ratio. */
async function exportVariant(
  cutout: string,
  ratio: Ratio,
  transparent: boolean,
  bgColor: string,
  format: Format,
): Promise<string> {
  const spec = RATIOS.find((r) => r.key === ratio)!;
  const img = await loadImage(cutout);
  const canvas = document.createElement("canvas");
  canvas.width = spec.w;
  canvas.height = spec.h;
  const ctx = canvas.getContext("2d")!;

  // JPG has no alpha — always paint a background for it.
  if (!transparent || format === "jpg") {
    ctx.fillStyle = transparent ? "#ffffff" : bgColor;
    ctx.fillRect(0, 0, spec.w, spec.h);
  }

  const pad = 0.08;
  const maxW = spec.w * (1 - pad * 2);
  const maxH = spec.h * (1 - pad * 2);
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (spec.w - dw) / 2, (spec.h - dh) / 2, dw, dh);

  return canvas.toDataURL(MIME[format], 0.92);
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function PhotoStudioClient({ configured }: { configured: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<Format>("png");
  const [transparent, setTransparent] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const added: Item[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const original = await fileToDataUri(file);
      added.push({
        id: nextId(),
        name: file.name.replace(/\.[^.]+$/, ""),
        original,
        status: "idle",
      });
    }
    setItems((prev) => [...prev, ...added]);
  }, []);

  async function processOne(item: Item) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "processing", error: undefined } : i)),
    );
    try {
      const res = await fetch("/api/ai/photo-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUri: item.original }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "done", cutout: json.url } : i,
        ),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Processing failed";
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: message } : i)),
      );
    }
  }

  async function processAll() {
    if (busy) return;
    setBusy(true);
    try {
      // sequential — keeps provider load sane and ordering predictable
      const queue = items.filter((i) => i.status === "idle" || i.status === "error");
      for (const item of queue) {
        await processOne(item);
      }
    } finally {
      setBusy(false);
    }
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function downloadVariant(item: Item, ratio: Ratio) {
    if (!item.cutout) return;
    const dataUrl = await exportVariant(item.cutout, ratio, transparent, bgColor, format);
    triggerDownload(dataUrl, `${item.name}-${ratio.replace(":", "x")}.${format}`);
  }

  async function downloadAll(item: Item) {
    for (const r of RATIOS) {
      await downloadVariant(item, r.key);
    }
  }

  const pending = items.some((i) => i.status === "idle" || i.status === "error");

  return (
    <div className="space-y-5">
      {!configured ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-bold">Photo Studio is not connected yet.</p>
          <p className="mt-1">
            Background removal runs on an image-AI provider. Add a{" "}
            <code className="rounded bg-amber-100 px-1">FAL_KEY</code> environment
            variable (from{" "}
            <a href="https://fal.ai" target="_blank" rel="noopener noreferrer" className="underline">
              fal.ai
            </a>
            ) and restart, then this page goes live. You can still queue images now.
          </p>
        </div>
      ) : null}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold transition hover:border-[#143c3a]"
        >
          <Upload size={15} /> Upload images
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            void onFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-zinc-600">Format</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="rounded-lg border border-zinc-300 bg-zinc-50 px-2 py-1.5"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WEBP</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={transparent}
            onChange={(e) => setTransparent(e.target.checked)}
          />
          <span className="font-semibold text-zinc-600">Transparent</span>
        </label>

        {!transparent ? (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border border-zinc-300"
            />
            <span className="font-semibold text-zinc-600">Background</span>
          </label>
        ) : null}

        <button
          onClick={processAll}
          disabled={!pending || busy}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#143c3a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2b29] disabled:opacity-50"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Make Professional Product Photos
        </button>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <ImageOff size={28} className="text-zinc-300" />
          <p className="mt-2 text-sm font-semibold text-zinc-500">
            Upload product images to get started
          </p>
          <p className="text-xs text-zinc-400">
            Mobile snaps work — the AI cuts out the background and frames it for you.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="truncate text-sm font-bold">{item.name}</span>
                <StatusBadge status={item.status} />
                <button
                  onClick={() => remove(item.id)}
                  className="ml-auto grid size-7 place-items-center rounded border border-zinc-200 text-zinc-400 hover:text-zinc-700"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>

              {item.status === "error" ? (
                <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {item.error}
                </p>
              ) : null}

              <div className="mt-3 grid gap-4 sm:grid-cols-[180px_1fr]">
                {/* Original */}
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                    Original
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.original}
                    alt="original"
                    className="aspect-square w-full rounded-lg border border-zinc-200 object-cover"
                  />
                </div>

                {/* Variations */}
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                    Studio variations
                  </p>
                  {item.status === "done" && item.cutout ? (
                    <>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {RATIOS.map((r) => (
                          <button
                            key={r.key}
                            onClick={() => void downloadVariant(item, r.key)}
                            title={`Download ${r.label}`}
                            className="group overflow-hidden rounded-lg border border-zinc-200 text-left transition hover:border-[#143c3a]"
                          >
                            <div
                              className="grid place-items-center"
                              style={{
                                aspectRatio: `${r.w} / ${r.h}`,
                                background: transparent
                                  ? "repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 0 / 16px 16px"
                                  : bgColor,
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.cutout}
                                alt={r.label}
                                className="max-h-[84%] max-w-[84%] object-contain"
                              />
                            </div>
                            <span className="flex items-center justify-between gap-1 px-2 py-1 text-[10px] font-semibold text-zinc-600">
                              {r.key}
                              <Download size={11} className="text-zinc-400 group-hover:text-[#143c3a]" />
                            </span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => void downloadAll(item)}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold transition hover:border-[#143c3a]"
                      >
                        <Download size={13} /> Download all ({format.toUpperCase()})
                      </button>
                    </>
                  ) : item.status === "processing" ? (
                    <div className="grid h-24 place-items-center rounded-lg bg-zinc-50 text-sm text-zinc-500">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 size={15} className="animate-spin" /> Removing background…
                      </span>
                    </div>
                  ) : (
                    <div className="grid h-24 place-items-center rounded-lg bg-zinc-50 text-xs text-zinc-400">
                      Click “Make Professional Product Photos” to process.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Item["status"] }) {
  const map: Record<Item["status"], { label: string; cls: string }> = {
    idle: { label: "Queued", cls: "bg-zinc-100 text-zinc-600" },
    processing: { label: "Processing", cls: "bg-blue-100 text-blue-700" },
    done: { label: "Ready", cls: "bg-green-100 text-green-700" },
    error: { label: "Failed", cls: "bg-red-100 text-red-700" },
  };
  const s = map[status];
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  );
}
