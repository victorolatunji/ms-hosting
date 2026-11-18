// GET /api/keepalive, called once a day by Vercel Cron (see vercel.json).
// Free Supabase projects pause after 7 days with no activity, which breaks
// every form on the site. A tiny daily read keeps the project awake.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when that env var is set.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("inquiries")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[keepalive] Supabase unreachable:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
