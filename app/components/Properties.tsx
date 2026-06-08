"use client";
// Properties grid. Reads filters from SearchContext and shows only matching homes.
// Also attaches the propertiesRef from context so Hero can scroll here.

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, X } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import { PROPERTIES } from "@/lib/properties";
import { CITIES } from "@/lib/cities";
import { useSearch } from "./SearchContext";

export default function Properties() {
  // Hooks into the search context
  const { filters, clearFilters, propertiesRef } = useSearch();

  // Favorites state, unchanged
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Detect if any filter is active. Dates count even though we don't
  // filter on them, so the user sees the dates carried in the banner.
  const isFiltering =
    filters.city !== "" ||
    filters.guests > 0 ||
    filters.checkin !== "" ||
    filters.checkout !== "";

  // Filter the 11 properties.
  // City: must match (or empty = match any)
  // Guests: property must sleep at least that many (or 0 = no filter)
  // Dates: not filtered, just informational
  const filteredProperties = PROPERTIES.filter((p) => {
    if (filters.city && p.citySlug !== filters.city) return false;
    if (filters.guests > 0 && p.guests < filters.guests) return false;
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
              onClick={clearFilters}
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
                onClick={clearFilters}
                className="text-clay underline cursor-pointer border-none bg-transparent p-0 text-[14px]"
              >
                show all eleven homes
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
                      Not available for hosting
                    </div>
                  )}

                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt={p.name}
                      className={`img-zoom w-full h-full object-cover ${p.unavailable ? "grayscale-[.6]" : ""}`}
                    />

                    {p.tag && !p.unavailable && (
                      <div className="absolute top-3.5 left-3.5 bg-bone text-moss px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.02em] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-clay rotate-45" />
                        {p.tag}
                      </div>
                    )}

                    {!p.unavailable && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFav(p.id);
                        }}
                        aria-label="Save"
                        className="absolute top-3 right-3 w-[38px] h-[38px] rounded-full bg-bone/95 backdrop-blur-sm border-none cursor-pointer flex items-center justify-center"
                      >
                        <Heart
                          size={16}
                          fill={favorites.has(p.id) ? "var(--color-clay)" : "none"}
                          color={favorites.has(p.id) ? "var(--color-clay)" : "var(--color-moss)"}
                        />
                      </button>
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
                      <div>
                        <span className="font-display text-[19px] font-medium italic text-clay">
                          Enquire
                        </span>
                        <span className="text-[12px] text-ink-soft ml-1.5">for rates</span>
                      </div>
                      <span className="text-[11px] text-ink-soft">
                        {p.reviews > 0 ? `${p.reviews} reviews` : "No reviews yet"}
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