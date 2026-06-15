import { getDb, isDatabaseConfigured } from "@/lib/db";
import { tenantWhere } from "./tenant";

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  kind?: string;
};

export async function createLead(storeId: string, input: LeadInput) {
  const db = getDb();
  return db.lead.create({
    data: {
      storeId,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      message: input.message || null,
      kind: input.kind || "contact",
    },
  });
}

export async function listLeads(storeId: string) {
  if (!isDatabaseConfigured()) return { data: [], source: "mock" as const };
  try {
    const db = getDb();
    const data = await db.lead.findMany({
      where: tenantWhere(storeId),
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return { data, source: "database" as const };
  } catch (error) {
    console.error("Lead query failed", error);
    return { data: [], source: "mock" as const };
  }
}
