// Cancellations page at /cancellations.
// Uses the same InquiryForm component as become-a-host, just different copy.

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ChatWidget from "@/app/components/ChatWidget";
import Eyebrow from "@/app/components/ui/Eyebrow";
import InquiryForm from "@/app/components/InquiryForm";

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

        {/* Back link */}
        <Link
          href="/"
          className="underline-link inline-flex items-center gap-1.5 text-ink-soft text-sm no-underline mb-6"
        >
          <ChevronLeft size={14} /> Back home
        </Link>

        {/* Centered, narrow column. This page is shorter and simpler. */}
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
            a quick note with the details and Maddie or Sam will reply directly
            with options.
          </p>

          <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft m-0">
            Helpful things to include: the property name, your original check-in
            date, and whether you are hoping to cancel outright or shift to a
            different week. We do our best to be flexible.
          </p>

          {/* Form card */}
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
      <ChatWidget />
    </>
  );
}