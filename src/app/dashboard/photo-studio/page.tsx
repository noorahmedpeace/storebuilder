import { Panel } from "@/components/app-shell";
import { PhotoStudioClient } from "@/components/photo-studio-client";
import { isPhotoStudioConfigured } from "@/lib/photo-studio";

export default function PhotoStudioPage() {
  const configured = isPhotoStudioConfigured();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Product Photo Studio</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Upload a product snap — AI removes the background, then frames it into
          clean, marketplace-ready photos (white background, transparent PNG, and
          1:1 / 4:5 / 16:9 / 9:16 crops). Export as PNG, JPG, or WEBP.
        </p>
      </div>
      <Panel title="Studio">
        <PhotoStudioClient configured={configured} />
      </Panel>
    </div>
  );
}
