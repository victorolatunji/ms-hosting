"use client";
// Client component because the form needs onSubmit to preventDefault.
// In Phase 3 we'll wire this to React Hook Form + Zod + Resend + Supabase.

import { Phone, Mail, Send } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import Field from "./ui/Field";

export default function Contact() {
  return (
    // id="contact" so the header's #contact nav link scrolls here
    <section
      id="contact"
      className="px-6 pt-10 pb-[110px] max-md:px-5 max-md:py-[70px]"
    >
      {/* The contact card itself. Centered, max width, lots of padding. */}
      <div
        className="
          max-w-[980px] mx-auto bg-bone border border-line rounded-[26px]
          relative overflow-hidden
          shadow-[0_30px_60px_-30px_rgba(31,37,33,0.15)]
          max-sm:px-8 max-sm:py-8
        "
        style={{ padding: "clamp(32px, 5vw, 60px)" }}
      >
        {/* Decorative clay circle in the top-right corner */}
        <div className="absolute -top-[80px] -right-[80px] w-[220px] h-[220px] rounded-full bg-clay/6" />

        {/* Two-column grid: pitch on the left, form on the right */}
        <div
          className="grid gap-14 relative"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >

          {/* LEFT COLUMN: eyebrow, heading, intro, contact links */}
          <div>
            <Eyebrow>Say hello</Eyebrow>
            <h2
              className="font-display m-0 mb-5 leading-[1.1] text-moss"
              style={{ fontSize: "clamp(32px, 4vw, 44px)" }}
            >
              Questions? <span className="italic text-clay">Just ask.</span>
            </h2>
            <p className="text-[15px] leading-[1.65] text-ink-soft mb-8">
              Send a booking enquiry and Maddie or Sam will reply within the hour
              during the day, or first thing the next morning.
            </p>

            {/* Phone and email links. Clay icons, ink text, underline-on-hover. */}
            <div className="flex flex-col gap-3.5 text-sm">
              <a
                href="tel:9059226538"
                className="underline-link inline-flex items-center gap-2.5 text-ink no-underline self-start"
              >
                <Phone size={15} className="text-clay" /> (905) 922 6538
              </a>
              <a
                href="mailto:info.mshostingsolutions@gmail.com"
                className="underline-link inline-flex items-center gap-2.5 text-ink no-underline self-start"
              >
                <Mail size={15} className="text-clay" /> info.mshostingsolutions@gmail.com
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: the form.
              onSubmit preventDefault is a stub; real submission happens in Phase 3. */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            <Field label="Your name"  placeholder="Jane Doe"          name="name"    />
            <Field label="Email"      placeholder="jane@example.com"  name="email"   type="email" />
            <Field label="Subject"    placeholder="Booking enquiry"   name="subject" />

            {/* Textarea, doesn't use the Field component since Field is for inputs only */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">
                Message
              </label>
              <textarea
                rows={4}
                name="message"
                placeholder="Tell us about your stay"
                className="
                  w-full px-[15px] py-[13px]
                  border border-line rounded-xl
                  bg-transparent text-sm text-ink font-body
                  resize-y transition-colors
                "
              />
            </div>

            {/* CASL-compliant marketing opt-in checkbox.
                Per Canadian anti-spam law, this MUST be unchecked by default,
                and consent must be express, not bundled with the form submission.
                We'll record this flag when wiring up Supabase in Phase 3. */}
            <label className="flex items-start gap-2.5 text-[12px] text-ink-soft cursor-pointer leading-[1.5]">
              <input
                type="checkbox"
                name="marketing_consent"
                className="mt-0.5 accent-clay shrink-0"
              />
              <span>
                Yes, I&apos;d like to receive occasional emails about new homes
                and seasonal offers. You can unsubscribe anytime.
              </span>
            </label>

            {/* Submit button. Clay background, sends a paper plane icon. */}
            <button
              type="submit"
              className="
                bg-clay text-bone border-none p-[15px] rounded-xl
                text-sm font-medium cursor-pointer mt-1
                flex items-center justify-center gap-2
                tracking-[0.02em]
              "
            >
              Send message <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}