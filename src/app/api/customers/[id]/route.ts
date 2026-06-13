import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getActorFromRequest,
  requirePermission,
  requireStoreScope,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from "@/lib/repositories/customers";

const updateCustomerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(3).nullable().optional(),
  tags: z.array(z.string()).optional(),
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

  const customer = await getCustomer(storeId, id);
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json({ data: customer });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { actor, storeId } = await resolveStoreScope(request);

  const forbidden = requirePermission(actor, "customers:write");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;
  if (!storeId) {
    return NextResponse.json({ error: "Missing store scope" }, { status: 400 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = updateCustomerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid customer payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const customer = await updateCustomer(storeId, id, parsed.data);
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json({ data: customer, message: "Customer updated." });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { actor, storeId } = await resolveStoreScope(request);

  const forbidden = requirePermission(actor, "customers:write");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;
  if (!storeId) {
    return NextResponse.json({ error: "Missing store scope" }, { status: 400 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const deleted = await deleteCustomer(storeId, id);
  if (!deleted) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Customer deleted." });
}
