// Cancellations page at /cancellations.

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
// import ChatWidget from "@/app/components/ChatWidget";
import Eyebrow from "@/app/components/ui/Eyebrow";
import InquiryForm from "@/app/components/InquiryForm";
import { DIRECT_CANCELLATION, DIRECT_HOUSE_RULES } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Cancel a booking | M&S Hosting",
  description:
    "Need to cancel a stay or change your dates? Reach out and we will help you sort it.",
};

export default function CancellationsPage() {
  return (
    <>
      <Header />

      <main className="max-w-[1320px] mx-auto px-6 pt-8 pb-[110px] max-md:px-5 max-md:pt-6 max-md:pb-[70px]">

        <Link
          href="/"
          className="underline-link inline-flex items-center gap-1.5 text-ink-soft text-sm no-underline mb-6"
        >
          <ChevronLeft size={14} /> Back home
        </Link>

        <div className="max-w-[700px] mx-auto">

          <Eyebrow>Cancellations</Eyebrow>

          <h1
            className="font-display m-0 leading-[1.05] text-moss"
            style={{ fontSize: "clamp(40px, 5.5vw, 64px)" }}
          >
            Need to{" "}
            <span className="italic text-clay">change a stay?</span>
          </h1>

          <p className="mt-7 text-[17px] leading-[1.75] text-ink-soft m-0">
            Life happens. If you need to cancel or move your dates, send us
            a quick note with the details and Sam or Maddie will reply directly
            with options.
          </p>

          <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft m-0">
            Helpful things to include: the property name, your original check-in
            date, and whether you are hoping to cancel outright or shift to a
            different week. We do our best to be flexible.
          </p>

          {/* Direct-booking policy (linked from the Book now panel) */}
          <section id="direct" className="mt-10 scroll-mt-24 rounded-[22px] border border-line p-7">
            <Eyebrow>Booked direct with us</Eyebrow>
            <h2 className="m-0 mb-4 font-display text-[28px] leading-tight text-moss">
              Hot Tub Oasis: <span className="italic text-clay">{DIRECT_CANCELLATION.name} policy</span>
            </h2>
            <p className="m-0 mb-3 text-[14px] text-ink-soft">The same policy as the home&apos;s Airbnb listing:</p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-2.5 p-0">
              {DIRECT_CANCELLATION.rules.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[14px] leading-[1.6] text-ink">
                  <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rotate-45 bg-clay" /> {r}
                </li>
              ))}
            </ul>
            <h3 className="m-0 mb-3 font-display text-[21px] text-moss">House rules</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {DIRECT_HOUSE_RULES.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[14px] leading-[1.6] text-ink-soft">
                  <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rotate-45 bg-amber" /> {r}
                </li>
              ))}
            </ul>
            <p className="m-0 mt-5 text-[13px] text-ink-soft">
              Booked on Airbnb or another platform? Cancel through that platform, where its policy applies.
              Questions either way, send us a note below.
            </p>
          </section>

          <div className="mt-10 bg-bone border border-line rounded-[22px] p-7 shadow-[0_18px_44px_-22px_rgba(31,37,33,0.18)]">
            <Eyebrow>Send a cancellation request</Eyebrow>
            <div
              className="font-display text-moss leading-[1.1] mb-6"
              style={{ fontSize: "clamp(24px, 2.8vw, 30px)" }}
            >
              Tell us what is{" "}
              <span className="italic text-clay">going on.</span>
            </div>

            <InquiryForm
              inquiryType="cancellation"
              subject="Cancellation"
              messagePlaceholder="Property name, original dates, and your reason for changing or cancelling."
              submitLabel="Send cancellation request"
              footnote="We reply to every cancellation request the same day."
              extraField={{
                label: "Original booking date",
                name: "booking_date",
                placeholder: "e.g. Mar 14 to Mar 17, 2026",
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
      {/* <ChatWidget /> */}
    </>
  );
}