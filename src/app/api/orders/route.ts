import { NextResponse } from "next/server";
import {
  getActorFromRequest,
  requirePermission,
  requireStoreScope,
} from "@/lib/auth";
import { listOrders } from "@/lib/repositories";

export async function GET(request: Request) {
  const actor = await getActorFromRequest(request);
  const forbidden = requirePermission(actor, "store:read");
  if (forbidden) return forbidden;

  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;

  const storeId = actor.storeId ?? request.headers.get("x-store-id") ?? "demo_store";
  const result = await listOrders(storeId);

  return NextResponse.json({
    data: result.data,
    meta: {
      storeId,
      source: result.source,
      tenantScoped: true,
      total: result.data.length,
    },
  });
}
