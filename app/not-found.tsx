// Global 404 page. Rendered automatically by Next.js when:
//   - A URL doesn't match any route
//   - notFound() is called inside a page (e.g. invalid property or city slug)
//
// Server component, fully static, no interactivity needed.

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Eyebrow from "@/app/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="min-h-[70vh] flex items-center px-6 max-md:px-5">
        <div className="max-w-[1320px] mx-auto w-full">
          <div className="max-w-[640px]">
            <Eyebrow>404</Eyebrow>

            <h1
              className="font-display m-0 leading-[1.02] text-moss"
              style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
            >
              That home seems to have{" "}
              <span className="italic text-clay">moved on.</span>
            </h1>

            <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft m-0">
              The page you were looking for is no longer here. Maybe you followed
              an old link, or maybe it never existed in the first place. Either
              way, we would be glad to point you somewhere useful.
            </p>

            {/* Two link cards: back to all stays, back to homepage */}
            <div className="mt-10 grid gap-4 max-w-[520px] sm:grid-cols-2">
              <Link
                href="/#stays"
                className="lift bg-bone border border-line rounded-[18px] p-6 no-underline text-ink cursor-pointer block"
              >
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-clay mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-clay rotate-45 inline-block" />
                  Browse
                </div>
                <div className="font-display text-[22px] text-moss leading-[1.15] mb-2">
                  All eleven stays
                </div>
                <div className="text-[13px] text-ink-soft flex items-center gap-1.5">
                  See the collection <ChevronRight size={13} />
                </div>
              </Link>

              <Link
                href="/"
                className="lift bg-moss border border-moss rounded-[18px] p-6 no-underline text-bone cursor-pointer block"
              >
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-amber mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber rotate-45 inline-block" />
                  Home
                </div>
                <div className="font-display text-[22px] text-bone leading-[1.15] mb-2">
                  Start from the top
                </div>
                <div className="text-[13px] text-bone/70 flex items-center gap-1.5">
                  Take me there <ChevronRight size={13} />
                </div>
              </Link>
            </div>

            {/* Contact fallback, in case the link they wanted is really gone.
                Apostrophes rewritten as plain prose to avoid ESLint's
                no-unescaped-entities rule. */}
            <p className="mt-10 text-[13px] text-ink-soft">
              Still hunting for something specific?{" "}
              <Link href="/#contact" className="underline-link text-ink no-underline">
                Send us a quick message
              </Link>{" "}
              and Maddie or Sam will track it down.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}