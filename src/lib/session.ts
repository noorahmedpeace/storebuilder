import { auth } from "@/auth";
import { can, type RoleName } from "@/lib/auth";

export type SessionContext = {
  userId?: string;
  storeId?: string;
  role?: RoleName;
  name?: string | null;
  email?: string | null;
};

/** Server-component helper: the current principal + active store scope. */
export async function getSessionContext(): Promise<SessionContext> {
  const session = await auth();
  if (!session?.user) return {};

  return {
    userId: session.user.id,
    storeId: session.user.storeId ?? undefined,
    role: session.user.role as RoleName | undefined,
    name: session.user.name,
    email: session.user.email,
  };
}

/**
 * Server-action authorization guard. Mirrors the RBAC the API routes enforce:
 * requires an active store scope AND that the session's role holds `permission`.
 * Returns the storeId, or throws (denying the mutation) otherwise.
 */
export async function requireStorePermission(permission: string): Promise<string> {
  const { storeId, role } = await getSessionContext();
  if (!storeId) throw new Error("No active store for this session.");
  if (!role || !can({ role, storeId }, permission)) {
    throw new Error(`Forbidden: missing ${permission}`);
  }
  return storeId;
}
