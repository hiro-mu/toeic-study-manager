import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TOEIC Study Manager",
  description: "TOEICの学習を管理するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} antialiased`}>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js" />
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
          {children}
        </div>
      </body>
    </html>
  );
}
