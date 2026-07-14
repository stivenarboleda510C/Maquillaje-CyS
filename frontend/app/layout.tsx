import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import WhatsappButton from "@/components/WhatsappButton";
import AuthHashRedirect from "@/components/AuthHashRedirect";
import { CartProvider } from "@/lib/cart/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Makeup Pinklu",
  description: "Catalogo de productos de maquillaje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-pink-50/40">
        <AuthHashRedirect />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <WhatsappButton />
        </CartProvider>
      </body>
    </html>
  );
}
