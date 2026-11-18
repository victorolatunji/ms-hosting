// "Perks": small honest tags worked out from each listing's real details.
// Used for the card badge, the mood filter chips, and the live ticker.
// Airbnb's own titles (Superhost, Guest favourite) are only shown where the
// listing data already has them as `tag`; we never invent those.

import { PROPERTIES, type Property } from "@/lib/properties";

export type PerkId = "direct" | "hottub" | "spa" | "group" | "pets" | "transit" | "lake";

export const PERKS: Record<PerkId, { label: string; mood: string }> = {
  direct:  { label: "Book direct",     mood: "Book instantly" },
  hottub:  { label: "Private hot tub", mood: "Hot tub nights" },
  spa:     { label: "Near Thermea Spa", mood: "Spa weekend" },
  group:   { label: "Big group home",  mood: "The whole crew" },
  pets:    { label: "Pet-friendly",    mood: "Bring the dog" },
  transit: { label: "Near the train",  mood: "Car-free trip" },
  lake:    { label: "Up north",        mood: "Escape north" },
};

const text = (p: Property) => `${p.name} ${p.blurb} ${p.description}`.toLowerCase();

export function perksFor(p: Property): PerkId[] {
  const t = text(p);
  const out: PerkId[] = [];
  if (p.bookingMode === "direct") out.push("direct");
  if (/hot tub/.test(t)) out.push("hottub");
  if (/thermea|spa village/.test(t)) out.push("spa");
  if (p.guests >= 10) out.push("group");
  if (/pet-friendly|dog is welcome/.test(t)) out.push("pets");
  if (/go train|bradford go|mount pleasant go|subway|kennedy station|to the train/.test(t)) out.push("transit");
  if (p.citySlug === "sudbury") out.push("lake");
  return out;
}

// Badge shown on a card's photo: real tag first, otherwise the best perk.
export function badgeFor(p: Property): string | null {
  if (p.tag) return p.tag;
  if (p.rating === null) return "New to M&S";
  const first = perksFor(p)[0];
  return first ? PERKS[first].label : null;
}

// Site-wide numbers for the ticker and headings, all derived from real data.
export function siteStats(list: Property[] = PROPERTIES) {
  const rated = list.filter((p) => p.rating !== null && p.reviews > 0);
  const reviews = rated.reduce((n, p) => n + p.reviews, 0);
  const avg = reviews ? rated.reduce((n, p) => n + (p.rating as number) * p.reviews, 0) / reviews : null;
  const cities = new Set(list.map((p) => p.citySlug)).size;
  const hotTubs = list.filter((p) => perksFor(p).includes("hottub")).length;
  const sleepsMost = Math.max(...list.map((p) => p.guests));
  return { homes: list.length, cities, reviews, avg, hotTubs, sleepsMost };
}
