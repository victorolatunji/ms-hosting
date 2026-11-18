// POST /api/bookings/webhook  (Stripe calls this; add it in Sam's Stripe dashboard)
// Events: checkout.session.completed, checkout.session.expired
// On payment: mark booking confirmed and email Sam + the guest.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyStripeSignature } from "@/lib/stripe";
import { sendBookingEmails } from "@/lib/booking-email";
import { sendWhatsAppAlert } from "@/lib/whatsapp";
import { abs } from "@/lib/site";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const event = JSON.parse(raw) as {
    type: string;
    data: { object: { id: string; payment_status?: string; payment_intent?: string; metadata?: { booking_id?: string } } };
  };
  const s = event.data.object;
  const bookingId = s.metadata?.booking_id;
  if (!bookingId) return NextResponse.json({ ok: true });

  if (event.type === "checkout.session.completed" && s.payment_status === "paid") {
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .update({ status: "confirmed", stripe_payment_intent: s.payment_intent ?? null, confirmed_at: new Date().toISOString() })
      .eq("id", bookingId)
      .neq("status", "confirmed") // idempotent: Stripe may retry
      .select("*")
      .maybeSingle();
    if (error) {
      console.error("[webhook] confirm failed:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 }); // Stripe will retry
    }
    if (booking) {
      await Promise.all([
        sendBookingEmails(booking),
        sendWhatsAppAlert(
          "PAID booking",
          `${booking.name} (${booking.phone})`,
          `Hot Tub Oasis, ${booking.checkin} to ${booking.checkout}, ${booking.guests} guest${booking.guests === 1 ? "" : "s"}, $${(booking.amount_cents / 100).toFixed(2)} CAD`,
          abs("/admin/bookings")
        ),
      ]);
    }
  }

  if (event.type === "checkout.session.expired") {
    await supabaseAdmin.from("bookings").update({ status: "expired" }).eq("id", bookingId).eq("status", "pending");
  }

  return NextResponse.json({ ok: true });
}
