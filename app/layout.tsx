import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import TawkScript from "./components/TawkScript";
import MobileNav from "./components/MobileNav";
import JsonLd from "./components/JsonLd";
import { SITE_URL, SITE_NAME, PHONE, EMAIL, INSTAGRAM, abs } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_CA",
    images: [{ url: "/stays/hot-tub-oasis/01.webp", width: 1200, height: 962 }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  title: "M&S Hosting Solutions | Boutique Stays across Ontario",
  description:
    "Carefully kept homes across Ontario, hosted in person by Sam and Maddie Jean-Louis. Settle in. Stay a while.",
  appleWebApp: { capable: true, title: "M&S Hosting", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#3D4A3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
    >
      <body className="pb-[68px] md:pb-0">
        {children}
        <MobileNav />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: SITE_NAME,
            url: SITE_URL,
            logo: abs("/icons/icon-512.png"),
            image: abs("/stays/hot-tub-oasis/01.webp"),
            telephone: PHONE,
            email: EMAIL,
            sameAs: [INSTAGRAM],
            areaServed: "Ontario, Canada",
            founder: [{ "@type": "Person", name: "Madeline Jean-Louis" }, { "@type": "Person", name: "Samuel Jean-Louis" }],
          }}
        />
        {/* Tawk.to live chat widget. Loads on every page automatically,
            no need to drop <ChatWidget /> in each page. */}
        <TawkScript />
      </body>
    </html>
  );
}