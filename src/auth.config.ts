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
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const role = auth?.user?.role;
      const { pathname } = request.nextUrl;

      // Super-admin console: platform owner only.
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        if (role !== "SUPER_ADMIN") {
          return Response.redirect(new URL("/dashboard", request.nextUrl));
        }
        return true;
      }

      if (pathname.startsWith("/dashboard")) return isLoggedIn;
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
