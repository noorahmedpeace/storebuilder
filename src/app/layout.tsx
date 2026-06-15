import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Lora,
  Manrope,
  Montserrat,
  Outfit,
  Playfair_Display,
  Poppins,
  Plus_Jakarta_Sans,
  Sora,
  Space_Grotesk,
} from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Storefront-selectable fonts (exposed as CSS variables, applied per store).
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const spaceGrotesk = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

const fontVars = [
  inter,
  poppins,
  montserrat,
  manrope,
  plusJakarta,
  outfit,
  sora,
  spaceGrotesk,
  playfair,
  lora,
]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "StoreBuilder Cloud | Online Store Builder",
  description:
    "Create an ecommerce website, manage orders, accept payments, automate marketing, and grow with AI from one SEO-first online store builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fontVars} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
