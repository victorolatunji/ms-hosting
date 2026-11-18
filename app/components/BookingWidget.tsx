"use client";
// "Book now" panel for direct-booking listings (Hot Tub Oasis).
// Loads availability + pricing from /api/availability/[slug]. If direct booking
// isn't open yet (rates or Stripe not set), shows the request-to-book form instead.

import { useEffect, useMemo, useState } from "react";
import { Lock, Minus, Plus } from "lucide-react";
import InquiryForm from "./InquiryForm";
import { quote, type DirectBookingConfig } from "@/lib/direct-booking";
import { useCurrency } from "./CurrencyContext";
import { DIRECT_CANCELLATION } from "@/lib/policies";
import Link from "next/link";

type Range = { start: string; end: string };
type Config = Omit<DirectBookingConfig, "icalEnvVar">;
type Avail = { open: boolean; blocked: Range[]; config: Config };

const toDay = (s: string) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const todayStr = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local

const inputCls =
  "w-full px-[15px] py-[13px] border border-line rounded-xl bg-transparent text-sm text-ink font-body disabled:opacity-60";
const labelCls = "block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft";

export default function BookingWidget({ slug, name }: { slug: string; name: string }) {
  const { currency, format: cad } = useCurrency();
  const [avail, setAvail] = useState<Avail | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/availability/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setAvail)
      .catch(() => setLoadFailed(true));
  }, [slug]);

  const cfg = avail?.config;
  const nights = checkin && checkout ? Math.round((toDay(checkout) - toDay(checkin)) / 86_400_000) : 0;

  const clash = useMemo(() => {
    if (!avail || nights <= 0) return false;
    return avail.blocked.some((r) => toDay(checkin) < toDay(r.end) && toDay(r.start) < toDay(checkout));
  }, [avail, checkin, checkout, nights]);

  const price = useMemo(() => {
    if (!cfg || nights <= 0) return null;
    const q = quote({ ...cfg, icalEnvVar: "" }, checkin, checkout);
    return {
      lodging: q.lodging / 100, multiDiscount: q.multiDiscount / 100, multiPercent: q.multiPercent,
      directDiscount: q.directDiscount / 100, directPercent: q.directPercent,
      cleaning: q.cleaning / 100, tax: q.tax / 100, total: q.total / 100, weekendNights: q.weekendNights,
    };
  }, [cfg, nights, checkin, checkout]);

  // Fallback: not open yet (or availability didn't load) -> request to book
  if (loadFailed || (avail && !avail.open)) {
    return (
      <>
        <p className="mb-5 rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-[13px] leading-[1.55] text-ink">
          Instant booking for {name} opens very soon. For now, send your dates and we will confirm personally.
        </p>
        <InquiryForm
          inquiryType="property"
          subject={`Booking request: ${name}`}
          messagePlaceholder="Anything we should know about your stay?"
          submitLabel="Request to book"
          footnote="Sam will reply within the hour during the day."
          propertySlug={slug}
          askDates={{ maxGuests: 2 }}
        />
      </>
    );
  }

  if (!avail || !cfg) {
    return <div className="h-[320px] animate-pulse rounded-xl bg-line/50" aria-label="Loading availability" />;
  }

  const tooShort = nights > 0 && nights < cfg.minNights;
  const badOrder = Boolean(checkin && checkout && nights <= 0);
  const canPay =
    agreed && nights >= cfg.minNights && !clash && form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim().length >= 7;

  const pay = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, checkin, checkout, guests, ...form, notes: form.notes || undefined, agreed }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Something went wrong.");
      window.location.href = data.url; // Stripe Checkout (Sam's account)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="font-display text-[26px] text-moss leading-none">
        From {cad(cfg.weekdayRate)} <span className="font-body text-[14px] text-ink-soft">/ night</span>
        <div className="mt-1.5 font-body text-[12px] text-ink-soft">
          {cad(cfg.weekendRate)} Fri and Sat nights
          {cfg.multiNightDiscount && <> · {cfg.multiNightDiscount.percent}% off {cfg.multiNightDiscount.minNights}+ nights</>}
          {cfg.directDiscountPercent > 0 && <> · plus {cfg.directDiscountPercent}% off for booking direct</>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <label className={labelCls} htmlFor="bk-in">Check-in</label>
          <input id="bk-in" type="date" style={{ height: 50 }} min={todayStr()} value={checkin} onChange={(e) => setCheckin(e.target.value)} className={inputCls} />
        </div>
        <div className="min-w-0">
          <label className={labelCls} htmlFor="bk-out">Check-out</label>
          <input id="bk-out" type="date" style={{ height: 50 }} min={checkin || todayStr()} value={checkout} onChange={(e) => setCheckout(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <span className={labelCls}>Guests</span>
        <div className="flex items-center justify-between rounded-xl border border-line px-[15px] py-[9px]">
          <span className="text-sm text-ink">{guests} guest{guests === 1 ? "" : "s"}</span>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Fewer guests" disabled={guests <= 1} onClick={() => setGuests((g) => g - 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-line bg-transparent disabled:opacity-40"><Minus size={14} /></button>
            <button type="button" aria-label="More guests" disabled={guests >= cfg.maxGuests} onClick={() => setGuests((g) => g + 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-line bg-transparent disabled:opacity-40"><Plus size={14} /></button>
          </div>
        </div>
      </div>

      {(clash || tooShort || badOrder) && (
        <div className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-[13px] text-ink">
          {clash && "Some of those nights are already booked. Please try other dates."}
          {tooShort && `Minimum stay is ${cfg.minNights} nights.`}
          {badOrder && "Check-out needs to be after check-in."}
        </div>
      )}

      {price && !clash && !tooShort && (
        <dl className="m-0 flex flex-col gap-2 border-y border-line py-4 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-ink-soft">
              {nights} night{nights === 1 ? "" : "s"}
              {price.weekendNights > 0 && price.weekendNights < nights && ` (${price.weekendNights} weekend)`}
              {price.weekendNights === nights && nights > 0 && " (weekend)"}
            </dt>
            <dd className="m-0">{cad(price.lodging)}</dd>
          </div>
          {price.multiDiscount > 0 && <div className="flex justify-between text-moss"><dt>{price.multiPercent}% multi-night discount</dt><dd className="m-0">-{cad(price.multiDiscount)}</dd></div>}
          {price.directDiscount > 0 && <div className="flex justify-between text-moss"><dt>{price.directPercent}% off for booking direct</dt><dd className="m-0">-{cad(price.directDiscount)}</dd></div>}
          {price.cleaning > 0 && <div className="flex justify-between"><dt className="text-ink-soft">Cleaning fee</dt><dd className="m-0">{cad(price.cleaning)}</dd></div>}
          {price.tax > 0 && <div className="flex justify-between"><dt className="text-ink-soft">Taxes ({Math.round(cfg.taxRate * 100)}%)</dt><dd className="m-0">{cad(price.tax)}</dd></div>}
          <div className="flex justify-between font-medium text-ink"><dt>Total</dt><dd className="m-0">{cad(price.total)}</dd></div>
        </dl>
      )}

      {nights >= cfg.minNights && !clash && (
        <>
          <div>
            <label className={labelCls} htmlFor="bk-name">Your name</label>
            <input id="bk-name" className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="bk-email">Email</label>
              <input id="bk-email" type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
            </div>
            <div>
              <label className={labelCls} htmlFor="bk-phone">Phone</label>
              <input id="bk-phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(905) 555 0123" />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="bk-notes">Anything we should know? (optional)</label>
            <textarea id="bk-notes" rows={2} className={`${inputCls} resize-y`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </>
      )}

      {nights >= cfg.minNights && !clash && (
        <div className="rounded-xl border border-line bg-bone-soft px-4 py-3 text-[12px] leading-[1.55] text-ink-soft">
          <strong className="font-medium text-ink">Cancellation ({DIRECT_CANCELLATION.name}):</strong> {DIRECT_CANCELLATION.summary}
        </div>
      )}

      {nights >= cfg.minNights && !clash && (
        <label className="flex cursor-pointer items-start gap-2.5 text-[12px] leading-[1.5] text-ink-soft">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 shrink-0 accent-clay" />
          <span>
            I&apos;m 18 or older and agree to the{" "}
            <Link href="/cancellations#direct" target="_blank" className="text-clay">house rules and cancellation policy</Link> and the{" "}
            <Link href="/terms" target="_blank" className="text-clay">terms</Link>.
          </span>
        </label>
      )}

      {error && <div className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-[13px] text-ink">{error}</div>}

      <button
        type="button"
        onClick={pay}
        disabled={!canPay || submitting}
        className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-clay p-[15px] text-sm font-medium tracking-[0.02em] text-bone disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Lock size={14} /> {submitting ? "Opening secure payment..." : "Book now"}
      </button>
      {currency !== "CAD" && (
        <p className="m-0 rounded-lg bg-bone-soft px-3 py-2 text-[12px] leading-[1.5] text-ink-soft">
          Prices shown in {currency} at today&apos;s rate, for guidance. You&apos;ll be charged in Canadian dollars
          {price ? ` (${price.total.toLocaleString("en-CA", { style: "currency", currency: "CAD" })} CAD)` : ""}; your bank converts it.
        </p>
      )}
      <p className="m-0 text-[12px] leading-[1.5] text-ink-soft">
        Secure payment by Stripe, paid directly to your hosts. Check-in {cfg.checkInTime}, check-out by {cfg.checkOutTime}.
      </p>
    </div>
  );
}
