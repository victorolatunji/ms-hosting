// GET /api/fx -> { rates: { CAD: 1, USD: 0.71, ... }, date, source }
// Daily reference rates (European Central Bank via Frankfurter, free, no key).
// Cached for 12 hours; falls back to fixed rates if the service is down.
import { NextResponse } from "next/server";
import { CURRENCIES, FALLBACK_RATES, type Currency } from "@/lib/currency";

export const revalidate = 43200;

export async function GET() {
  const to = CURRENCIES.filter((c) => c !== "CAD").join(",");
  for (const url of [`https://api.frankfurter.dev/v1/latest?base=CAD&symbols=${to}`, `https://api.frankfurter.app/latest?from=CAD&to=${to}`]) {
    try {
      const res = await fetch(url, { next: { revalidate } });
      if (!res.ok) continue;
      const j = (await res.json()) as { date: string; rates: Partial<Record<Currency, number>> };
      return NextResponse.json({ rates: { ...FALLBACK_RATES, ...j.rates, CAD: 1 }, date: j.date, source: "ECB" });
    } catch {
      /* try next */
    }
  }
  return NextResponse.json({ rates: FALLBACK_RATES, date: null, source: "fallback" });
}
