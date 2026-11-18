// Shared shell for the legal pages (terms, privacy, cookies).
// Branded prose column with a title, last-updated line, Header + Footer.
// Server component.
//
// Place at: /app/components/LegalLayout.tsx

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Eyebrow from "@/app/components/ui/Eyebrow";
import { LEGAL_PROSE } from "@/app/components/legal/prose";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="max-w-[760px] mx-auto px-6 py-[90px] max-md:px-5 max-md:py-14">
        <Eyebrow>Legal</Eyebrow>
        <h1
          className="font-display m-0 leading-[1.05] text-moss mb-3"
          style={{ fontSize: "clamp(34px, 5vw, 56px)" }}
        >
          {title}
        </h1>
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-soft mb-12">
          Last updated {updated}
        </p>

        {/* Prose. Children are <section>s with h2 + p, styled via these rules. */}
        <div className={LEGAL_PROSE}>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}