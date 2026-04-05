import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "KPI Atlas — Historical Country Data",
  description: "Comprehensive historical key performance indicators tracking country progress from 1960 to present. Economy, health, education, demographics, infrastructure, environment, and social equity.",
  keywords: ["India KPIs", "historical data", "economic indicators", "World Bank", "country statistics"],
  openGraph: {
    title: "KPI Atlas — Historical Country Data",
    description: "Track 30+ indicators across 7 categories from 1960 to present",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
