import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  title: "System Steel Engineering | Premier Steel Fabrication & Engineering Solutions UAE",
  description: "UAE's leading steel fabrication company specializing in industrial steel structures, custom fabrication, welding services, and engineering solutions. Serving Dubai, Abu Dhabi, Sharjah with 20+ years of excellence in structural steel manufacturing.",
  keywords: [
    // Core Services
    "Steel Fabrication UAE",
    "Structural Steel Dubai",
    "Industrial Steel Manufacturing UAE",
    "Custom Steel Fabrication Dubai",
    "Steel Engineering Services UAE",
    
    // Specialized Services
    "Heavy Steel Structure Fabrication",
    "Precision Steel Cutting UAE",
    "Industrial Welding Services Dubai",
    "Steel Construction Solutions",
    "Metal Processing UAE",
    
    // Industry Specific
    "Oil & Gas Steel Solutions",
    "Construction Steel UAE",
    "Industrial Plant Steel Work",
    "Commercial Steel Projects Dubai",
    "Infrastructure Steel Solutions",
    
    // Location Specific
    "Steel Fabricators Dubai",
    "Abu Dhabi Steel Company",
    "Sharjah Steel Manufacturing",
    "UAE Steel Industry",
    "Middle East Steel Solutions",
    
    // Quality & Expertise
    "ISO Certified Steel Fabrication",
    "Professional Steel Engineering",
    "Expert Metal Fabrication UAE",
    "Quality Steel Manufacturing",
    "Steel Industry Leaders UAE",
    
    // Technical Specifications
    "Structural Steel Design UAE",
    "Steel Beam Fabrication",
    "Custom Metal Solutions",
    "Industrial Steel Processing",
    "Engineering Consultation UAE",
    
    // Project Types
    "Large Scale Steel Projects",
    "Industrial Steel Construction",
    "Commercial Steel Structures",
    "Custom Steel Manufacturing",
    "Steel Building Solutions"
  ].join(", "),
  openGraph: {
    title: "System Steel Engineering | UAE's Premier Steel Solutions Provider",
    description: "Leading-edge steel fabrication, engineering, and structural solutions. Trusted by major industries across UAE for precision, quality, and reliability.",
    url: "https://www.systemsteelengg.com/",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.systemsteelengg.com/About_frame.png",
        width: 1200,
        height: 630,
        alt: "System Steel Engineering - UAE's Best Steel Fabrication Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Steel Engineering | UAE's Premier Steel Solutions Provider",
    description: "Expert steel fabrication & engineering solutions. Industry leader in UAE for structural steel, custom fabrication & industrial solutions.",
    images: ["https://www.systemsteelengg.com/About_frame.png"],
  },
  alternates: {
    canonical: "https://www.systemsteelengg.com",
    languages: {
      'en-US': 'https://www.systemsteelengg.com',
      'ar-AE': 'https://www.systemsteelengg.com/ar',
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  metadataBase: new URL("https://www.systemsteelengg.com/"),
  authors: [{ name: "System Steel Engineering", url: "https://www.systemsteelengg.com/" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "ZO0LYaPIoLttVe29FHuGkztP7140i1X3JFdjRBX1M_8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
        
        {/* JSON-LD Schema for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "System Steel Engineering",
              "url": "https://www.systemsteelengg.com/",
              "logo": "https://www.systemsteelengg.com/src/About_frame.png",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+971 6 5362000",
                  "contactType": "customer service",
                  "areaServed": "AE",
                  "availableLanguage": ["English", "Arabic"],
                },
              ],
              "sameAs": [
                "https://www.linkedin.com/company/system-steel-engineering",
                "https://twitter.com/systemsteelengg",
                "https://www.facebook.com/systemsteelengg",
                "https://www.instagram.com/systemsteelengg",
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Industrial Area, Dubai",
                "addressLocality": "Dubai",
                "addressRegion": "Dubai",
                "postalCode": "00000",
                "addressCountry": "AE",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "25.276987",
                "longitude": "55.296249",
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "18:00",
                },
              ],
              "description": "Leading steel fabrication and engineering company in UAE, specializing in industrial steel structures, custom fabrication, and comprehensive engineering solutions.",
              "foundingDate": "2000",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "minValue": "50",
                "maxValue": "200"
              },
              "industry": [
                "Steel Manufacturing",
                "Construction",
                "Engineering",
                "Industrial Manufacturing"
              ],
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": "25.276987",
                  "longitude": "55.296249"
                },
                "geoRadius": "100000"
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
