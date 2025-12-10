import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-primary text-primary-foreground">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black">
          <main className="mx-auto max-w-4xl px-6 py-16 text-left text-slate-100">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
