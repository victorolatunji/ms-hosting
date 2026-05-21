import type { Metadata } from "next";
// next/font/google loads fonts at build time and serves them from your domain.
// Each font gets a CSS variable that we wired into globals.css earlier.
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

// Display font, used for headlines (Cormorant Garamond).
// We load multiple weights and both upright + italic since the design
// uses italic for accent words like "Stay a while."
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",           // matches the variable name in globals.css
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],   // weights actually used in the design
  style: ["normal", "italic"],
  display: "swap",                        // show fallback font instantly, swap when loaded
});

// Body font, used for paragraphs and most UI text (DM Sans).
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Mono font, used for small uppercase labels (DM Mono).
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// SEO metadata. Next.js puts these in the <head> automatically.
// We'll expand this later in Phase 5 (SEO polish), this is enough for now.
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
    // The three font variables get attached to the <html> tag so they're
    // available everywhere. antialiased smooths font rendering on macOS.
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}