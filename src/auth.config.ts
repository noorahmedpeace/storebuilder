import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config. Imported by `middleware.ts` (Edge runtime) so it must
 * NOT import Prisma, bcrypt, or any Node-only module. The real Credentials
 * provider (which needs the DB) is added in `src/auth.ts` (Node runtime).
 */
export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    // Route protection + custom-domain routing live in middleware.ts (it wraps
    // auth() with a function), so this callback simply allows the request.
    authorized() {
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.storeId = user.storeId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string | undefined;
        session.user.storeId = token.storeId as string | null | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
