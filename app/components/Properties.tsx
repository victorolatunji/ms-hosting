"use client";
// Properties grid. Reads filters from SearchContext and shows only matching homes.
// Also attaches the propertiesRef from context so Hero can scroll here.

import { useState } from "react";
import Link from "next/link";
import { Star, X } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import { PROPERTIES, type Property } from "@/lib/properties";
import { CITIES } from "@/lib/cities";
import { useSearch } from "./SearchContext";
import { toWords } from "@/lib/words";
import SaveButton from "./SaveButton";
import { PERKS, badgeFor, perksFor, type PerkId } from "@/lib/perks";

// Mood chips: only moods that at least one home actually matches.
const moodsFor = (list: Property[]) =>
  (Object.keys(PERKS) as PerkId[])
    .map((id) => ({ id, label: PERKS[id].mood, count: list.filter((p) => !p.unavailable && perksFor(p).includes(id)).length }))
    .filter((m) => m.count > 0);

export default function Properties({ properties = PROPERTIES }: { properties?: Property[] }) {
  const MOODS = moodsFor(properties);
  // Hooks into the search context
  const { filters, clearFilters, propertiesRef } = useSearch();

  // "Pick your mood" chip (local to this section)
  const [mood, setMood] = useState<PerkId | null>(null);

  // Detect if any filter is active. Dates count even though we don't
  // filter on them, so the user sees the dates carried in the banner.
  const isFiltering =
    filters.city !== "" ||
    filters.guests > 0 ||
    filters.checkin !== "" ||
    filters.checkout !== "" ||
    mood !== null;

  // Filter the properties.
  // City: must match (or empty = match any)
  // Guests: property must sleep at least that many (or 0 = no filter)
  // Dates: not filtered, just informational
  const filteredProperties = properties.filter((p) => {
    if (filters.city && p.citySlug !== filters.city) return false;
    if (filters.guests > 0 && p.guests < filters.guests) return false;
    if (mood && !perksFor(p).includes(mood)) return false;
    return true;
  });

  // Build the banner text
  const cityName = filters.city
    ? CITIES.find((c) => c.slug === filters.city)?.name ?? ""
    : "";

  const bannerParts: string[] = [
    `Showing ${filteredProperties.length} stay${filteredProperties.length === 1 ? "" : "s"}`,
  ];
  if (cityName) bannerParts.push(`in ${cityName}`);
  if (filters.guests > 0) bannerParts.push(`for ${filters.guests} guest${filters.guests === 1 ? "" : "s"}`);
  if (mood) bannerParts.push(`· ${PERKS[mood].mood.toLowerCase()}`);
  const bannerText = bannerParts.join(" ");

  return (
    // Attach the propertiesRef from context so Hero can scrollIntoView here
    <section
      id="stays"
      ref={propertiesRef}
      className="px-6 pt-10 pb-[110px] max-md:px-5 max-md:py-[70px]"
    >
      <div className="max-w-[1320px] mx-auto">

        {/* Section header */}
        <div className="mb-10 max-w-[640px]">
          <Eyebrow>The collection</Eyebrow>
          <h2
            className="font-display m-0 leading-[1.05] text-moss"
            style={{ fontSize: "clamp(34px, 5vw, 60px)" }}
          >
            Every home <span className="italic text-clay">under our care.</span>
          </h2>
        </div>

        {/* Pick your mood */}
        <div className="-mx-5 mb-8 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
          <div className="flex w-max gap-2 md:w-auto md:flex-wrap" role="group" aria-label="Pick your mood">
            <button
              onClick={() => setMood(null)}
              aria-pressed={mood === null}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors ${mood === null ? "border-moss bg-moss text-bone" : "border-line bg-bone text-ink hover:border-clay"}`}
            >
              All homes
            </button>
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(mood === m.id ? null : m.id)}
                aria-pressed={mood === m.id}
                className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] transition-colors ${mood === m.id ? "border-clay bg-clay text-bone" : "border-line bg-bone text-ink hover:border-clay"}`}
              >
                {m.label}
                <span className={`font-mono text-[10px] ${mood === m.id ? "text-bone/80" : "text-ink-soft"}`}>{m.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter banner */}
        {isFiltering && (
          <div className="mb-8 flex items-center justify-between flex-wrap gap-3 bg-clay/8 border border-clay/30 rounded-[14px] px-5 py-3.5">
            <div className="text-[14px] text-ink flex items-center gap-2 flex-wrap">
              <span className="w-1.5 h-1.5 bg-clay rotate-45 inline-block" />
              <span className="font-medium">{bannerText}</span>
              {(filters.checkin || filters.checkout) && (
                <span className="text-ink-soft text-[13px]">
                  &middot; {filters.checkin || "anytime"} → {filters.checkout || "anytime"}
                </span>
              )}
            </div>
            <button
              onClick={() => { clearFilters(); setMood(null); }}
              className="inline-flex items-center gap-1.5 text-[13px] text-clay font-medium cursor-pointer hover:underline border-none bg-transparent"
            >
              <X size={13} /> Show all
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredProperties.length === 0 ? (
          <div className="border border-line rounded-[18px] p-12 text-center bg-bone">
            <div className="font-display text-[26px] text-moss leading-[1.15] mb-3">
              No matches for that search.
            </div>
            <p className="text-[14px] text-ink-soft max-w-[420px] mx-auto leading-[1.65] mb-6 m-0">
              Try a different city or fewer guests, or just{" "}
              <button
                onClick={() => { clearFilters(); setMood(null); }}
                className="text-clay underline cursor-pointer border-none bg-transparent p-0 text-[14px]"
              >
                show all {toWords(properties.length)} homes
              </button>
              {" "}and message us with what you are looking for.
            </p>
          </div>
        ) : (
          // The filtered grid
          <div
            className="grid gap-7 max-sm:grid-cols-1"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
          >
            {filteredProperties.map((p) => {
              const cardContent = (
                <>
                  {p.unavailable && (
                    <div
                      className="absolute top-3.5 left-1/2 z-[5] bg-ink text-bone px-3.5 py-1.5 rounded text-[11px] tracking-[0.15em] uppercase font-medium font-mono"
                      style={{ transform: "translateX(-50%) rotate(-3deg)" }}
                    >
                      Not available right now
                    </div>
                  )}

                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt={p.name}
                      className={`img-zoom w-full h-full object-cover ${p.unavailable ? "grayscale-[.6]" : ""}`}
                    />

                    {badgeFor(p) && !p.unavailable && (
                      <div className="absolute top-3.5 left-3.5 bg-bone text-moss px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.02em] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-clay rotate-45" />
                        {badgeFor(p)}
                      </div>
                    )}

                    {!p.unavailable && (
                      <SaveButton slug={p.slug} name={p.name} className="absolute top-3 right-3" />
                    )}
                  </div>

                  <div className="p-[22px]">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="font-display text-[22px] font-medium leading-[1.15] text-moss flex-1">
                        {p.name}
                      </div>
                      {p.rating !== null ? (
                        <div className="flex items-center gap-1 text-[13px] text-ink shrink-0">
                          <Star size={13} fill="var(--color-clay)" stroke="var(--color-clay)" />
                          {p.rating.toFixed(2)}
                        </div>
                      ) : (
                        <span className="font-mono text-[10px] text-amber tracking-[0.15em] uppercase shrink-0">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] leading-[1.55] text-ink-soft m-0 mb-3.5">
                      {p.blurb}
                    </p>

                    <div className="font-mono text-[10px] text-ink-soft mb-4 tracking-[0.12em] uppercase">
                      {p.city} / {p.beds} / sleeps {p.guests}
                    </div>

                    <div className="flex justify-between items-center border-t border-line pt-3.5">
                      {p.bookingMode === "direct" ? (
                        <div>
                          <span className="font-display text-[19px] font-medium italic text-clay">
                            Book now
                          </span>
                          <span className="text-[12px] text-ink-soft ml-1.5">direct with us</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-display text-[19px] font-medium italic text-clay">
                            Request to book
                          </span>
                        </div>
                      )}
                      <span className="text-[11px] text-ink-soft">
                        {p.reviews > 0 ? `${p.reviews} reviews` : "New to M&S"}
                      </span>
                    </div>
                  </div>
                </>
              );

              const cardClasses = `
                lift bg-bone rounded-[18px] overflow-hidden
                border border-line relative no-underline text-ink
                ${p.unavailable ? "cursor-not-allowed opacity-55" : "cursor-pointer"}
              `;

              return p.unavailable ? (
                <article key={p.id} className={cardClasses}>
                  {cardContent}
                </article>
              ) : (
                <Link key={p.id} href={`/stays/${p.slug}`} className={cardClasses}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}