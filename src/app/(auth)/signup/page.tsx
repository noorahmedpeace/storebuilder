import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { createStoreWithOwner } from "@/lib/repositories/stores";
import { THEMES } from "@/lib/themes";

export const metadata = { title: "Create your store - BazaarOS" };

const ERRORS: Record<string, string> = {
  email: "That email is already registered. Try signing in.",
  slug: "That store name is taken. Pick a slightly different name.",
  unknown: "Something went wrong creating your store. Please try again.",
  fields: "Please fill in all required fields.",
};

async function registerStore(formData: FormData) {
  "use server";
  const ownerName = String(formData.get("ownerName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const storeName = String(formData.get("storeName") ?? "").trim();
  const businessType = String(formData.get("businessType") ?? "").trim();
  const themeKey = String(formData.get("themeKey") ?? "modern-retail");

  if (!ownerName || !email || password.length < 6 || !storeName) {
    redirect("/signup?error=fields");
  }

  const result = await createStoreWithOwner({
    ownerName,
    email,
    password,
    storeName,
    storeSlug: storeName,
    businessType,
    themeKey,
  });

  if (!result.ok) {
    redirect(`/signup?error=${result.reason}`);
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login");
    }
    throw error;
  }
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 text-[#171717]">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
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

        <h1 className="text-3xl font-bold">Launch your store in minutes</h1>
        <p className="mt-2 text-sm text-[#4f5b58]">
          No coding needed. Create your account, pick a theme, and start selling.
        </p>

        {error ? (
          <p className="mt-4 rounded-lg bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#a23b3b]">
            {ERRORS[error] ?? ERRORS.unknown}
          </p>
        ) : null}

        <form action={registerStore} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="ownerName" label="Your name" placeholder="Ali Khan" required />
            <Field name="email" label="Email" type="email" placeholder="ali@email.com" required />
            <Field name="password" label="Password" type="password" placeholder="min 6 characters" required />
            <Field name="storeName" label="Store name" placeholder="Ali Electronics" required />
            <Field name="businessType" label="Business type" placeholder="Electronics, Grocery..." />
          </div>

          <div>
            <span className="text-sm font-semibold text-[#4f5b58]">Pick a theme</span>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {THEMES.map((theme, i) => (
                <label
                  key={theme.key}
                  className="cursor-pointer rounded-lg border border-black/15 p-3 text-center text-xs font-semibold transition hover:border-[#143c3a] has-[:checked]:border-[#143c3a] has-[:checked]:bg-[#e7ece2]"
                >
                  <input
                    type="radio"
                    name="themeKey"
                    value={theme.key}
                    defaultChecked={i === 0}
                    className="sr-only"
                  />
                  <span
                    className="mx-auto mb-2 block h-8 w-full rounded"
                    style={{
                      background: `linear-gradient(135deg, ${theme.brandColor}, ${theme.accentColor})`,
                    }}
                  />
                  {theme.name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a]"
          >
            Create my store
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#4f5b58]">
          Already have a store?{" "}
          <Link href="/login" className="font-semibold text-[#143c3a]">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#4f5b58]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-[#f7f4ee] px-3 outline-none focus:border-[#143c3a]"
      />
    </label>
  );
}
