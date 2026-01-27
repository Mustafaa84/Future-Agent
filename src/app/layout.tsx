import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Future Agent - Best AI Tools Directory",
  description: "Discover, compare, and choose the best AI tools for your business",
  verification: {
    google: "k28eQUOs-d5KFpnILWmjddnL4bEb9NdIQi6jV_SGiL4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-29T82L88EK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-29T82L88EK');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AnalyticsTracker />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
