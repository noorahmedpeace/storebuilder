import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, isDatabaseConfigured } from "@/lib/db";

const schema = z.object({
  storeId: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const db = getDb();
  const store = await db.store.findUnique({
    where: { id: parsed.data.storeId },
    select: { id: true },
  });
  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  await db.newsletterSubscriber.upsert({
    where: {
      storeId_email: { storeId: store.id, email: parsed.data.email },
    },
    update: {},
    create: { storeId: store.id, email: parsed.data.email },
  });

  return NextResponse.json({ ok: true });
}
