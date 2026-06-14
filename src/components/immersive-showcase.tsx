"use client";

import dynamic from "next/dynamic";

const ProceduralHero3D = dynamic(
  () =>
    import("@/components/procedural-hero-3d").then(
      (module) => module.ProceduralHero3D,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-white/10 bg-[#102321] p-5 text-white shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fcfc0]">
          Live 3D Store Builder
        </p>
        <h2 className="mt-2 text-2xl font-bold">Loading 3D preview</h2>
        <div className="mt-8 grid h-64 place-items-center rounded-lg border border-white/10 bg-white/5">
          <p className="max-w-sm text-center text-sm leading-7 text-white/70">
            Floating ecommerce templates, product cards, category icons, and
            marketplace cubes.
          </p>
        </div>
      </div>
    ),
  },
);

export function ImmersiveShowcase() {
  return (
    <section aria-label="3D ecommerce store builder preview">
      <ProceduralHero3D />
      <div className="sr-only">
        3D preview of StoreBuilder Cloud showing floating ecommerce website
        cards, product-grid UI blocks, marketplace app cubes, category icons,
        and builder objects generated in code for SEO-safe WebGL rendering.
      </div>
    </section>
  );
}
