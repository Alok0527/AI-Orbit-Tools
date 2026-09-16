import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Tools Directory - Discover the Best AI Tools",
    template: "%s | AI Tools Directory",
  },
  description: "Explore and discover the best AI tools for writing, coding, design, marketing, productivity, and more. Search, filter, and compare 100+ AI tools.",
  keywords: ["AI tools", "artificial intelligence", "AI directory", "machine learning", "AI software"],
  authors: [{ name: "AI Orbit" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aiorbit.club",
    siteName: "AI Tools Directory",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}