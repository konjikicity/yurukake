import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Hiragino Maru Gothic ProN", "Noto Sans JP", "sans-serif"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ゆるかけ",
  description: "ゆるい家計簿",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#201e1c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${zenMaru.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
