import { MessageCircle } from "lucide-react";

/** Always-visible WhatsApp order button (bottom-right). Renders only if the
 *  store has a WhatsApp number. */
export function FloatingWhatsApp({
  whatsapp,
  storeName,
}: {
  whatsapp: string | null;
  storeName: string;
}) {
  if (!whatsapp) return null;
  const digits = whatsapp.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    `Hi ${storeName}, I'd like to order.`,
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-bold text-white shadow-xl transition hover:scale-105 hover:shadow-2xl"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
