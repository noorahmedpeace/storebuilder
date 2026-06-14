import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Lora,
  Montserrat,
  Playfair_Display,
  Poppins,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

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
const spaceGrotesk = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

const fontVars = [inter, poppins, montserrat, spaceGrotesk, playfair, lora]
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
