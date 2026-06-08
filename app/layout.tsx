import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import TawkScript from "./components/TawkScript";

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
  title: "M&S Hosting Solutions | Boutique Stays in the Greater Toronto Area",
  description:
    "Eleven carefully kept homes across seven GTA cities, hosted in person by Madeline and Samuel Jean-Louis. Settle in. Stay a while.",
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
      <body>
        {children}
        {/* Tawk.to live chat widget. Loads on every page automatically,
            no need to drop <ChatWidget /> in each page. */}
        <TawkScript />
      </body>
    </html>
  );
}