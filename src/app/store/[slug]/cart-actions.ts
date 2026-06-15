"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addToCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/repositories/cart";
import { createOrderFromCart, getOrderForStore } from "@/lib/repositories/checkout";

export async function addToCartAction(
  storeId: string,
  slug: string,
  variantId: string,
  qty: number,
) {
  await addToCart(storeId, variantId, qty);
  revalidatePath(`/store/${slug}`);
  revalidatePath(`/store/${slug}/cart`);
}

export async function updateItemAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  await updateCartItem(
    String(formData.get("storeId") ?? ""),
    String(formData.get("itemId") ?? ""),
    Number(formData.get("qty") ?? 0),
  );
  revalidatePath(`/store/${slug}/cart`);
}

export async function removeItemAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  await removeCartItem(
    String(formData.get("storeId") ?? ""),
    String(formData.get("itemId") ?? ""),
  );
  revalidatePath(`/store/${slug}/cart`);
}

export async function reorderAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const orderId = String(formData.get("orderId") ?? "");
  const order = await getOrderForStore(storeId, orderId);
  if (order) {
    for (const item of order.items) {
      await addToCart(storeId, item.variantId, item.quantity);
    }
  }
  redirect(`/store/${slug}/cart`);
}

export async function checkoutAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const result = await createOrderFromCart(storeId, {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || undefined,
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
  });
  if (!result.ok) redirect(`/store/${slug}/checkout?error=${result.reason}`);
  redirect(`/store/${slug}/order/${result.orderId}`);
}
