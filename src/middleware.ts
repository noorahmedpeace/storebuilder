import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";

/** Is this host the platform itself (vs. a merchant's custom domain)? */
function isPlatformHost(host: string) {
  const h = host.split(":")[0];
  if (h === "localhost" || h === "127.0.0.1") return true;
  if (h.endsWith(".vercel.app")) return true;
  if (ROOT_DOMAIN && (h === ROOT_DOMAIN || h.endsWith(`.${ROOT_DOMAIN}`))) {
    return true;
  }
  return false;
}

export default auth((req) => {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  // Custom merchant domain -> serve that store's storefront (public, no auth).
  if (
    !isPlatformHost(host) &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/sites") &&
    !pathname.startsWith("/_next")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = `/sites/${host.split(":")[0]}`;
    return NextResponse.rewrite(url);
  }

  // Platform host: protect /dashboard and /admin.
  const isLoggedIn = Boolean(req.auth?.user);
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  } else if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
