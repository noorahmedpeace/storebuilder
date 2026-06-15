import { cookies } from "next/headers";
import { getDb } from "@/lib/db";

const CART_COOKIE = "sb_cart";

const cartInclude = {
  items: {
    include: {
      variant: {
        include: { product: { include: { images: { take: 1 } } } },
      },
    },
    orderBy: { id: "asc" as const },
  },
};

type CartWithItems = NonNullable<
  Awaited<ReturnType<typeof loadCart>>
>;

async function loadCart(cartId: string, storeId: string) {
  const db = getDb();
  return db.cart.findFirst({
    where: { id: cartId, storeId },
    include: cartInclude,
  });
}

/** Read-only: the current cart for this store, or null. Safe during render. */
export async function getCart(storeId: string) {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;
  return loadCart(cartId, storeId);
}

/** Total item quantity for the header badge. */
export async function getCartCount(storeId: string) {
  const cart = await getCart(storeId);
  if (!cart) return 0;
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}

/** Subtotal / total for a loaded cart. */
export function cartTotals(cart: CartWithItems, shippingFee = 0) {
  const subtotal = cart.items.reduce(
    (sum, i) => sum + Number(i.variant.price) * i.quantity,
    0,
  );
  return { subtotal, shippingFee, total: subtotal + shippingFee };
}

/** Get-or-create the store's cart and persist its id in a cookie.
 *  Only call from a Server Action / Route Handler (it writes a cookie). */
async function getOrCreateCart(storeId: string) {
  const jar = await cookies();
  const existingId = jar.get(CART_COOKIE)?.value;
  if (existingId) {
    const cart = await loadCart(existingId, storeId);
    if (cart) return cart;
  }
  const db = getDb();
  const cart = await db.cart.create({ data: { storeId }, include: cartInclude });
  jar.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart;
}

/** Add a variant (verified to belong to the store) to the cart. */
export async function addToCart(storeId: string, variantId: string, qty = 1) {
  const db = getDb();
  const variant = await db.productVariant.findFirst({
    where: { id: variantId, product: { storeId } },
    select: { id: true },
  });
  if (!variant) return { ok: false as const };

  const cart = await getOrCreateCart(storeId);
  const quantity = Math.max(1, qty);
  await db.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, variantId, quantity },
  });
  return { ok: true as const };
}

export async function updateCartItem(storeId: string, itemId: string, qty: number) {
  const db = getDb();
  const item = await db.cartItem.findFirst({
    where: { id: itemId, cart: { storeId } },
    select: { id: true },
  });
  if (!item) return;
  if (qty <= 0) {
    await db.cartItem.delete({ where: { id: item.id } });
  } else {
    await db.cartItem.update({ where: { id: item.id }, data: { quantity: qty } });
  }
}

export async function removeCartItem(storeId: string, itemId: string) {
  const db = getDb();
  await db.cartItem.deleteMany({ where: { id: itemId, cart: { storeId } } });
}

/** Clears the cart row + cookie (after a successful order). */
export async function clearCart(storeId: string) {
  const jar = await cookies();
  const cartId = jar.get(CART_COOKIE)?.value;
  if (cartId) {
    await getDb().cart.deleteMany({ where: { id: cartId, storeId } });
    jar.delete(CART_COOKIE);
  }
}
