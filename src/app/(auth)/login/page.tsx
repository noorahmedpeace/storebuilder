import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag, Store } from "lucide-react";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata = {
  title: "Sign in - BazaarOS Commerce Cloud",
};

async function authenticate(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=CredentialsSignin");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const dbReady = isDatabaseConfigured();

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-5 text-[#171717]">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <Link href="/" className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-[#143c3a] text-white">
            <ShoppingBag size={20} />
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#54706b]">
              BazaarOS
            </span>
            <span className="block text-lg font-bold">Commerce Cloud</span>
          </span>
        </Link>

        <h1 className="text-2xl font-bold">Sign in to your workspace</h1>
        <p className="mt-2 text-sm text-[#4f5b58]">
          Use your merchant or platform admin account.
        </p>

        {!dbReady ? (
          <div className="mt-4 rounded-lg bg-[#fff7e6] px-4 py-3 text-sm text-[#7a5a12]">
            <p className="font-semibold">This is running in demo mode</p>
            <p className="mt-1">
              Login needs a database. To enable real accounts, add{" "}
              <code className="rounded bg-[#f3e6c2] px-1">DATABASE_URL</code> and{" "}
              <code className="rounded bg-[#f3e6c2] px-1">NEXTAUTH_SECRET</code> in
              your Vercel project settings. Meanwhile, explore the demo below.
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-lg bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#a23b3b]">
            Invalid email or password. Please try again.
          </p>
        ) : null}

        <form action={authenticate} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-[#4f5b58]">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-[#f7f4ee] px-3 outline-none focus:border-[#143c3a]"
              placeholder="owner@oudreserve.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#4f5b58]">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-[#f7f4ee] px-3 outline-none focus:border-[#143c3a]"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a]"
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3 text-xs text-[#9aa3a0]">
          <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
        </div>

        <Link
          href="/store/oud-reserve"
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#143c3a]/30 font-semibold text-[#143c3a] transition hover:bg-[#143c3a]/5"
        >
          <Store size={16} /> See a live demo store
        </Link>

        <p className="mt-4 text-center text-sm text-[#4f5b58]">
          Don&apos;t have a store?{" "}
          <Link href="/create" className="font-semibold text-[#143c3a]">
            Build one free
          </Link>
        </p>
      </div>
    </main>
  );
}
