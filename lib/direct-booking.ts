// Direct booking settings, one entry per listing with bookingMode "direct".
// Right now that is only Hot Tub Oasis (Sam's own suite).
//
// The booking widget stays in "request to book" fallback until BOTH:
//   1. live: true below (set once Sam confirms the numbers), and
//   2. STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET are set in Vercel (Sam's Stripe account).
//
// TODO(Sam): confirm nightly rate, cleaning fee, minimum nights, and tax rate.

export type DirectBookingConfig = {
  live: boolean;
  currency: "cad";
  weekdayRate: number;      // CAD per night, Sun to Thu nights
  weekendRate: number;      // CAD per night, Fri and Sat nights
  multiNightDiscount: { minNights: number; percent: number } | null;
  directDiscountPercent: number; // optional extra % off for booking direct (0 = same as Airbnb)
  cleaningFee: number;      // CAD, once per stay
  taxRate: number;          // 0.13 = 13% HST. 0 matches what Airbnb charges today.
  minNights: number;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;
  // Env var holding the calendar export link (.ics). Booking stays closed until it is set.
  icalEnvVar: string;
};

// Prices mirror Sam's live Airbnb listing, read on 18 Nov 2026:
// $149 weeknights, $299 Fri/Sat, 15% off 2+ nights, no cleaning fee, no tax line.
// Sam wants direct prices to match Airbnb (no direct discount), Nov 2026.
export const DIRECT_BOOKING: Record<string, DirectBookingConfig> = {
  "hot-tub-oasis": {
    live: true,
    currency: "cad",
    weekdayRate: 149,
    weekendRate: 299,
    multiNightDiscount: { minNights: 2, percent: 15 },
    directDiscountPercent: 0, // Sam: same price as Airbnb, no direct discount
    cleaningFee: 0,
    taxRate: 0, // TODO(Sam): set 0.13 only if the business is registered for HST
    minNights: 1,
    maxGuests: 2,
    checkInTime: "4:00 pm to midnight",
    checkOutTime: "10:00 am",
    icalEnvVar: "ICAL_HOT_TUB_OASIS",
  },
};

export const getDirectConfig = (slug: string) => DIRECT_BOOKING[slug] ?? null;

// Open only when: numbers are set, Stripe is configured, AND the calendar is
// connected (so a direct booking can never land on top of an Airbnb one).
export const isDirectBookingOpen = (slug: string) => {
  const c = getDirectConfig(slug);
  return Boolean(c?.live && c.weekdayRate > 0 && process.env.STRIPE_SECRET_KEY && process.env[c.icalEnvVar]);
};

// ---- Date helpers (YYYY-MM-DD strings, timezone-free) ----
export const toDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
export const nightsBetween = (checkin: string, checkout: string) =>
  Math.round((toDay(checkout) - toDay(checkin)) / 86_400_000);

export type Range = { start: string; end: string }; // end is exclusive (checkout day)
export const overlaps = (a: Range, b: Range) =>
  toDay(a.start) < toDay(b.end) && toDay(b.start) < toDay(a.end);

// Price a stay. Pure function: used by the widget (to show) and the server (to charge).
// All amounts in cents.
export function quote(c: DirectBookingConfig, checkin: string, checkout: string) {
  const nights = nightsBetween(checkin, checkout);
  let lodging = 0;
  let weekendNights = 0;
  for (let n = 0; n < nights; n++) {
    const dow = new Date(toDay(checkin) + n * 86_400_000).getUTCDay(); // 5 = Fri, 6 = Sat
    const weekend = dow === 5 || dow === 6;
    if (weekend) weekendNights++;
    lodging += Math.round((weekend ? c.weekendRate : c.weekdayRate) * 100);
  }
  const multiPct = c.multiNightDiscount && nights >= c.multiNightDiscount.minNights ? c.multiNightDiscount.percent : 0;
  // Discounts stack the way Airbnb applies them: multi-night first, then direct on what's left.
  const multiDiscount = Math.round(lodging * multiPct / 100);
  const directDiscount = Math.round((lodging - multiDiscount) * c.directDiscountPercent / 100);
  const discount = multiDiscount + directDiscount;
  const cleaning = Math.round(c.cleaningFee * 100);
  const tax = Math.round((lodging - discount + cleaning) * c.taxRate);
  return {
    nights, weekendNights, lodging, discount, multiDiscount, directDiscount,
    multiPercent: multiPct, directPercent: c.directDiscountPercent, discountPercent: multiPct + c.directDiscountPercent,
    cleaning, tax, total: lodging - discount + cleaning + tax,
  };
}
