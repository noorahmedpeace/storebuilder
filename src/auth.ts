import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { getDb, isDatabaseConfigured } from "@/lib/db";

/**
 * Full auth instance (Node runtime). Extends the Edge-safe `authConfig` with a
 * Credentials provider that verifies a hashed password against the DB and
 * loads the user's active store membership (storeId + role) into the session.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!isDatabaseConfigured()) return null;

        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const db = getDb();
        const user = await db.user.findUnique({
          where: { email },
          include: {
            memberships: { include: { role: true }, take: 1 },
          },
        });

        if (!user?.passwordHash) return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        const membership = user.memberships[0];
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: membership?.role?.name ?? "STORE_STAFF",
          storeId: membership?.storeId ?? null,
        };
      },
    }),
  ],
});
