/**
 * Product Photo Studio — AI image pipeline.
 *
 * The load-bearing, reliable operation is **background removal**, run through an
 * image-AI provider (fal.ai by default). Everything downstream that doesn't need
 * a model — white/studio backgrounds, aspect-ratio framing, format export — is
 * done in the browser on a <canvas> from the returned cutout, so it costs
 * nothing extra and works offline.
 *
 * Generative steps (AI relight, AI-generated lifestyle scenes) require a
 * text-to-image / inpaint model and are intentionally NOT faked here — they plug
 * in as additional provider calls once enabled. See `generateScene` stub.
 *
 * Provider is env-gated: set FAL_KEY to enable. Without it the studio stays in a
 * clear "not configured" state instead of pretending to work.
 */

export type StudioProvider = "fal";

const FAL_BG_MODEL = "fal-ai/birefnet"; // high-quality background removal

export function getStudioProvider(): StudioProvider | null {
  if (process.env.FAL_KEY) return "fal";
  return null;
}

export function isPhotoStudioConfigured(): boolean {
  return getStudioProvider() !== null;
}

export type CutoutResult =
  | { ok: true; url: string; provider: StudioProvider }
  | { ok: false; error: string };

/**
 * Remove the background from a product image.
 * @param imageDataUri a `data:image/...;base64,...` URI (sent inline so the
 *   provider can fetch it without a publicly reachable URL).
 */
export async function removeBackground(
  imageDataUri: string,
): Promise<CutoutResult> {
  const provider = getStudioProvider();
  if (!provider) {
    return {
      ok: false,
      error:
        "Photo Studio is not configured. Add a FAL_KEY environment variable to enable AI background removal.",
    };
  }

  try {
    const res = await fetch(`https://fal.run/${FAL_BG_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: imageDataUri }),
      // generous timeout for cold model starts
      signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Provider error (${res.status}). ${detail.slice(0, 200)}`,
      };
    }

    const json = (await res.json()) as { image?: { url?: string } };
    const url = json.image?.url;
    if (!url) {
      return { ok: false, error: "Provider returned no image." };
    }
    return { ok: true, url, provider };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown processing error";
    return { ok: false, error: message };
  }
}

/**
 * AI-generated lifestyle / studio scene behind a cutout. Requires a generative
 * inpaint model — stubbed deliberately rather than faked. Wire a fal flux /
 * inpaint call here when enabling the "lifestyle scenes" tier.
 */
export async function generateScene(): Promise<CutoutResult> {
  return {
    ok: false,
    error:
      "AI lifestyle scenes require a generative model. Not enabled in this build.",
  };
}
