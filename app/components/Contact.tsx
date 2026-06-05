// Homepage Contact section. Uses the shared InquiryForm component for
// the actual form, so all submission/loading/success/error logic is in one place.

import { Phone, Mail } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import InquiryForm from "./InquiryForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 pt-10 pb-[110px] max-md:px-5 max-md:py-[70px]"
    >
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

        <div
          className="grid gap-14 relative"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >

          {/* LEFT: pitch + contact methods */}
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

          {/* RIGHT: the form, powered by the shared InquiryForm.
              inquiryType="contact" tags submissions in the database as
              homepage contact submissions, easy to filter later. */}
          <div>
            <InquiryForm
              inquiryType="contact"
              subject="Homepage contact form"
              messagePlaceholder="Tell us about your stay"
              submitLabel="Send message"
            />
          </div>
        </div>
      </div>
    </section>
  );
}