import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";
import { cartTotals, clearCart, getCart } from "./cart";

/** Flat COD shipping fee (PKR) for v1. */
export const SHIPPING_FEE = 200;

export type CheckoutInput = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
};

export type CheckoutResult =
  | { ok: true; orderId: string }
  | { ok: false; reason: "empty" | "error" };

/** Turns the cookie cart into a real COD order (atomic) and clears the cart. */
export async function createOrderFromCart(
  storeId: string,
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const cart = await getCart(storeId);
  if (!cart || cart.items.length === 0) return { ok: false, reason: "empty" };

  const db = getDb();
  const { subtotal, shippingFee, total } = cartTotals(cart, SHIPPING_FEE);

  try {
    const orderId = await db.$transaction(async (tx) => {
      let customer = await tx.customer.findFirst({
        where: { storeId, phone: input.phone },
        select: { id: true },
      });
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            storeId,
            name: input.name,
            phone: input.phone,
            email: input.email || null,
          },
          select: { id: true },
        });
      }

      const order = await tx.order.create({
        data: {
          storeId,
          customerId: customer.id,
          status: "PENDING",
          subtotal: new Prisma.Decimal(subtotal),
          shippingFee: new Prisma.Decimal(shippingFee),
          total: new Prisma.Decimal(total),
          customerName: input.name,
          customerPhone: input.phone,
          customerEmail: input.email || null,
          shippingAddress: input.address,
          shippingCity: input.city,
          paymentMethod: "COD",
          items: {
            create: cart.items.map((i) => ({
              variantId: i.variantId,
              quantity: i.quantity,
              price: i.variant.price,
            })),
          },
          payment: {
            create: {
              provider: "COD",
              status: "pending",
              amount: new Prisma.Decimal(total),
            },
          },
        },
        select: { id: true },
      });

      // Best-effort stock decrement (first inventory row per variant).
      for (const item of cart.items) {
        const inv = await tx.inventoryItem.findFirst({
          where: { variantId: item.variantId },
          orderBy: { quantity: "desc" },
        });
        if (inv) {
          await tx.inventoryItem.update({
            where: { id: inv.id },
            data: { quantity: Math.max(0, inv.quantity - item.quantity) },
          });
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });
      return order.id;
    });

    await clearCart(storeId); // remove the cart cookie
    return { ok: true, orderId };
  } catch (error) {
    console.error("Checkout failed", error);
    return { ok: false, reason: "error" };
  }
}

/** Public order confirmation lookup (store-scoped). */
export async function getOrderForStore(storeId: string, orderId: string) {
  const db = getDb();
  return db.order.findFirst({
    where: { id: orderId, storeId },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });
}
