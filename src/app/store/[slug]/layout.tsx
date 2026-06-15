import { getStoreBySlug } from "@/lib/repositories/stores";
import { FloatingWhatsApp } from "@/components/storefront/floating-whatsapp";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  return (
    <>
      {children}
      {store ? (
        <FloatingWhatsApp whatsapp={store.whatsapp} storeName={store.name} />
      ) : null}
    </>
  );
}
