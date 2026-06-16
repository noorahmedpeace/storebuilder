import { AutoplayVideo } from "@/components/autoplay-video";

export function IntegrationMotionShowcase() {
  return (
    <section
      aria-label="3D ecommerce marketplace integrations video preview"
      className="float-panel relative aspect-[16/10] min-h-[320px] overflow-hidden rounded-lg border border-white/10 bg-[#0d1d1b] shadow-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_35%),linear-gradient(180deg,#0d1d1b,#102321)]" />
      <AutoplayVideo
        className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-contain sm:inset-5 sm:h-[calc(100%-2.5rem)] sm:w-[calc(100%-2.5rem)]"
        src="/media/marketplace-integrations.mp4"
        label="Animated 3D marketplace integration cards for ecommerce apps."
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#102321]/5 via-transparent to-[#102321]/35" />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 rounded-lg border border-white/10 bg-black/30 p-3 text-white backdrop-blur sm:inset-x-5 sm:bottom-5 sm:p-4">
        <p className="font-mono text-xs text-white/65">
          SEO, WhatsApp, payments, courier, AI, themes, and analytics
        </p>
        <p className="mt-2 text-sm text-white/85">
          Marketplace apps shown as a premium motion preview.
        </p>
      </div>
      <noscript>
        <div className="p-6 text-white">
          3D preview of ecommerce marketplace integrations and app blocks.
        </div>
      </noscript>
    </section>
  );
}
