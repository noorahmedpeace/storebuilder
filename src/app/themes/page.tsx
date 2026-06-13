import { LayoutGrid, Palette, SlidersHorizontal, Type } from "lucide-react";
import { PageShell, Panel } from "@/components/app-shell";
import { themes } from "@/lib/platform-data";

const builderBlocks = [
  "Announcement bar",
  "Hero banner",
  "Product carousel",
  "Collection grid",
  "Reviews",
  "Trust badges",
  "WhatsApp CTA",
  "FAQ section",
];

export default function ThemesPage() {
  return (
    <PageShell
      eyebrow="Theme Engine"
      title="Code-free storefront themes with settings, sections, and layouts."
      description="Merchants can switch between retail, grocery, electronics, perfume, fashion, luxury, gift, and wholesale storefronts without code modifications."
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Theme controls" action="No code">
          <div className="space-y-3">
            {[
              ["Color controls", "Brand palettes, buttons, links, banners", Palette],
              ["Typography controls", "Headings, body, product cards", Type],
              ["Section builder", "Drag and drop storefront blocks", LayoutGrid],
              ["Layout builder", "Header, footer, product layout rules", SlidersHorizontal],
            ].map(([title, text, Icon]) => (
              <div key={title as string} className="flex items-center gap-3 rounded-lg border border-black/10 bg-[#f7f4ee] p-4">
                <span className="grid size-10 place-items-center rounded-lg bg-white text-[#143c3a]">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-bold">{title as string}</p>
                  <p className="text-sm text-[#68716d]">{text as string}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Theme marketplace" action="Starter library">
          <div className="grid gap-4 md:grid-cols-2">
            {themes.map((theme, index) => (
              <article key={theme.name} className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4">
                <div
                  className={[
                    "aspect-[5/3] rounded-lg",
                    index % 3 === 0
                      ? "bg-[linear-gradient(135deg,#143c3a,#d6a747)]"
                      : index % 3 === 1
                        ? "bg-[linear-gradient(135deg,#e7ece2,#50a678)]"
                        : "bg-[linear-gradient(135deg,#fbfaf5,#c17f7c)]",
                  ].join(" ")}
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{theme.name}</h3>
                    <p className="text-sm text-[#68716d]">{theme.category}</p>
                  </div>
                  <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold">
                    {theme.premium ? "Premium" : "Free"}
                  </span>
                </div>
                <p className="mt-3 font-mono text-sm text-[#143c3a]">{theme.installs} installs</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Section builder blocks" action="Dynamic sections">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {builderBlocks.map((block) => (
              <div key={block} className="rounded-lg border border-black/10 bg-white p-4 font-semibold">
                {block}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
