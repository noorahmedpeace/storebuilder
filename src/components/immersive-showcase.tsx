import { AutoplayVideo } from "@/components/autoplay-video";

export function ImmersiveShowcase() {
  return (
    <section
      aria-label="3D ecommerce store builder video preview"
      className="float-panel pulse-ring relative min-h-[300px] overflow-hidden rounded-lg border border-white/10 bg-[#102321] shadow-2xl sm:min-h-[380px] lg:min-h-[430px]"
    >
      <AutoplayVideo
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/storebuilder-hero.mp4"
        label="Animated 3D ecommerce website template cards orbiting with app cubes."
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#102321]/10 via-transparent to-[#102321]/30" />
      <div className="pointer-events-none absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4fff1]">
          3D Store Builder
        </p>
        <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
          Template scene preview
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 rounded-lg border border-white/10 bg-black/28 p-3 text-white backdrop-blur sm:inset-x-5 sm:bottom-5 sm:p-4">
        <p className="font-mono text-xs text-white/65">
          Store templates, app cubes, analytics widgets, and ecommerce blocks
        </p>
        <p className="mt-2 text-sm text-white/85">
          A premium motion hero for the StoreBuilder Cloud launch experience.
        </p>
      </div>
      <noscript>
        <div className="p-6 text-white">
          3D preview of ecommerce website cards, store categories, and
          marketplace app blocks.
        </div>
      </noscript>
    </section>
  );
}
