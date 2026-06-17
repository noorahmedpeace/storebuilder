import {
  Accessibility,
  Box,
  Boxes,
  Code2,
  Gauge,
  Layers3,
  MousePointer2,
  Search,
  UploadCloud,
} from "lucide-react";
import { PageShell, Panel } from "@/components/app-shell";
import {
  assetPipeline,
  builderModes,
  immersiveChecklist,
  immersiveRoadmap,
  immersiveScenes,
} from "@/lib/platform-data";

const stack = [
  "Next.js",
  "React Three Fiber",
  "Three.js",
  "GSAP ScrollTrigger",
  "drei helpers",
  "TransformControls",
  "glTF/GLB",
  "CDN assets",
];

export default function ImmersiveBuilderPage() {
  return (
    <PageShell
      eyebrow="Immersive 3D Builder"
      title="A SEO-safe 3D homepage and drag-and-drop 3D store builder."
      description="The Executive Summary's 3D strategy is now mapped into StoreBuilder: rich WebGL scenes for brand impact, SSR text for SEO, accessible fallbacks, optimized assets, and a builder data model that can publish storefront scenes."
    >
      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel title="3D homepage experience" action="SEO-safe">
          <div className="space-y-3">
            {immersiveScenes.map((scene) => (
              <div
                key={scene.title}
                className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-white text-[#143c3a]">
                    <Box size={18} />
                  </span>
                  <h2 className="font-bold">{scene.title}</h2>
                </div>
                <p className="mt-3 leading-7 text-[#5d6561]">{scene.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="rounded-lg border border-black/10 bg-[#102321] p-5 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9fcfc0]">
                Scene graph preview
              </p>
              <h2 className="mt-2 text-3xl font-bold">Store scene editor</h2>
            </div>
            <MousePointer2 className="text-[#f3b74f]" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#071512]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/immersive-builder-scene.png"
                alt="3D store scene editor preview"
                className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#071512]/10 via-transparent to-[#071512]/72" />
              <div className="absolute inset-x-5 bottom-5 rounded-lg border border-white/10 bg-black/36 p-4 backdrop-blur">
                <p className="font-mono text-xs text-white/60">scene.json</p>
                <p className="mt-2 text-sm text-white/80">
                  pages to objects to animations to publish bundle
                </p>
              </div>
            </div>

            <aside className="space-y-3">
              {builderModes.map((item) => (
                <div key={item.mode} className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <p className="font-bold text-[#f3b74f]">{item.mode}</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {item.detail}
                  </p>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Asset pipeline" action="Performance first">
          <div className="grid gap-3 sm:grid-cols-2">
            {assetPipeline.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-black/10 bg-[#f7f4ee] p-4"
              >
                <UploadCloud className="text-[#143c3a]" size={18} />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Tech stack" action="Controlled WebGL">
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-black/10 bg-[#f7f4ee] px-3 py-2 text-sm font-bold text-[#143c3a]"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["WYSIWYG", Layers3],
              ["Scene JSON", Code2],
              ["Assets", Boxes],
            ].map(([label, Icon]) => (
              <div key={label as string} className="rounded-lg border border-black/10 p-4">
                <Icon className="text-[#143c3a]" size={18} />
                <p className="mt-3 font-bold">{label as string}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="SEO, accessibility, and performance checklist" action="Launch gates">
          <div className="space-y-3">
            {immersiveChecklist.map((item, index) => (
              <div
                key={item}
                className="grid gap-3 rounded-lg border border-black/10 bg-[#f7f4ee] p-4 md:grid-cols-[44px_1fr]"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-[#143c3a] font-mono font-bold text-white">
                  {index + 1}
                </span>
                <span className="leading-7 text-[#4f5b58]">{item}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Implementation roadmap" action="Medium-high effort">
          <div className="space-y-3">
            {immersiveRoadmap.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-black/10 p-4">
                {item.includes("SEO") ? (
                  <Search className="text-[#143c3a]" size={18} />
                ) : item.includes("Performance") ? (
                  <Gauge className="text-[#143c3a]" size={18} />
                ) : item.includes("audit") ? (
                  <Accessibility className="text-[#143c3a]" size={18} />
                ) : (
                  <Layers3 className="text-[#143c3a]" size={18} />
                )}
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </PageShell>
  );
}
