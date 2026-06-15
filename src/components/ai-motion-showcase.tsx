import { AutoplayVideo } from "@/components/autoplay-video";

export function AiMotionShowcase() {
  return (
    <section
      aria-label="3D AI ecommerce store builder video preview"
      className="relative min-h-[360px] overflow-hidden rounded-lg border border-black/10 bg-[#102321] shadow-xl"
    >
      <AutoplayVideo
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/ai-store-builder.mp4"
        label="Animated 3D AI ecommerce store builder assistant scene."
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#102321]/5 via-transparent to-[#102321]/35" />
      <div className="pointer-events-none absolute left-5 top-5 z-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4fff1]">
          AI Builder
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Growth assistant preview
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 rounded-lg border border-white/10 bg-black/30 p-4 text-white backdrop-blur">
        <p className="font-mono text-xs text-white/65">
          Product copy, SEO, campaigns, analytics, and chat workflows
        </p>
        <p className="mt-2 text-sm text-white/85">
          A motion preview for the AI-powered merchant growth engine.
        </p>
      </div>
      <noscript>
        <div className="p-6 text-white">
          3D preview of an AI ecommerce store builder assistant.
        </div>
      </noscript>
    </section>
  );
}
