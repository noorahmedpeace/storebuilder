import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreByDomain } from "@/lib/repositories/domains";
import { Storefront } from "@/components/storefront/storefront";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ host: string }>;
}): Promise<Metadata> {
  const { host } = await params;
  const store = await getStoreByDomain(decodeURIComponent(host));
  if (!store) return { title: "Store not found" };
  const title = store.name;
  const description = store.tagline ?? `Shop ${store.name} online.`;
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function DomainStorefrontPage({
  params,
}: {
  params: Promise<{ host: string }>;
}) {
  const { host } = await params;
  const store = await getStoreByDomain(decodeURIComponent(host));
  if (!store) notFound();
  return <Storefront store={store} />;
}
