// Direct bookings (Hot Tub Oasis). Payments live in Sam's Stripe dashboard.
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPropertyBySlug } from "@/lib/properties";
import { isDirectBookingOpen } from "@/lib/direct-booking";
import { DbDown, PageTitle, Pill, when } from "../ui";

type Row = {
  id: string; created_at: string; property_slug: string; checkin: string; checkout: string; guests: number;
  name: string; email: string; phone: string; notes: string | null; nights: number; amount_cents: number;
  status: string; stripe_payment_intent: string | null;
};

const money = (c: number) => (c / 100).toLocaleString("en-CA", { style: "currency", currency: "CAD" });
const day = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

export default async function Bookings() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .in("status", ["confirmed", "pending"])
    .order("checkin", { ascending: true })
    .limit(200);
  const rows = (data ?? []) as Row[];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Toronto" });
  const upcoming = rows.filter((r) => r.checkout >= today);
  const open = isDirectBookingOpen("hot-tub-oasis");

  return (
    <>
      <PageTitle title="Direct bookings" sub="Paid through Sam's Stripe. Refunds and payouts are managed in the Stripe dashboard." />
      {!open && (
        <div className="mb-6 rounded-[14px] border border-amber/50 bg-amber/15 px-5 py-4 text-[14px] leading-[1.6] text-ink">
          Instant booking for Hot Tub Oasis is switched off. It turns on by itself once the Stripe keys
          (<code className="mx-1">STRIPE_SECRET_KEY</code>, <code className="mx-1">STRIPE_WEBHOOK_SECRET</code>) and the calendar link
          (<code className="mx-1">ICAL_HOT_TUB_OASIS</code>) are added in Vercel. Until then guests send a request instead.
        </div>
      )}
      {error ? (
        <DbDown what="bookings" />
      ) : upcoming.length === 0 ? (
        <p className="text-[14px] text-ink-soft">No upcoming direct bookings yet.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {upcoming.map((r) => (
            <li key={r.id} className="rounded-[18px] border border-line bg-bone p-5 md:p-6">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Pill tone={r.status === "confirmed" ? "moss" : "amber"}>{r.status === "confirmed" ? "Paid" : "Checkout in progress"}</Pill>
                <span className="ml-auto font-mono text-[11px] text-ink-soft">Booked {when(r.created_at)}</span>
              </div>
              <div className="font-display text-[22px] text-moss">{day(r.checkin)} to {day(r.checkout)}</div>
              <div className="text-[13px] text-ink-soft">
                {getPropertyBySlug(r.property_slug)?.name ?? r.property_slug} · {r.nights} night{r.nights === 1 ? "" : "s"} · {r.guests} guest{r.guests === 1 ? "" : "s"} · {money(r.amount_cents)}
              </div>
              <div className="mt-3 text-[14px]">
                {r.name} · <a href={`mailto:${r.email}`} className="text-clay no-underline">{r.email}</a> · <a href={`tel:${r.phone}`} className="text-clay no-underline">{r.phone}</a>
              </div>
              {r.notes && <p className="m-0 mt-2 text-[14px] text-ink-soft">“{r.notes}”</p>}
              {r.stripe_payment_intent && (
                <a href={`https://dashboard.stripe.com/payments/${r.stripe_payment_intent}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[13px] text-clay">
                  Open in Stripe ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
