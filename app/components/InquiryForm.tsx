// Reusable enquiry form. Submits to /api/inquiries which writes to Supabase.
// Handles idle / submitting / success / error states.
//
// "use client" because we manage form state and call fetch from the browser.
"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";

export type InquiryFormProps = {
  // Submission type, distinguishes rows in the inquiries table.
  inquiryType: "contact" | "property" | "host" | "cancellation";

  subject: string;
  messagePlaceholder: string;
  submitLabel?: string;
  footnote?: string;

  extraField?: {
    label: string;
    name: string;
    placeholder: string;
  };

  // Optional property slug, included with property-type submissions.
  propertySlug?: string;

  // Show check-in / check-out / guests (request-to-book forms).
  // Sent as booking_date, e.g. "2026-12-04 to 2026-12-06, 4 guests".
  askDates?: { maxGuests: number };
};

type FormValues = {
  name: string;
  email: string;
  extra: string;
  message: string;
  marketingConsent: boolean;
  checkin: string;
  checkout: string;
  guests: number;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export default function InquiryForm({
  inquiryType,
  subject,
  messagePlaceholder,
  submitLabel = "Send message",
  footnote,
  extraField,
  propertySlug,
  askDates,
}: InquiryFormProps) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    extra: "",
    message: "",
    marketingConsent: false,
    checkin: "",
    checkout: "",
    guests: 1,
  });

  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (askDates && values.checkin && values.checkout && values.checkout <= values.checkin) {
      setState({ kind: "error", message: "Check-out needs to be after check-in." });
      return;
    }
    setState({ kind: "submitting" });

    const payload: Record<string, unknown> = {
      type: inquiryType,
      name: values.name,
      email: values.email,
      subject,
      message: values.message,
      marketing_consent: values.marketingConsent,
    };

    if (extraField && values.extra) {
      payload[extraField.name] = values.extra;
    }
    if (propertySlug) {
      payload.property_slug = propertySlug;
    }
    if (askDates && (values.checkin || values.checkout)) {
      payload.booking_date = `${values.checkin || "?"} to ${values.checkout || "?"}, ${values.guests} guest${values.guests === 1 ? "" : "s"}`;
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setState({
          kind: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setState({
        kind: "success",
        message: data.message ?? "Thank you. We will be in touch soon.",
      });

      setValues({
        name: "",
        email: "",
        extra: "",
        message: "",
        marketingConsent: false,
        checkin: "",
        checkout: "",
        guests: 1,
      });
    } catch (err) {
      console.error("Submit failed:", err);
      setState({
        kind: "error",
        message: "Could not reach the server. Check your connection and try again.",
      });
    }
  };

  if (state.kind === "success") {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-clay/15 mb-4">
          <Check size={26} className="text-clay" />
        </div>
        <div className="font-display text-[24px] text-moss leading-[1.2] mb-3">
          Message received.
        </div>
        <p className="text-[14px] text-ink-soft leading-[1.65] m-0 max-w-[340px] mx-auto mb-6">
          {state.message}
        </p>
        <button
          onClick={() => setState({ kind: "idle" })}
          className="bg-transparent text-clay border border-clay px-5 py-2.5 rounded-full text-[13px] font-medium cursor-pointer hover:bg-clay hover:text-bone transition-colors"
        >
          Send another
        </button>
      </div>
    );
  }

  const isSubmitting = state.kind === "submitting";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div>
        <label className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">
          Your name
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="Jane Doe"
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          disabled={isSubmitting}
          className="w-full px-[15px] py-[13px] border border-line rounded-xl bg-transparent text-sm text-ink font-body transition-colors disabled:opacity-60"
        />
      </div>

      <div>
        <label className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="jane@example.com"
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          disabled={isSubmitting}
          className="w-full px-[15px] py-[13px] border border-line rounded-xl bg-transparent text-sm text-ink font-body transition-colors disabled:opacity-60"
        />
      </div>

      {extraField && (
        <div>
          <label className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">
            {extraField.label}
          </label>
          <input
            type="text"
            name={extraField.name}
            placeholder={extraField.placeholder}
            value={values.extra}
            onChange={(e) => updateField("extra", e.target.value)}
            disabled={isSubmitting}
            className="w-full px-[15px] py-[13px] border border-line rounded-xl bg-transparent text-sm text-ink font-body transition-colors disabled:opacity-60"
          />
        </div>
      )}

      {askDates && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="iq-in" className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">Check-in</label>
            <input
              id="iq-in" type="date" required value={values.checkin}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={(e) => updateField("checkin", e.target.value)} disabled={isSubmitting}
              className="w-full px-[15px] py-[13px] border border-line rounded-xl bg-transparent text-sm text-ink font-body disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="iq-out" className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">Check-out</label>
            <input
              id="iq-out" type="date" required value={values.checkout}
              min={values.checkin || new Date().toLocaleDateString("en-CA")}
              onChange={(e) => updateField("checkout", e.target.value)} disabled={isSubmitting}
              className="w-full px-[15px] py-[13px] border border-line rounded-xl bg-transparent text-sm text-ink font-body disabled:opacity-60"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="iq-guests" className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">Guests</label>
            <select
              id="iq-guests" value={values.guests} disabled={isSubmitting}
              onChange={(e) => updateField("guests", Number(e.target.value))}
              className="w-full px-[15px] py-[13px] border border-line rounded-xl bg-transparent text-sm text-ink font-body disabled:opacity-60"
            >
              {Array.from({ length: askDates.maxGuests }, (_, n) => n + 1).map((n) => (
                <option key={n} value={n}>{n} guest{n === 1 ? "" : "s"}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">
          Message
        </label>
        <textarea
          rows={5}
          name="message"
          required
          minLength={10}
          placeholder={messagePlaceholder}
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          disabled={isSubmitting}
          className="w-full px-[15px] py-[13px] border border-line rounded-xl bg-transparent text-sm text-ink font-body resize-y transition-colors disabled:opacity-60"
        />
      </div>

      <label className="flex items-start gap-2.5 text-[12px] text-ink-soft cursor-pointer leading-[1.5]">
        <input
          type="checkbox"
          name="marketing_consent"
          checked={values.marketingConsent}
          onChange={(e) => updateField("marketingConsent", e.target.checked)}
          disabled={isSubmitting}
          className="mt-0.5 accent-clay shrink-0"
        />
        <span>
          Yes, send me occasional emails about new homes and seasonal offers.
          You can unsubscribe anytime.
        </span>
      </label>

      {state.kind === "error" && (
        <div className="bg-clay/10 border border-clay/30 text-ink rounded-xl px-4 py-3 text-[13px] leading-[1.5]">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-clay text-bone border-none p-[15px] rounded-xl text-sm font-medium cursor-pointer mt-1 flex items-center justify-center gap-2 tracking-[0.02em] disabled:opacity-70 disabled:cursor-wait"
      >
        {isSubmitting ? "Sending..." : (
          <>
            {submitLabel} <Send size={14} />
          </>
        )}
      </button>

      {footnote && (
        <p className="text-[12px] text-ink-soft mt-1 leading-[1.5] m-0">
          {footnote}
        </p>
      )}
    </form>
  );
}