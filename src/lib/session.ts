import { auth } from "@/auth";
import type { RoleName } from "@/lib/auth";

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
