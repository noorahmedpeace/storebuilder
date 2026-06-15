import { getStoreByDomain } from "@/lib/repositories/domains";
import { FloatingWhatsApp } from "@/components/storefront/floating-whatsapp";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ host: string }>;
}) {
  const { host } = await params;
  const store = await getStoreByDomain(decodeURIComponent(host));
  return (
    <>
      {children}
      {store ? (
        <FloatingWhatsApp whatsapp={store.whatsapp} storeName={store.name} />
      ) : null}
    </>
  );
}
