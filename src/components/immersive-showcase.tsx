export function ImmersiveShowcase() {
  return (
    <section
      aria-label="3D ecommerce store builder video preview"
      className="relative min-h-[430px] overflow-hidden rounded-lg border border-white/10 bg-[#102321] shadow-2xl"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/storebuilder-hero.mp4"
        poster="/media/storebuilder-hero-poster.png"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Animated 3D ecommerce website template cards orbiting with app cubes."
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#102321]/10 via-transparent to-[#102321]/30" />
      <div className="pointer-events-none absolute left-5 top-5 z-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4fff1]">
          3D Store Builder
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Template scene preview
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 rounded-lg border border-white/10 bg-black/28 p-4 text-white backdrop-blur">
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
