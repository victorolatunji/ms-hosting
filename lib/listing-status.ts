// Listing status set from the admin panel, stored in Supabase (listing_status).
//   live        = normal
//   unavailable = shown greyed out, not clickable, no booking form
//   hidden      = removed from the site entirely (its page returns 404)
// If Supabase can't be reached, everything falls back to "live" so the
// public site never breaks because of the database. Server-only.

import { supabaseAdmin } from "@/lib/supabase-admin";
import { PROPERTIES, type Property } from "@/lib/properties";

export type ListingStatus = "live" | "unavailable" | "hidden";
export const STATUSES: ListingStatus[] = ["live", "unavailable", "hidden"];

// If the database is down, skip it for a minute instead of making every
// page wait for a timeout, and log one readable warning (not an error overlay).
let downUntil = 0;
const RETRY_MS = 60_000;

const describe = (e: unknown) => {
  if (e && typeof e === "object") {
    const o = e as { message?: string; code?: string; details?: string; cause?: { code?: string } };
    return [o.message, o.code, o.details, o.cause?.code].filter(Boolean).join(" / ") || "unknown error";
  }
  return String(e);
};

export async function getStatuses(): Promise<Record<string, ListingStatus>> {
  if (Date.now() < downUntil) return {};
  try {
    const { data, error } = await supabaseAdmin.from("listing_status").select("slug, status");
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((r) => [r.slug, r.status as ListingStatus]));
  } catch (e) {
    downUntil = Date.now() + RETRY_MS;
    console.warn(`[listing-status] database unreachable (${describe(e)}). Showing all listings as live; retrying in 60s.`);
    return {};
  }
}

// What the public sees: hidden removed, unavailable greyed out.
export async function getPublicProperties(): Promise<Property[]> {
  const statuses = await getStatuses();
  return PROPERTIES.filter((p) => statuses[p.slug] !== "hidden").map((p) =>
    statuses[p.slug] === "unavailable" ? { ...p, unavailable: true } : p
  );
}

export async function getPublicProperty(slug: string): Promise<Property | null> {
  return (await getPublicProperties()).find((p) => p.slug === slug) ?? null;
}
