import { promises as dns } from "node:dns";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { isUniqueConstraintError } from "@/lib/validation";
import { getStoreBySlug } from "./stores";
import { tenantWhere } from "./tenant";

/** Where the merchant must point DNS (configurable per deployment). */
export const PLATFORM_CNAME_TARGET =
  process.env.PLATFORM_CNAME_TARGET || "cname.vercel-dns.com";
export const PLATFORM_IP = process.env.PLATFORM_IP || "76.76.21.21";

/** Normalize user input into a bare hostname (no protocol/path/port). */
export function normalizeHost(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:.*$/, "");
}

const HOST_RE = /^([a-z0-9-]+\.)+[a-z]{2,}$/;

export async function listDomains(storeId: string) {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();
  return db.domain.findMany({
    where: tenantWhere(storeId),
    orderBy: [{ primary: "desc" }, { createdAt: "asc" }],
  });
}

export type AddDomainResult =
  | { ok: true; id: string }
  | { ok: false; reason: "invalid" | "taken" };

export async function addDomain(
  storeId: string,
  rawHost: string,
): Promise<AddDomainResult> {
  const host = normalizeHost(rawHost);
  if (!HOST_RE.test(host)) return { ok: false, reason: "invalid" };

  const db = getDb();
  const existingCount = await db.domain.count({ where: tenantWhere(storeId) });

  try {
    const domain = await db.domain.create({
      data: { storeId, host, primary: existingCount === 0 },
    });
    return { ok: true, id: domain.id };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { ok: false, reason: "taken" };
    throw error;
  }
}

export async function removeDomain(storeId: string, id: string) {
  const db = getDb();
  const result = await db.domain.deleteMany({ where: tenantWhere(storeId, { id }) });
  return result.count > 0;
}

export async function setPrimaryDomain(storeId: string, id: string) {
  const db = getDb();
  const target = await db.domain.findFirst({
    where: tenantWhere(storeId, { id }),
    select: { id: true },
  });
  if (!target) return false;

  await db.$transaction([
    db.domain.updateMany({ where: tenantWhere(storeId), data: { primary: false } }),
    db.domain.update({ where: { id: target.id }, data: { primary: true } }),
  ]);
  return true;
}

/** Real DNS check: domain is verified when it points at the platform. */
export async function verifyDomain(storeId: string, id: string) {
  const db = getDb();
  const domain = await db.domain.findFirst({
    where: tenantWhere(storeId, { id }),
    select: { id: true, host: true },
  });
  if (!domain) return { ok: false as const, verified: false };

  let verified = false;
  try {
    const cnames = await dns.resolveCname(domain.host);
    if (cnames.some((c) => c.includes(PLATFORM_CNAME_TARGET))) verified = true;
  } catch {
    // no CNAME; fall through to A record
  }
  if (!verified) {
    try {
      const a = await dns.resolve4(domain.host);
      if (a.includes(PLATFORM_IP)) verified = true;
    } catch {
      // unresolved
    }
  }

  if (verified) {
    await db.domain.update({ where: { id: domain.id }, data: { verified: true } });
  }
  return { ok: true as const, verified };
}

/** Public host routing: resolve a verified custom domain to its store. */
export async function getStoreByDomain(rawHost: string) {
  if (!isDatabaseConfigured()) return null;
  const host = normalizeHost(rawHost);
  const db = getDb();
  const domain = await db.domain.findFirst({
    where: { host, verified: true },
    select: { store: { select: { slug: true } } },
  });
  if (!domain) return null;
  return getStoreBySlug(domain.store.slug);
}
