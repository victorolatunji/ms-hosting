// Blocked dates for a direct-booking listing, from two sources:
//   1. Sam's Airbnb calendar (iCal export), so Airbnb bookings block this site.
//   2. Bookings made on this site (confirmed, or pending checkout < 35 min old).
// Server-only.

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getDirectConfig, type Range } from "@/lib/direct-booking";

const icalDate = (v: string) => {
  const d = v.replace(/[^0-9]/g, "").slice(0, 8); // 20261201 or 20261201T150000Z
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
};

export function parseIcal(text: string): Range[] {
  const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/); // unfold
  const out: Range[] = [];
  let cur: Partial<Range> | null = null;
  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) cur = {};
    else if (line.startsWith("END:VEVENT")) {
      if (cur?.start && cur.end) out.push(cur as Range);
      cur = null;
    } else if (cur && line.startsWith("DTSTART")) cur.start = icalDate(line.split(":").pop()!);
    else if (cur && line.startsWith("DTEND")) cur.end = icalDate(line.split(":").pop()!);
  }
  return out;
}

export async function getBlockedRanges(slug: string): Promise<Range[]> {
  const cfg = getDirectConfig(slug);
  if (!cfg) return [];
  const ranges: Range[] = [];

  const icalUrl = process.env[cfg.icalEnvVar];
  if (icalUrl) {
    try {
      const res = await fetch(icalUrl, { next: { revalidate: 600 } });
      if (res.ok) ranges.push(...parseIcal(await res.text()));
      else console.error(`[availability] iCal HTTP ${res.status} for ${slug}`);
    } catch (e) {
      console.error(`[availability] iCal fetch failed for ${slug}:`, e);
    }
  }

  const holdCutoff = new Date(Date.now() - 35 * 60_000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("checkin, checkout, status, created_at")
    .eq("property_slug", slug)
    .or(`status.eq.confirmed,and(status.eq.pending,created_at.gt.${holdCutoff})`);
  if (error) console.error("[availability] bookings query failed:", error);
  for (const b of data ?? []) ranges.push({ start: b.checkin, end: b.checkout });

  return ranges;
}
