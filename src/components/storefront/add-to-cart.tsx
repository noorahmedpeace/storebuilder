"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart } from "lucide-react";
import { addToCartAction } from "@/app/store/[slug]/cart-actions";

export function AddToCart({
  storeId,
  slug,
  variantId,
  brand,
  label = "Add to cart",
  qty = 1,
  className = "",
}: {
  storeId: string;
  slug: string;
  variantId: string;
  brand: string;
  label?: string;
  qty?: number;
  className?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [added, setAdded] = useState(false);

  function add() {
    start(async () => {
      await addToCartAction(storeId, slug, variantId, qty);
      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 1600);
    });
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 ${className}`}
      style={{ background: brand }}
    >
      {added ? <Check size={16} /> : <ShoppingCart size={16} />}
      {added ? "Added" : pending ? "Adding…" : label}
    </button>
  );
}
