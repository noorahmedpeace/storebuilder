import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-safe middleware: protects /dashboard and /admin via the `authorized`
// callback in authConfig. Unauthenticated requests are redirected to /login.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
