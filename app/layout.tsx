import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

export const metadata: Metadata = {
  title: "Owzars Commerce",
  description: "E-commerce foundation powered by Next.js 14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
          <Navbar />
          <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:pt-14 lg:max-w-7xl">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
