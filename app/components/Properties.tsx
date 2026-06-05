"use client";
// Uses useState for the favorites toggle, so this is a client component.
//
// Property data now lives in lib/properties.ts. This file just renders the grid.
// In Phase 3 the import will switch from a static file to a Supabase query.

import { useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import { PROPERTIES } from "@/lib/properties";

export default function Properties() {
  // Track which property IDs the user has hearted.
  // Set is the right data structure here: O(1) add/has/delete.
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    // id="stays" so the header's #stays nav link scrolls here
    <section id="stays" className="px-6 pt-10 pb-[110px] max-md:px-5 max-md:py-[70px]">
      <div className="max-w-[1320px] mx-auto">

        {/* Section header */}
        <div className="mb-14 max-w-[640px]">
          <Eyebrow>The collection</Eyebrow>
          <h2
            className="font-display m-0 leading-[1.05] text-moss"
            style={{ fontSize: "clamp(34px, 5vw, 60px)" }}
          >
            Every home <span className="italic text-clay">under our care.</span>
          </h2>
        </div>

        {/* Property grid */}
        <div
          className="grid gap-7 max-sm:grid-cols-1"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {PROPERTIES.map((p) => {
            // Card visuals are the same whether or not the property is clickable.
            // We extract them into a variable so we can wrap with either Link or div.
            const cardContent = (
              <>
                {/* The "Not available for hosting" stamp.
                    Kept in code so admins can mark a property offline later. */}
                {p.unavailable && (
                  <div
                    className="
                      absolute top-3.5 left-1/2 z-[5]
                      bg-ink text-bone px-3.5 py-1.5 rounded
                      text-[11px] tracking-[0.15em] uppercase font-medium font-mono
                    "
                    style={{ transform: "translateX(-50%) rotate(-3deg)" }}
                  >
                    Not available for hosting
                  </div>
                )}

                {/* Photo, 4:3 aspect ratio */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className={`img-zoom w-full h-full object-cover ${p.unavailable ? "grayscale-[.6]" : ""}`}
                  />

                  {/* Property tag, top-left */}
                  {p.tag && !p.unavailable && (
                    <div className="absolute top-3.5 left-3.5 bg-bone text-moss px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.02em] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-clay rotate-45" />
                      {p.tag}
                    </div>
                  )}

                  {/* Favorite heart button, top-right.
                      Only shown on available properties.
                      stopPropagation prevents the click from triggering the parent Link. */}
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

                {/* Card body */}
                <div className="p-[22px]">

                  {/* Name + rating row */}
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

                  {/* Blurb */}
                  <p className="text-[13px] leading-[1.55] text-ink-soft m-0 mb-3.5">
                    {p.blurb}
                  </p>

                  {/* City / beds / sleeps line in mono */}
                  <div className="font-mono text-[10px] text-ink-soft mb-4 tracking-[0.12em] uppercase">
                    {p.city} / {p.beds} / sleeps {p.guests}
                  </div>

                  {/* Footer row */}
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

            // Shared className for both the Link and div wrappers
            const cardClasses = `
              lift bg-bone rounded-[18px] overflow-hidden
              border border-line relative no-underline text-ink
              ${p.unavailable ? "cursor-not-allowed opacity-55" : "cursor-pointer"}
            `;

            // Unavailable properties render as a non-clickable div.
            // Available properties wrap in a Link to /stays/[slug].
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
      </div>
    </section>
  );
}