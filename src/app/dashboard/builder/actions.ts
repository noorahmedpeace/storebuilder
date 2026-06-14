"use server";

import { revalidatePath } from "next/cache";
import { requireStorePermission } from "@/lib/session";
import { getStoreSettings, updateStoreLayout } from "@/lib/repositories/stores";
import { normalizeLayout, type Section } from "@/lib/sections";

export async function saveLayout(layout: Section[]) {
  const storeId = await requireStorePermission("store:write");
  // Never trust client-supplied layout shape — sanitize server-side.
  const clean = normalizeLayout(layout);
  await updateStoreLayout(storeId, clean);

  const settings = await getStoreSettings(storeId);
  revalidatePath("/dashboard/builder");
  if (settings?.slug) revalidatePath(`/store/${settings.slug}`);
  return { ok: true as const };
}
