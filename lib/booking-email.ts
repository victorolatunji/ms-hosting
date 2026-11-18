// Confirmation emails for paid direct bookings (Sam + the guest).
// Reuses the Resend setup from lib/email.ts. Never throws.

import { Resend } from "resend";
import { getPropertyBySlug } from "@/lib/properties";
import { getDirectConfig } from "@/lib/direct-booking";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const FROM = process.env.RESEND_FROM ?? "M&S Hosting Solutions <onboarding@resend.dev>";
const NOTIFY_TO = process.env.BOOKING_NOTIFY_TO ?? process.env.INQUIRY_NOTIFY_TO ?? "info.mshostingsolutions@gmail.com";

type Booking = {
  id: string; property_slug: string; checkin: string; checkout: string; guests: number;
  name: string; email: string; phone: string; notes: string | null; nights: number; amount_cents: number;
};

const money = (c: number) => `$${(c / 100).toFixed(2)} CAD`;
const nice = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export async function sendBookingEmails(b: Booking) {
  if (!resend) { console.warn("[booking-email] RESEND_API_KEY not set"); return; }
  const p = getPropertyBySlug(b.property_slug);
  const cfg = getDirectConfig(b.property_slug);
  const name = p?.name ?? b.property_slug;
  const summary = [
    `${name}`,
    `Check-in: ${nice(b.checkin)}${cfg ? `, from ${cfg.checkInTime}` : ""}`,
    `Check-out: ${nice(b.checkout)}${cfg ? `, by ${cfg.checkOutTime}` : ""}`,
    `${b.nights} night${b.nights === 1 ? "" : "s"}, ${b.guests} guest${b.guests === 1 ? "" : "s"}`,
    `Paid: ${money(b.amount_cents)}`,
    `Booking ref: ${b.id.slice(0, 8).toUpperCase()}`,
  ];

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM, to: NOTIFY_TO, replyTo: b.email,
      subject: `New direct booking: ${name}, ${b.checkin}`,
      text: [...summary, "", `Guest: ${b.name}`, `Email: ${b.email}`, `Phone: ${b.phone}`, b.notes ? `Notes: ${b.notes}` : ""].join("\n"),
    }),
    resend.emails.send({
      from: FROM, to: b.email, replyTo: NOTIFY_TO,
      subject: `You're booked: ${name}`,
      text: [`Thanks, ${b.name.split(" ")[0]}. Your stay is confirmed.`, "", ...summary, "", "We'll send check-in details before you arrive. Questions any time: (905) 922-6538.", "", "Warmly,", "Sam & Maddie, M&S Hosting Solutions"].join("\n"),
    }),
  ]);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[booking-email] ${i ? "guest" : "owner"} failed:`, r.reason);
    else if (r.value.error) console.error(`[booking-email] ${i ? "guest" : "owner"} error:`, r.value.error);
  });
}
