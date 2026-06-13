import { z } from "zod";
import { Prisma } from "@prisma/client";

/** Normalizes a price input (strips thousands separators) to a decimal string.
 *  Throws on non-numeric/negative input so Prisma.Decimal never receives junk. */
export function normalizePrice(input: string | number): string {
  const s = String(input).replace(/,/g, "").trim();
  if (s === "" || !Number.isFinite(Number(s)) || Number(s) < 0) {
    throw new Error("Invalid price");
  }
  return s;
}

/** Zod field for a money value: accepts string or number, rejects non-numeric
 *  or negative values at the API boundary (returns a clean 400 instead of 500). */
export const zPrice = z
  .union([z.string(), z.number()])
  .refine((v) => {
    const s = String(v).replace(/,/g, "").trim();
    return s !== "" && Number.isFinite(Number(s)) && Number(s) >= 0;
  }, "Price must be a non-negative number");

/** True if the error is a Prisma unique-constraint violation (P2002). */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}
