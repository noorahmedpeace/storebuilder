"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ExternalLink,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import {
  ADDABLE_SECTIONS,
  SECTION_FIELDS,
  SECTION_LABELS,
  type Section,
  type SectionType,
} from "@/lib/sections";

let counter = 0;
function newId() {
  counter += 1;
  return `s-${Date.now()}-${counter}`;
}

export function SectionBuilder({
  initial,
  slug,
  saveAction,
}: {
  initial: Section[];
  slug: string;
  saveAction: (layout: Section[]) => Promise<{ ok: boolean }>;
}) {
  const [sections, setSections] = useState<Section[]>(initial);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function dirty() {
    setSaved(false);
  }

  function move(from: number, to: number) {
    if (from === to) return;
    setSections((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    dirty();
  }

  function toggle(i: number) {
    setSections((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, visible: !s.visible } : s)),
    );
    dirty();
  }

  function remove(i: number) {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
    dirty();
  }

  function addSection(type: SectionType) {
    setSections((prev) => [
      ...prev,
      { id: newId(), type, visible: true, props: {} },
    ]);
    dirty();
  }

  function setProp(i: number, key: string, value: string) {
    setSections((prev) =>
      prev.map((s, idx) =>
        idx === i ? { ...s, props: { ...s.props, [key]: value } } : s,
      ),
    );
    dirty();
  }

  function save() {
    startTransition(async () => {
      await saveAction(sections);
      setSaved(true);
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Storefront sections</h2>
          <Link
            href={`/store/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-[#143c3a]"
          >
            View store <ExternalLink size={14} />
          </Link>
        </div>
        <p className="mb-4 text-sm text-zinc-500">
          Drag the handle to reorder. Toggle the eye to show/hide a section on
          your live storefront.
        </p>

        <div className="space-y-2">
          {sections.map((section, i) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) move(dragIndex, i);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`rounded-lg border bg-zinc-50 p-3 transition ${
                dragIndex === i ? "border-[#143c3a] opacity-60" : "border-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="cursor-grab text-[#9aa19d]" title="Drag to reorder">
                  <GripVertical size={18} />
                </span>
                <span className="flex-1 font-bold">
                  {SECTION_LABELS[section.type]}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  title={section.visible ? "Hide" : "Show"}
                  className="grid size-8 place-items-center rounded-lg border border-zinc-300 bg-white"
                >
                  {section.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  title="Remove"
                  className="grid size-8 place-items-center rounded-lg border border-[#a23b3b]/40 text-[#a23b3b]"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {SECTION_FIELDS[section.type] ? (
                <div className="mt-3 grid gap-2 pl-7">
                  {SECTION_FIELDS[section.type]!.map((field) => (
                    <input
                      key={field.key}
                      value={section.props[field.key] ?? ""}
                      onChange={(e) => setProp(i, field.key, e.target.value)}
                      placeholder={field.label}
                      className="h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-900"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {sections.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
              No sections. Add one from the right.
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-bold">Add section</h3>
          <div className="grid gap-2">
            {ADDABLE_SECTIONS.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addSection(type)}
                className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-left text-sm font-semibold transition hover:border-[#143c3a]"
              >
                <Plus size={15} /> {SECTION_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="h-11 w-full rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a] disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save & publish"}
          </button>
          {saved ? (
            <p className="mt-2 text-center text-sm font-semibold text-[#4d8b70]">
              Saved to your live storefront.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
