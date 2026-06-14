"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "ok" | "err";

export function NewsletterForm({
  storeId,
  title,
  text,
  buttonLabel,
  brand,
}: {
  storeId: string;
  title?: string;
  text?: string;
  buttonLabel?: string;
  brand: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, email }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 text-center lg:px-8">
      <h2 className="text-3xl font-bold">{title || "Stay in the loop"}</h2>
      {text ? <p className="mt-2 text-[#555]">{text}</p> : null}

      {status === "ok" ? (
        <p className="mt-5 font-semibold" style={{ color: brand }}>
          Thanks for subscribing! 🎉
        </p>
      ) : (
        <form onSubmit={submit} className="mx-auto mt-5 flex max-w-md gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-11 flex-1 rounded-lg border border-black/15 bg-white px-3 outline-none focus:border-black/40"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="h-11 rounded-lg px-5 font-semibold text-white disabled:opacity-60"
            style={{ background: brand }}
          >
            {status === "loading" ? "…" : buttonLabel || "Subscribe"}
          </button>
        </form>
      )}
      {status === "err" ? (
        <p className="mt-3 text-sm text-[#a23b3b]">
          Could not subscribe. Please try again.
        </p>
      ) : null}
    </section>
  );
}
