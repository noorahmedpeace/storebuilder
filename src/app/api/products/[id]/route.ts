import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getActorFromRequest,
  requirePermission,
  requireStoreScope,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  deleteProduct,
  getProduct,
  updateProduct,
} from "@/lib/repositories/products";
import { isUniqueConstraintError, zPrice } from "@/lib/validation";

const updateProductSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  price: zPrice.optional(),
  sku: z.string().min(2).optional(),
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
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const product = await getProduct(storeId, id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { actor, storeId } = await resolveStoreScope(request);

  const forbidden = requirePermission(actor, "products:write");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;
  if (!storeId) {
    return NextResponse.json({ error: "Missing store scope" }, { status: 400 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = updateProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  try {
    const product = await updateProduct(storeId, id, parsed.data);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ data: product, message: "Product updated." });
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

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { actor, storeId } = await resolveStoreScope(request);

  const forbidden = requirePermission(actor, "products:write");
  if (forbidden) return forbidden;
  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;
  if (!storeId) {
    return NextResponse.json({ error: "Missing store scope" }, { status: 400 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const deleted = await deleteProduct(storeId, id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Product deleted." });
}
