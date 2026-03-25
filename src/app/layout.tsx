import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import BottomNav from "@/components/Layout/BottomNav";
import AuthGuard from "@/components/Account/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MITAME-BODY",
  description: "A beautiful body building and health tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <AuthGuard>
            {/* Main content area with padding bottom to accommodate the nav */}
            <main className="min-h-screen pb-20 max-w-md mx-auto relative overflow-x-hidden">
              {children}
            </main>
            
            <div className="max-w-md mx-auto relative">
              <BottomNav />
            </div>
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}
