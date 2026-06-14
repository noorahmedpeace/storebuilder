import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/uploads";

/**
 * Public image upload (used by the pre-signup builder for logos). Validation
 * (image type + 5MB cap) is enforced in saveUpload. Returns { url }.
 */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");

  const result = await saveUpload(file, "public");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ url: result.url });
}
