import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getActorFromRequest,
  requirePermission,
  requireStoreScope,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { getOrder, updateOrderStatus } from "@/lib/repositories/orders";

const ORDER_STATUSES = [
  "DRAFT",
  "PENDING",
  "PAID",
  "PACKING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

type RouteContext = { params: Promise<{ id: string }> };

async function resolveStoreScope(request: Request) {
  const actor = await getActorFromRequest(request);
  const storeId = actor.storeId ?? request.headers.get("x-store-id") ?? undefined;
  return { actor, storeId };
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { actor, storeId } = await resolveStoreScope(request);

  const forbidden = requirePermission(actor, "store:read");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;
  if (!storeId) {
    return NextResponse.json({ error: "Missing store scope" }, { status: 400 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const order = await getOrder(storeId, id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ data: order });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { actor, storeId } = await resolveStoreScope(request);

  const forbidden = requirePermission(actor, "orders:write");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;
  if (!storeId) {
    return NextResponse.json({ error: "Missing store scope" }, { status: 400 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = updateStatusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid status payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const result = await updateOrderStatus(storeId, id, parsed.data.status);

  if (result.status === "not_found") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (result.status === "illegal") {
    return NextResponse.json(
      {
        error: "Illegal status transition",
        message: `Cannot move order from ${result.from} to ${result.to}.`,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({ data: result.order, message: "Order status updated." });
}
