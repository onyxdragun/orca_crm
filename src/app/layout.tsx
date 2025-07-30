import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomerProviderWrapper from "@/components/ClientProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orca CRM",
  description: "Customer Relationship Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Only render children here; move LoginHeader to a Client Component wrapper
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomerProviderWrapper>
          {children}
        </CustomerProviderWrapper>
      </body>
    </html>
  );
}
