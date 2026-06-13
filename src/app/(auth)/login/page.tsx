import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

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
      </div>
    </main>
  );
}
