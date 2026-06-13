import { NextResponse } from "next/server";
import { z } from "zod";
import { getActorFromRequest, requirePermission } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createStore, listStores } from "@/lib/repositories";

const createStoreSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  domain: z.string().optional(),
  plan: z.string().optional(),
});

export async function GET(request: Request) {
  const actor = await getActorFromRequest(request);
  const forbidden = requirePermission(actor, "platform:read");
  if (forbidden) return forbidden;

  const result = await listStores();

  return NextResponse.json({
    data: result.data,
    meta: {
      tenantIsolation: "platform-admin",
      source: result.source,
      total: result.data.length,
    },
  });
}

export async function POST(request: Request) {
  const actor = await getActorFromRequest(request);
  const forbidden = requirePermission(actor, "platform:*");
  if (forbidden) return forbidden;

  const json = await request.json().catch(() => ({}));
  const parsed = createStoreSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid store payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Database not configured",
        message: "Set DATABASE_URL and run npm run db:migrate before creating stores.",
      },
      { status: 503 },
    );
  }

  const store = await createStore(parsed.data);

  return NextResponse.json(
    {
      data: store,
      message: "Store created.",
    },
    { status: 201 },
  );
}
