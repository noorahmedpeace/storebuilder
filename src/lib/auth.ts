import { NextResponse } from "next/server";
import { auth } from "@/auth";

export type RoleName = "SUPER_ADMIN" | "STORE_OWNER" | "STORE_STAFF" | "SUPPORT";

const permissionsByRole: Record<RoleName, string[]> = {
  SUPER_ADMIN: ["platform:*", "store:*"],
  STORE_OWNER: ["store:*"],
  STORE_STAFF: ["store:read", "orders:write", "products:write"],
  SUPPORT: ["platform:read", "support:write"],
};

export type RequestActor = {
  role: RoleName;
  storeId?: string;
  userId?: string;
};

const isDev = process.env.NODE_ENV !== "production";

function actorFromHeaders(request: Request): RequestActor | null {
  const headerRole = request.headers.get("x-user-role");
  if (!headerRole) return null;

  return {
    role: headerRole in permissionsByRole ? (headerRole as RoleName) : "STORE_STAFF",
    storeId: request.headers.get("x-store-id") ?? undefined,
    userId: request.headers.get("x-user-id") ?? undefined,
  };
}

/**
 * Resolves the acting principal for an API request.
 *
 * Production: derived from the authenticated NextAuth session only.
 * Development: an `x-user-role` / `x-store-id` header bypass is honored first
 * so curl-based e2e checks work without a login flow. Unauthenticated callers
 * fall back to the least-privileged role with no store scope.
 */
export async function getActorFromRequest(request: Request): Promise<RequestActor> {
  if (isDev) {
    const headerActor = actorFromHeaders(request);
    if (headerActor) return headerActor;
  }

  const session = await auth();
  if (session?.user) {
    const role = session.user.role;
    return {
      role:
        role && role in permissionsByRole ? (role as RoleName) : "STORE_STAFF",
      storeId: session.user.storeId ?? undefined,
      userId: session.user.id ?? undefined,
    };
  }

  return { role: "STORE_STAFF" };
}

export function can(actor: RequestActor, permission: string) {
  const permissions = permissionsByRole[actor.role] ?? [];
  const [scope] = permission.split(":");

  return (
    permissions.includes(permission) ||
    permissions.includes(`${scope}:*`) ||
    permissions.includes("platform:*") ||
    // A full store grant (store:*) covers every store-scoped resource action
    // (products:write, orders:write, ...) but never platform-level actions.
    (scope !== "platform" && permissions.includes("store:*"))
  );
}

export function requirePermission(actor: RequestActor, permission: string) {
  if (can(actor, permission)) {
    return null;
  }

  return NextResponse.json(
    {
      error: "Forbidden",
      message: `Role ${actor.role} is missing ${permission}`,
    },
    { status: 403 },
  );
}

export function requireStoreScope(actor: RequestActor) {
  if (actor.role === "SUPER_ADMIN") {
    return null;
  }

  if (actor.storeId) {
    return null;
  }

  return NextResponse.json(
    {
      error: "Missing store scope",
      message: "Tenant APIs require x-store-id for non-platform roles.",
    },
    { status: 400 },
  );
}
