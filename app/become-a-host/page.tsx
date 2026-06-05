// Become a host page at /become-a-host.
// Reuses Header, Footer, ChatWidget, and the InquiryForm component.

import type { Metadata } from "next";
import { Award, Calendar, MessageCircle } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ChatWidget from "@/app/components/ChatWidget";
import Eyebrow from "@/app/components/ui/Eyebrow";
import InquiryForm from "@/app/components/InquiryForm";

export const metadata: Metadata = {
  title: "Become a host | M&S Hosting",
  description:
    "Have a property in the Greater Toronto Area? Let Madeline and Samuel Jean-Louis take the day-to-day off your hands.",
};

// Three reassurance points shown on the page.
// Each is [icon, headline, subtitle].
const PERKS: [React.ComponentType<{ size?: number; className?: string }>, string, string][] = [
  [Award,         "Hosted in person",        "Real humans, not a faceless property manager."],
  [Calendar,      "Day-to-day off your plate", "Bookings, cleanings, repairs, and check-ins, all handled."],
  [MessageCircle, "One number to call",      "You text us about your home. We text everyone else."],
];

export default function BecomeAHost() {
  return (
    <>
      <Header />

      <main className="max-w-[1320px] mx-auto px-6 pt-12 pb-[110px] max-md:px-5 max-md:pt-6 max-md:pb-[70px]">

        {/* Two-column layout: pitch on the left, form card on the right */}
        <div
          className="grid gap-12 max-lg:grid-cols-1"
          style={{ gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 1fr)" }}
        >

          {/* LEFT: the pitch */}
          <div>
            <Eyebrow>Become a host</Eyebrow>
            <h1
              className="font-display m-0 leading-[1.02] text-moss"
              style={{ fontSize: "clamp(44px, 6vw, 78px)" }}
            >
              Your home,{" "}
              <span className="italic text-clay">looked after.</span>
            </h1>

            <p className="mt-8 text-[18px] leading-[1.75] text-ink-soft m-0 max-w-[560px]">
              We are a small, family-run hosting team. We do not chase volume.
              We take on homes we would be proud to stay in ourselves, in cities
              we know well, and we host them the way the owner would if they had
              the time.
            </p>

            <p className="mt-5 text-[18px] leading-[1.75] text-ink-soft m-0 max-w-[560px]">
              If that sounds like the kind of partnership you are looking for,
              send us a note. We will reach out, ask a few questions, and walk
              you through what hosting with us looks like.
            </p>

            {/* Perks list */}
            <div className="mt-10 flex flex-col gap-5 max-w-[560px]">
              {PERKS.map(([Icon, headline, subtitle], i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-clay/10 rounded-xl p-3 shrink-0">
                    <Icon size={20} className="text-clay" />
                  </div>
                  <div>
                    <div className="font-display text-[22px] text-moss leading-[1.2] mb-1">
                      {headline}
                    </div>
                    <div className="text-[14px] text-ink-soft leading-[1.55]">
                      {subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: form card, sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-bone border border-line rounded-[22px] p-7 shadow-[0_18px_44px_-22px_rgba(31,37,33,0.18)]">
              <Eyebrow>Tell us about your home</Eyebrow>
              <div
                className="font-display text-moss leading-[1.1] mb-6"
                style={{ fontSize: "clamp(24px, 2.8vw, 30px)" }}
              >
                Start the{" "}
                <span className="italic text-clay">conversation.</span>
              </div>

              <InquiryForm
                subject="Become a host"
                messagePlaceholder="Tell us a little about your property: where it is, how many bedrooms, and what you are hoping for from a hosting partner."
                submitLabel="Send application"
                footnote="We reply to every host enquiry personally, usually within a day."
                extraField={{
                  label: "Property address",
                  name: "property_address",
                  placeholder: "City and neighbourhood is fine to start",
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}