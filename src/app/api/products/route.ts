import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getActorFromRequest,
  requirePermission,
  requireStoreScope,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createProduct, listProducts } from "@/lib/repositories";
import { isUniqueConstraintError, zPrice } from "@/lib/validation";

const createProductSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  sku: z.string().min(2),
  price: zPrice,
});

export async function GET(request: Request) {
  const actor = await getActorFromRequest(request);
  const forbidden = requirePermission(actor, "store:read");
  if (forbidden) return forbidden;

  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;

  const storeId = actor.storeId ?? request.headers.get("x-store-id") ?? "demo_store";
  const result = await listProducts(storeId);

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
  const forbidden = requirePermission(actor, "products:write");
  if (forbidden) return forbidden;

  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;

  const json = await request.json().catch(() => ({}));
  const parsed = createProductSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Database not configured",
        message: "Set DATABASE_URL and run npm run db:migrate before creating products.",
      },
      { status: 503 },
    );
  }

  const storeId = actor.storeId ?? "demo_store";
  try {
    const product = await createProduct(storeId, parsed.data);
    return NextResponse.json(
      { data: product, message: "Product draft created." },
      { status: 201 },
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "A product with that slug or SKU already exists." },
        { status: 409 },
      );
    }
    throw error;
  }
}
