// GET /api/availability/hot-tub-oasis -> { open, blocked: [{start, end}], config }
// Used by the booking widget to grey out taken dates and show the price.

import { NextResponse } from "next/server";
import { getBlockedRanges } from "@/lib/availability";
import { getDirectConfig, isDirectBookingOpen } from "@/lib/direct-booking";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cfg = getDirectConfig(slug);
  if (!cfg) return NextResponse.json({ error: "Not a direct-booking listing" }, { status: 404 });

  const open = isDirectBookingOpen(slug);
  const blocked = open ? await getBlockedRanges(slug) : [];
  return NextResponse.json({
    open,
    blocked,
    // Everything the widget needs to price a stay (the server re-prices at checkout).
    config: Object.fromEntries(Object.entries(cfg).filter(([k]) => k !== "icalEnvVar")),
  });
}
