// /booking/confirmed?id=... Stripe sends guests here after paying.
// The webhook confirms the booking; this page just reads its status.

import Link from "next/link";
import type { Metadata } from "next";
import { Check, Clock } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPropertyBySlug } from "@/lib/properties";

export const metadata: Metadata = { title: "Booking confirmed | M&S Hosting", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Confirmed({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const { data: b } = id && /^[0-9a-f-]{36}$/.test(id)
    ? await supabaseAdmin.from("bookings").select("property_slug, checkin, checkout, status, name").eq("id", id).maybeSingle()
    : { data: null };
  const p = b ? getPropertyBySlug(b.property_slug) : null;
  const confirmed = b?.status === "confirmed";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[620px] px-6 py-24 text-center max-md:px-5 max-md:py-14">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-clay/15">
          {confirmed ? <Check size={28} className="text-clay" /> : <Clock size={28} className="text-clay" />}
        </div>
        <h1 className="m-0 mb-4 font-display text-moss leading-[1.1]" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          {confirmed ? <>You&apos;re <span className="italic text-clay">booked.</span></> : <>Payment <span className="italic text-clay">received.</span></>}
        </h1>
        <p className="m-0 mb-8 text-[16px] leading-[1.7] text-ink-soft">
          {b && p
            ? <>{p.name}, {b.checkin} to {b.checkout}. {confirmed ? "A confirmation is on its way to your inbox." : "We are confirming it now. You will get an email in a minute or two."}</>
            : "Thank you. A confirmation is on its way to your inbox."}
        </p>
        <Link href="/" className="inline-block rounded-full border border-clay px-6 py-3 text-[14px] font-medium text-clay no-underline hover:bg-clay hover:text-bone">
          Back to M&amp;S Hosting
        </Link>
      </main>
      <Footer />
    </>
  );
}
