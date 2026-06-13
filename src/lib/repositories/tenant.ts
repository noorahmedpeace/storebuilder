/**
 * Tenant-scoping helpers shared by every per-domain repository module.
 *
 * Multi-tenant rule: every query against a tenant-owned table MUST filter by
 * `storeId`. Use `tenantWhere(storeId, extra)` to build the `where` clause so
 * the store scope can never be accidentally dropped.
 */
export function tenantWhere<T extends Record<string, unknown>>(
  storeId: string,
  extra?: T,
): { storeId: string } & T {
  return { storeId, ...(extra ?? ({} as T)) };
}
