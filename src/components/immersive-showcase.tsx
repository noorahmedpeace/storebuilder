import { AutoplayVideo } from "@/components/autoplay-video";

export function ImmersiveShowcase() {
  return (
    <section
      aria-label="3D ecommerce store builder video preview"
      className="hero-video-stage relative min-h-[300px] overflow-hidden rounded-lg border border-white/12 bg-[#102321] shadow-[0_38px_120px_rgba(0,0,0,0.46)] sm:min-h-[380px] lg:min-h-[430px]"
    >
      <AutoplayVideo
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/storebuilder-hero.mp4"
        label="Animated 3D ecommerce website template cards orbiting with app cubes."
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06110f]/18 via-transparent to-[#06110f]/44" />
      <div className="pointer-events-none absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d4fff1]">
          Motion storefront engine
        </p>
        <h2 className="font-display mt-2 text-xl font-black text-white sm:text-2xl">
          Premium store preview
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 rounded-lg border border-white/10 bg-[#06110f]/52 p-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-4">
        <p className="font-mono text-xs text-white/62">
          templates / apps / checkout / analytics / AI
        </p>
        <p className="mt-2 text-sm font-semibold text-white/88">
          Launch a store that looks like a serious brand from day one.
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
