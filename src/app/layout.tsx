import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CookieConsentBanner } from "@/components/gdpr/cookie-consent";

// BRAND-3: Font instellen op Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// BRAND-1 & BRAND-5: Hernoemd naar Commissi met tagline
export const metadata: Metadata = {
  title: "Commissi — Commission Management Platform",
  description: "Your commissions. Your team. Crystal clear. Complete commission management platform for modern sales teams.",
  keywords: ["commissions", "sales", "CRM", "team management", "commission tracking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
