import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getActorFromRequest,
  requirePermission,
  requireStoreScope,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createCustomer, listCustomers } from "@/lib/repositories/customers";

const createCustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(3).nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  const actor = await getActorFromRequest(request);
  const forbidden = requirePermission(actor, "store:read");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;

  const storeId = actor.storeId ?? request.headers.get("x-store-id") ?? "demo_store";
  const result = await listCustomers(storeId);

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

export async function POST(request: Request) {
  const actor = await getActorFromRequest(request);
  const forbidden = requirePermission(actor, "customers:write");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;

  const storeId = actor.storeId ?? request.headers.get("x-store-id") ?? undefined;
  if (!storeId) {
    return NextResponse.json({ error: "Missing store scope" }, { status: 400 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = createCustomerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid customer payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const customer = await createCustomer(storeId, parsed.data);
  return NextResponse.json(
    { data: customer, message: "Customer created." },
    { status: 201 },
  );
}
