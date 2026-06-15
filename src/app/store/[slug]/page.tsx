import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/repositories/stores";
import { getCartCount } from "@/lib/repositories/cart";
import { Storefront } from "@/components/storefront/storefront";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "Store not found" };
  const title = store.name;
  const description = store.tagline ?? `Shop ${store.name} online.`;
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  const cartCount = await getCartCount(store.id);
  return <Storefront store={store} cartCount={cartCount} />;
}
