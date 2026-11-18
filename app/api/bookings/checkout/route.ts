// POST /api/bookings/checkout
// Validates dates, re-checks availability, prices the stay SERVER-side,
// saves a pending booking, and returns a Stripe Checkout URL (Sam's account).
// Payment goes straight to Sam. No Airbnb involved.

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getBlockedRanges } from "@/lib/availability";
import { getPropertyBySlug } from "@/lib/properties";
import { getDirectConfig, isDirectBookingOpen, nightsBetween, overlaps, quote, toDay } from "@/lib/direct-booking";
import { stripePost } from "@/lib/stripe";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD dates");
const Schema = z.object({
  slug: z.string().max(100),
  checkin: Day,
  checkout: Day,
  guests: z.number().int().min(1).max(20),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Please provide a valid email").max(200),
  phone: z.string().trim().min(7, "Phone is required").max(40),
  notes: z.string().trim().max(1000).optional(),
  agreed: z.literal(true, { message: "Please accept the house rules, cancellation policy and terms." }),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid booking" }, { status: 400 });
  }
  const d = parsed.data;
  const property = getPropertyBySlug(d.slug);
  const cfg = getDirectConfig(d.slug);
  if (!property || !cfg || !isDirectBookingOpen(d.slug)) {
    return NextResponse.json({ error: "Direct booking is not open for this home yet." }, { status: 409 });
  }

  // Date rules
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const nights = nightsBetween(d.checkin, d.checkout);
  if (toDay(d.checkin) < today.getTime()) return NextResponse.json({ error: "Check-in can't be in the past." }, { status: 400 });
  if (nights < cfg.minNights) return NextResponse.json({ error: `Minimum stay is ${cfg.minNights} night${cfg.minNights === 1 ? "" : "s"}.` }, { status: 400 });
  if (nights > 60) return NextResponse.json({ error: "For stays over 60 nights, please send us a message." }, { status: 400 });
  if (d.guests > cfg.maxGuests) return NextResponse.json({ error: `This home sleeps up to ${cfg.maxGuests}.` }, { status: 400 });

  // Availability (Airbnb calendar + bookings made here)
  const stay = { start: d.checkin, end: d.checkout };
  const blocked = await getBlockedRanges(d.slug);
  if (blocked.some((r) => overlaps(stay, r))) {
    return NextResponse.json({ error: "Sorry, those dates were just taken. Please pick others." }, { status: 409 });
  }

  // Price (server is the source of truth, never the browser)
  const q = quote(cfg, d.checkin, d.checkout);

  // Save pending booking (holds the dates for ~35 min)
  const { data: row, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      property_slug: d.slug, checkin: d.checkin, checkout: d.checkout, guests: d.guests,
      name: d.name, email: d.email, phone: d.phone, notes: d.notes ?? null,
      nights, amount_cents: q.total, currency: cfg.currency, status: "pending",
    })
    .select("id")
    .single();
  if (error || !row) {
    console.error("[checkout] booking insert failed:", error);
    return NextResponse.json({ error: "Could not start your booking. Please call us." }, { status: 500 });
  }

  const origin = new URL(req.url).origin;
  try {
    const session = await stripePost<{ id: string; url: string }>("checkout/sessions", {
      mode: "payment",
      customer_email: d.email,
      success_url: `${origin}/booking/confirmed?id=${row.id}`,
      cancel_url: `${origin}/stays/${d.slug}?cancelled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      "metadata[booking_id]": row.id,
      "payment_intent_data[metadata][booking_id]": row.id,
      "payment_intent_data[description]": `${property.name}, ${d.checkin} to ${d.checkout}`,
      "line_items[0][quantity]": 1,
      "line_items[0][price_data][currency]": cfg.currency,
      "line_items[0][price_data][unit_amount]": q.lodging - q.discount,
      "line_items[0][price_data][product_data][name]": `${property.name}: ${nights} night${nights === 1 ? "" : "s"} (${d.checkin} to ${d.checkout})${q.multiDiscount ? `, ${q.multiPercent}% multi-night discount` : ""}${q.directDiscount ? `, ${q.directPercent}% booking-direct discount` : ""}`,
      ...(q.cleaning > 0 && {
        "line_items[1][quantity]": 1,
        "line_items[1][price_data][currency]": cfg.currency,
        "line_items[1][price_data][unit_amount]": q.cleaning,
        "line_items[1][price_data][product_data][name]": "Cleaning fee",
      }),
      ...(q.tax > 0 && {
        [`line_items[${q.cleaning > 0 ? 2 : 1}][quantity]`]: 1,
        [`line_items[${q.cleaning > 0 ? 2 : 1}][price_data][currency]`]: cfg.currency,
        [`line_items[${q.cleaning > 0 ? 2 : 1}][price_data][unit_amount]`]: q.tax,
        [`line_items[${q.cleaning > 0 ? 2 : 1}][price_data][product_data][name]`]: `Taxes (${Math.round(cfg.taxRate * 100)}%)`,
      }),
    });
    await supabaseAdmin.from("bookings").update({ stripe_session_id: session.id }).eq("id", row.id);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout] Stripe session failed:", e);
    await supabaseAdmin.from("bookings").update({ status: "failed" }).eq("id", row.id);
    return NextResponse.json({ error: "Payment could not be started. Please try again or call us." }, { status: 502 });
  }
}
