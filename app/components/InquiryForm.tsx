// Reusable enquiry form, used on:
//   - /become-a-host
//   - /cancellations
//   - eventually the homepage contact section and per-property enquiries
//
// Renders a name + email + (optional extra) + message form,
// pre-filled with a subject that callers control via props.
//
// Form submission is stubbed for now (preventDefault only).
// Phase 3 wires this to Supabase + Resend.
//
// "use client" because the submit handler runs in the browser.
"use client";

import { Send } from "lucide-react";
import Field from "./ui/Field";

// What the caller has to specify when using this form.
// Each page provides different copy and a different pre-filled subject.
export type InquiryFormProps = {
  // What the subject of the submission should be, e.g. "Become a host"
  subject: string;

  // Placeholder text inside the big message textarea
  messagePlaceholder: string;

  // The text on the submit button, e.g. "Send application"
  submitLabel?: string;

  // Optional small reassurance line under the button.
  // If not provided, no line shows.
  footnote?: string;

  // Optional extra field rendered between email and message.
  // Used by /become-a-host for "Property address" for example.
  // null means no extra field.
  extraField?: {
    label: string;
    name: string;
    placeholder: string;
  };
};

export default function InquiryForm({
  subject,
  messagePlaceholder,
  submitLabel = "Send message",
  footnote,
  extraField,
}: InquiryFormProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4"
    >
      {/* Standard fields */}
      <Field label="Your name" placeholder="Jane Doe"         name="name"  />
      <Field label="Email"     placeholder="jane@example.com" name="email" type="email" />

      {/* Optional extra field (e.g. "Property address" for become-a-host) */}
      {extraField && (
        <Field
          label={extraField.label}
          placeholder={extraField.placeholder}
          name={extraField.name}
        />
      )}

      {/* Subject is hidden and pre-filled. When Phase 3 wires this up,
          the subject travels with the submission so Maddie and Sam know
          which kind of form was sent without reading the message. */}
      <input type="hidden" name="subject" value={subject} />

      {/* Message textarea, big and resizable */}
      <div>
        <label className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">
          Message
        </label>
        <textarea
          rows={5}
          name="message"
          placeholder={messagePlaceholder}
          className="
            w-full px-[15px] py-[13px]
            border border-line rounded-xl
            bg-transparent text-sm text-ink font-body
            resize-y transition-colors
          "
        />
      </div>

      {/* CASL-compliant marketing opt-in, same as the homepage contact form */}
      <label className="flex items-start gap-2.5 text-[12px] text-ink-soft cursor-pointer leading-[1.5]">
        <input
          type="checkbox"
          name="marketing_consent"
          className="mt-0.5 accent-clay shrink-0"
        />
        <span>
          Yes, send me occasional emails about new homes and seasonal offers.
          You can unsubscribe anytime.
        </span>
      </label>

      {/* Submit button */}
      <button
        type="submit"
        className="
          bg-clay text-bone border-none p-[15px] rounded-xl
          text-sm font-medium cursor-pointer mt-1
          flex items-center justify-center gap-2
          tracking-[0.02em]
        "
      >
        {submitLabel} <Send size={14} />
      </button>

      {/* Optional small reassurance below the button */}
      {footnote && (
        <p className="text-[12px] text-ink-soft mt-1 leading-[1.5] m-0">
          {footnote}
        </p>
      )}
    </form>
  );
}