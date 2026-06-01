"use client";
// Uses useState for the favorites toggle, so this is a client component.

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";

// The 11 properties M&S manages, real data from the wishlist.
// In Phase 3 this will move to Supabase and be fetched server-side.
// "img" paths point to /public/images/properties/.
// The unavailable flag is kept on the type so admins can mark a property
// offline (e.g. mid-renovation) without removing it from the database.
type Property = {
  id: number;
  name: string;
  city: string;
  blurb: string;
  beds: string;
  guests: number;
  rating: number | null;   // null = new listing, no reviews yet
  reviews: number;
  img: string;
  tag: string | null;       // small badge over the photo, e.g. "Superhost"
  unavailable?: boolean;    // shows the "Not available for hosting" stamp
};

const PROPERTIES: Property[] = [
  {
    id: 1,
    name: "Black & Gold Hot Tub Retreat",
    city: "Toronto",
    blurb: "A moody, golden-lit escape twenty minutes from downtown, with a private hot tub for slow evenings.",
    beds: "2 queen beds",
    guests: 4,
    rating: null,
    reviews: 0,
    img: "/images/properties/01-black-gold-toronto.jpg",
    tag: "Superhost",
  },
  {
    id: 2,
    name: "Cozy Toes and City Glows",
    city: "Toronto",
    blurb: "A warm guest suite with the city skyline at the door. Perfect for two couples or a small family.",
    beds: "2 beds",
    guests: 4,
    rating: 4.95,
    reviews: 84,
    img: "/images/properties/02-cozy-toes-toronto.jpg",
    tag: "Top guest favourite",
  },
  {
    id: 3,
    name: "Modern 2BR Upper Duplex",
    city: "Oshawa",
    blurb: "Bright, fully private upper duplex with thoughtful finishes. A clean, quiet base for longer stays.",
    beds: "2 beds",
    guests: 4,
    rating: null,
    reviews: 0,
    img: "/images/properties/03-modern-duplex-oshawa.jpg",
    tag: "New place to stay",
  },
  {
    id: 4,
    name: "4BR Retreat with Hot Tub",
    city: "Oshawa",
    blurb: "Hot tub, BBQ, pool table, and room for everyone. Built for friends and family weekends.",
    beds: "5 beds",
    guests: 10,
    rating: 4.80,
    reviews: 47,
    img: "/images/properties/04-4br-retreat-oshawa.jpg",
    tag: "Superhost",
  },
  {
    id: 5,
    name: "Karibu Home Retreat",
    city: "Ajax",
    blurb: "A welcoming family home minutes from the 401, hosted with the warmth the name promises.",
    beds: "3 queen beds",
    guests: 6,
    rating: 4.64,
    reviews: 62,
    img: "/images/properties/05-karibu-ajax.jpg",
    tag: "Superhost",
  },
  {
    id: 6,
    name: "Spacious Home with Movie Lounge",
    city: "Ajax",
    blurb: "Sprawling layout with a private movie lounge and easy GO Train access to downtown Toronto.",
    beds: "3 beds",
    guests: 6,
    rating: 4.77,
    reviews: 78,
    img: "/images/properties/06-movie-lounge-ajax.jpg",
    tag: "Top guest favourite",
  },
  {
    id: 7,
    name: "Fully Private Hot Tub Suite",
    city: "Pickering",
    blurb: "A self-contained main floor suite with private hot tub access. Quiet, romantic, walkable to transit.",
    beds: "1 queen bed",
    guests: 2,
    rating: 4.89,
    reviews: 91,
    img: "/images/properties/07-hot-tub-suite-pickering.jpg",
    tag: "Top guest favourite",
  },
  {
    id: 8,
    name: "Serene Urban Retreat",
    city: "Whitby",
    blurb: "A perfect 5.0 rated home, fifteen minutes on foot from Thermea Spa Village. Built for unwinding.",
    beds: "3 beds",
    guests: 6,
    rating: 5.00,
    reviews: 38,
    img: "/images/properties/08-serene-retreat-whitby.jpg",
    tag: null,
  },
  {
    id: 9,
    name: "Luxury Recreation Retreat",
    city: "Uxbridge",
    blurb: "Five king beds, full recreation amenities, the GTA countryside at your back door. Group escapes done right.",
    beds: "5 king beds",
    guests: 12,
    rating: 5.00,
    reviews: 24,
    img: "/images/properties/09-luxury-uxbridge.jpg",
    tag: null,
  },
  {
    id: 10,
    name: "Urban Zen Retreat",
    city: "Whitby",
    blurb: "A calm, considered home a short walk from Thermea. Booked up fast, especially on weekends.",
    beds: "4 beds",
    guests: 8,
    rating: 4.84,
    reviews: 56,
    img: "/images/properties/10-urban-zen-whitby.jpg",
    tag: "Guest favourite",
  },
  {
    id: 11,
    name: "Modern Townhouse, Square One",
    city: "Mississauga",
    blurb: "Five minutes from Square One with free parking. Polished, central, easy to recommend.",
    beds: "3 beds",
    guests: 6,
    rating: 4.60,
    reviews: 32,
    img: "/images/properties/11-square-one-mississauga.jpg",
    tag: null,
  },
];

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

        {/* Property grid, same auto-fit pattern as Cities */}
        <div
          className="grid gap-7 max-sm:grid-cols-1"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {PROPERTIES.map((p) => (
            <article
              key={p.id}
              className={`
                lift bg-bone rounded-[18px] overflow-hidden
                border border-line relative
                ${p.unavailable ? "cursor-not-allowed opacity-55" : "cursor-pointer"}
              `}
            >
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

                {/* Property tag (e.g. "Superhost"), top-left */}
                {p.tag && !p.unavailable && (
                  <div className="absolute top-3.5 left-3.5 bg-bone text-moss px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.02em] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-clay rotate-45" />
                    {p.tag}
                  </div>
                )}

                {/* Favorite heart button, top-right.
                    Only shown on available properties. */}
                {!p.unavailable && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
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

                {/* Footer row: "Enquire for rates" on the left, review count on the right.
                    Divider line above per the design. */}
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}