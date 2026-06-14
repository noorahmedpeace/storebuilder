export function IntegrationMotionShowcase() {
  return (
    <section
      aria-label="3D ecommerce marketplace integrations video preview"
      className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#0d1d1b] shadow-2xl"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/marketplace-integrations.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Animated 3D marketplace integration cards for ecommerce apps."
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#102321]/5 via-transparent to-[#102321]/35" />
      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 rounded-lg border border-white/10 bg-black/30 p-4 text-white backdrop-blur">
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
