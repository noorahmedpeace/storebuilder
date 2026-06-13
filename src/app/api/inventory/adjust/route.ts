import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getActorFromRequest,
  requirePermission,
  requireStoreScope,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { adjustInventory } from "@/lib/repositories/inventory";

const adjustSchema = z.object({
  inventoryItemId: z.string().min(1),
  delta: z.number().int(),
});

export async function POST(request: Request) {
  const actor = await getActorFromRequest(request);
  const forbidden = requirePermission(actor, "inventory:write");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;

  const storeId = actor.storeId ?? request.headers.get("x-store-id") ?? undefined;
  if (!storeId) {
    return NextResponse.json({ error: "Missing store scope" }, { status: 400 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = adjustSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid adjustment payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const result = await adjustInventory(
    storeId,
    parsed.data.inventoryItemId,
    parsed.data.delta,
  );

  if (result.status === "not_found") {
    return NextResponse.json(
      { error: "Inventory item not found in this store" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: { id: result.id, quantity: result.quantity },
    message: "Inventory adjusted.",
  });
}
