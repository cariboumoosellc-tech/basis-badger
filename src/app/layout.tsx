import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
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
  title: "Basis Badger",
  description: "Basis Badger: Forensic Audit & Savings Engine",
  alternates: {
    canonical: "https://basisbadger.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full flex items-center gap-3 px-6 py-4 border-b border-zinc-900 bg-[#0D0D0D] mb-6">
          <Image src="/logo.png" alt="Basis Badger Logo" width={40} height={40} />
          <span className="text-gray-100 font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-geist-sans, sans-serif)' }}>Basis Badger</span>
        </header>
        {children}
      </body>
    </html>
  );
}
