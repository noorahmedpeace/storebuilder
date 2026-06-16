"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import type { SectionField } from "@/lib/sections";

/** Renders the right control for a section field: text input, textarea, or an
 *  image uploader (POSTs to /api/uploads and stores the returned URL). */
export function SectionFieldInput({
  field,
  value,
  onChange,
}: {
  field: SectionField;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  if (field.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.label}
        rows={4}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
      />
    );
  }

  if (field.type === "image") {
    async function upload(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/uploads", { method: "POST", body: fd });
        if (res.ok) onChange((await res.json()).url);
      } finally {
        setUploading(false);
      }
    }
    return (
      <div className="flex items-center gap-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-10 shrink-0 rounded-lg border border-zinc-200 object-cover" />
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-dashed border-zinc-300 text-zinc-400">
            <Upload size={15} />
          </span>
        )}
        <label className="flex-1">
          <span className="block text-xs font-medium text-zinc-500">{field.label}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            onChange={upload}
            className="mt-0.5 w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-zinc-900 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
        </label>
        {uploading ? <span className="text-xs text-zinc-500">…</span> : null}
      </div>
    );
  }

  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.label}
      className="h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-900"
    />
  );
}
