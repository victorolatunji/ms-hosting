// GET /api/calendar/hot-tub-oasis.ics
// Calendar feed of confirmed direct bookings. Sam adds this link in Airbnb
// (Listing > Availability > Import calendar) so dates booked here are blocked on Airbnb.

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getDirectConfig } from "@/lib/direct-booking";

export const dynamic = "force-dynamic";

const ics = (d: string) => d.replace(/-/g, "");

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.replace(/\.ics$/, "");
  if (!getDirectConfig(slug)) return new Response("Not found", { status: 404 });

  const { data } = await supabaseAdmin
    .from("bookings")
    .select("id, checkin, checkout")
    .eq("property_slug", slug)
    .eq("status", "confirmed");

  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const events = (data ?? []).map((b) => [
    "BEGIN:VEVENT",
    `UID:${b.id}@mshostingsolutions.ca`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ics(b.checkin)}`,
    `DTEND;VALUE=DATE:${ics(b.checkout)}`,
    "SUMMARY:Booked direct (M&S site)",
    "END:VEVENT",
  ].join("\r\n"));

  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//M&S Hosting Solutions//Direct bookings//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-store" } });
}
