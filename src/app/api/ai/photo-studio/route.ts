import { NextResponse } from "next/server";
import { z } from "zod";
import { can, type RoleName } from "@/lib/auth";
import { getSessionContext } from "@/lib/session";
import {
  isPhotoStudioConfigured,
  removeBackground,
} from "@/lib/photo-studio";

const bodySchema = z.object({
  imageDataUri: z
    .string()
    .startsWith("data:image/", "Expected a data:image/... URI")
    .max(12_000_000, "Image too large (max ~8MB)"),
});

export async function GET() {
  // lets the UI show the right state without attempting a job
  return NextResponse.json({ configured: isPhotoStudioConfigured() });
}

export async function POST(request: Request) {
  const { storeId, role } = await getSessionContext();
  if (!storeId || !role) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!can({ role: role as RoleName, storeId }, "products:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isPhotoStudioConfigured()) {
    return NextResponse.json(
      {
        error:
          "Photo Studio is not configured. Add a FAL_KEY environment variable to enable it.",
        configured: false,
      },
      { status: 503 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid image payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await removeBackground(parsed.data.imageDataUri);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  // Inline the cutout as a data URI so the browser <canvas> stays untainted
  // (lets the client produce white-bg / aspect-ratio variations and export).
  try {
    const img = await fetch(result.url, { signal: AbortSignal.timeout(60_000) });
    if (!img.ok) throw new Error(`fetch cutout ${img.status}`);
    const type = img.headers.get("content-type") || "image/png";
    const buf = Buffer.from(await img.arrayBuffer());
    const dataUri = `data:${type};base64,${buf.toString("base64")}`;
    return NextResponse.json({ url: dataUri, provider: result.provider });
  } catch {
    // fall back to the remote URL; client may still display it
    return NextResponse.json({ url: result.url, provider: result.provider });
  }
}
