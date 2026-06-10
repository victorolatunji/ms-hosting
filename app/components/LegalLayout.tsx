// Shared shell for the legal pages (terms, privacy, cookies).
// Branded prose column with a title, last-updated line, Header + Footer.
// Server component.
//
// Place at: /app/components/LegalLayout.tsx

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Eyebrow from "@/app/components/ui/Eyebrow";

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
        <div className="legal-prose text-ink-soft text-[15px] leading-[1.75] [&_h2]:font-display [&_h2]:text-moss [&_h2]:text-[24px] [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:leading-tight [&_p]:mb-4 [&_ul]:my-4 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-2 [&_a]:text-clay [&_a]:no-underline hover:[&_a]:underline [&_strong]:text-ink">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}