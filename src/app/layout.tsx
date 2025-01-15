import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Hoster",
  description:
    "Бесплатный хостинг изображений. Загрузите ваши файлы и получите ссылку на них. Хранение файлов в хранилище.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="+nxGUDJ4QpAZ5l9Bsjdi102tLVC21AIh5d1Nl23908vVuFHs34="
        />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="notranslate" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F7F7F7]`}
      >
        {children}
        <Toaster />

        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-J67JRXKMNX`}
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {` 
          window.dataLayer = window.dataLayer || []; 
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date()); 
          gtag('config', 'G-J67JRXKMNX'); 
        `}
        </Script>
      </body>
    </html>
  );
}
