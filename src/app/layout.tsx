import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
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
  title: "System Steel Engineering | Advanced Steel Solutions in UAE",
  description: "System Steel Engineering delivers excellence in steel fabrication and structural engineering across the UAE. Explore our advanced solutions tailored to your needs.",
  keywords: "Steel Engineering, Steel Fabrication, Structural Engineering, UAE Steel Solutions",
  openGraph: {
    title: "System Steel Engineering | Advanced Steel Solutions in UAE",
    description: "Delivering excellence in steel fabrication and structural engineering across the UAE.",
    url: "https://www.systemsteelengg.com/",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.systemsteelengg.com/hero.jpg",
        width: 1200,
        height: 630,
        alt: "System Steel Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Steel Engineering | Advanced Steel Solutions in UAE",
    description: "Delivering excellence in steel fabrication and structural engineering across the UAE.",
    images: ["https://www.systemsteelengg.com/hero.jpg"],
  },
  metadataBase: new URL("https://www.systemsteelengg.com/"),
  robots: "index, follow",
  authors: [{ name: "System Steel Engineering", url: "https://www.systemsteelengg.com/" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "System Steel Engineering",
              "url": "https://www.systemsteelengg.com/",
              "logo": "https://www.systemsteelengg.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+971 6 5362000",
                "contactType": "customer service",
                "areaServed": "AE",
                "availableLanguage": "English, Arabic",
              },
              "sameAs": [
                "https://www.linkedin.com/company/system-steel-engineering",
                "https://twitter.com/systemsteelengg",
                // Add other social profiles here
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
