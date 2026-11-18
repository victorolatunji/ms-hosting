"use client";
// Hero section. Hooks into SearchContext to submit search filters.

import { useState } from "react";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import { CITIES } from "@/lib/cities";
import { PROPERTIES, type Property } from "@/lib/properties";
import { capWords, toWords } from "@/lib/words";
import { useSearch } from "./SearchContext";
import HeroMotion, { type Slide } from "./HeroMotion";
import { siteStats } from "@/lib/perks";

// Homes featured in the moving postcard (first photo of each).
const FEATURED = ["hot-tub-oasis", "black-gold-hot-tub-retreat", "whitby-luxury-designer-home", "sunset-estate", "upscale-urban-retreat", "wonderland-hot-tub-suite"];
export default function Hero({ properties = PROPERTIES }: { properties?: Property[] }) {
  const SLIDES: Slide[] = FEATURED.map((slug) => properties.find((p) => p.slug === slug && !p.unavailable))
    .filter((p): p is Property => Boolean(p))
    .map((p) => ({ src: p.img, name: p.name, city: p.city, href: `/stays/${p.slug}` }));
  const STATS = siteStats(properties);

  const { submitSearch } = useSearch();

  const [city, setCity] = useState<string>("");
  const [checkin, setCheckin] = useState<string>("");
  const [checkout, setCheckout] = useState<string>("");
  const [guests, setGuests] = useState<number>(0);
  const [cityOpen, setCityOpen] = useState<boolean>(false);

  const cityLabel = city
    ? CITIES.find((c) => c.slug === city)?.name ?? "Anywhere in Ontario"
    : "Anywhere in Ontario";

  const guestsLabel = guests === 0
    ? "Add guests"
    : `${guests} guest${guests === 1 ? "" : "s"}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch({ city, checkin, checkout, guests });
  };

  return (
    <section className="relative overflow-hidden lg:min-h-[88vh] lg:flex lg:items-center">
      {/* MOBILE + TABLET: headline first, then the arched moving postcard */}
      <div className="px-4 pt-5 md:px-8 lg:hidden">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-bone px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
          <span className="h-1.5 w-1.5 rotate-45 bg-clay" /> {STATS.homes} homes · {STATS.cities} cities
        </div>
        <h1 className="m-0 mb-5 font-display font-medium leading-[0.95] text-moss" style={{ fontSize: "clamp(42px, 11vw, 72px)" }}>
          Settle in.<br />
          <span className="italic font-normal text-clay">Stay a while.</span>
        </h1>
        <HeroMotion
          slides={SLIDES}
          controls="top"
          className="flow-edges h-[54vh] min-h-[340px] max-h-[600px] shadow-[0_30px_60px_-30px_rgba(31,37,33,0.45)]"
        />
      </div>

      <div className="relative z-[3] mx-auto w-full max-w-[1320px] px-4 md:px-8 lg:px-6 lg:py-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
          <div>
            {/* Desktop headline */}
            <div className="hidden lg:block">
              <div className="fade-up mb-7"><Eyebrow>{capWords(STATS.homes)} homes, {toWords(STATS.cities)} cities</Eyebrow></div>
              <h1 className="fade-up mb-8 font-display font-medium leading-[0.98] text-moss" style={{ fontSize: "clamp(56px, 6.4vw, 96px)", animationDelay: ".1s" }}>
                Settle in.<br />
                <span className="italic font-normal text-clay">Stay a while.</span>
              </h1>
            </div>

            {/* Search card: overlaps the photo on mobile */}
            <div className="relative z-[4] -mt-14 px-2 md:px-6 lg:mt-0 lg:px-0">
          <form
              onSubmit={handleSubmit}
              className="
                fade-up bg-bone border border-line rounded-[18px] p-2
                shadow-[0_30px_80px_-30px_rgba(31,37,33,0.25)]
                grid gap-1 w-full max-w-[600px]
                grid-cols-2 lg:grid-cols-4
              "
              style={{ animationDelay: ".3s" }}
            >
              {/* WHERE cell with city dropdown */}
              <div className="relative col-span-2 lg:col-span-1">
                <button
                  type="button"
                  onClick={() => setCityOpen((open) => !open)}
                  className="w-full text-left px-[14px] py-3 rounded-xl cursor-pointer hover:bg-bone-soft transition-colors"
                >
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft mb-1 flex items-center gap-1.5">
                    <MapPin size={14} /> Where
                  </div>
                  <div className="text-sm font-medium text-ink flex items-center justify-between gap-2">
                    <span className="truncate">{cityLabel}</span>
                    <ChevronDown size={12} className="text-ink-soft shrink-0" />
                  </div>
                </button>
  
                {cityOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-bone border border-line rounded-xl p-1.5 z-30 shadow-[0_14px_36px_-10px_rgba(31,37,33,0.18)] min-w-[200px]">
                    <button
                      type="button"
                      onClick={() => { setCity(""); setCityOpen(false); }}
                      className={`block w-full text-left px-3.5 py-2 rounded-lg text-[13px] cursor-pointer ${
                        city === "" ? "bg-clay/10 text-clay" : "text-ink hover:bg-bone-soft"
                      }`}
                    >
                      Anywhere in Ontario
                    </button>
                    {CITIES.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => { setCity(c.slug); setCityOpen(false); }}
                        className={`block w-full text-left px-3.5 py-2 rounded-lg text-[13px] cursor-pointer ${
                          city === c.slug ? "bg-clay/10 text-clay" : "text-ink hover:bg-bone-soft"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
  
              {/* CHECK IN.
                  Native date input is now visible and styled to match the cell.
                  iOS shows its wheel picker, Android its calendar, desktop its popup picker.
                  Reliable across every browser. */}
              <div className="px-[14px] py-3 rounded-xl hover:bg-bone-soft transition-colors">
                <label className="block cursor-pointer">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft mb-1 flex items-center gap-1.5">
                    <Calendar size={14} /> Check in
                  </div>
                  <input
                    type="date"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    // Border, padding, font etc. all stripped so it blends in
                    className="bg-transparent text-sm font-medium text-ink w-full border-none p-0 m-0 outline-none cursor-pointer"
                    // iOS Safari needs this to render the placeholder color correctly
                    style={{ minHeight: "1.25rem" }}
                  />
                </label>
              </div>
  
              {/* CHECK OUT, same pattern */}
              <div className="px-[14px] py-3 rounded-xl hover:bg-bone-soft transition-colors">
                <label className="block cursor-pointer">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft mb-1 flex items-center gap-1.5">
                    <Calendar size={14} /> Check out
                  </div>
                  <input
                    type="date"
                    value={checkout}
                    onChange={(e) => setCheckout(e.target.value)}
                    min={checkin || undefined}
                    className="bg-transparent text-sm font-medium text-ink w-full border-none p-0 m-0 outline-none cursor-pointer"
                    style={{ minHeight: "1.25rem" }}
                  />
                </label>
              </div>
  
              {/* GUESTS with stepper */}
              <div className="col-span-2 lg:col-span-1 px-[14px] py-3 rounded-xl">
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft mb-1 flex items-center gap-1.5">
                  <Users size={14} /> Guests
                </div>
                <div className="text-sm font-medium text-ink flex items-center justify-between gap-2">
                  <span className="truncate">{guestsLabel}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(0, g - 1))}
                      disabled={guests === 0}
                      aria-label="Decrease guests"
                      className="w-6 h-6 rounded-full border border-line text-ink flex items-center justify-center text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bone-soft"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => g + 1)}
                      aria-label="Increase guests"
                      className="w-6 h-6 rounded-full border border-line text-ink flex items-center justify-center text-sm cursor-pointer hover:bg-bone-soft"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
  
              <button
                type="submit"
                className="bg-clay text-bone border-none rounded-xl px-[18px] py-3.5 flex items-center justify-center gap-2 font-medium cursor-pointer text-sm col-span-full hover:bg-clay-soft transition-colors"
              >
                <Search size={15} /> Find a stay to book
              </button>
            </form>
            </div>

            <p className="fade-up mt-6 mb-10 max-w-[520px] leading-[1.65] text-ink-soft lg:mb-0" style={{ fontSize: "clamp(15px, 1.4vw, 18px)", animationDelay: ".2s" }}>
              {capWords(STATS.homes)} carefully kept homes across {toWords(STATS.cities)} Ontario cities,
              hosted in person by Sam and Maddie Jean-Louis.
            </p>
          </div>

          {/* DESKTOP: arched moving postcard + spinning stamp */}
          <div className="relative hidden lg:block">
            <HeroMotion
              slides={SLIDES}
              className="flow-edges h-[78vh] max-h-[760px] shadow-[0_50px_100px_-40px_rgba(31,37,33,0.45)]"
            />
            <div className="pointer-events-none absolute -bottom-8 -left-10 z-[3] flex h-[136px] w-[136px] items-center justify-center rounded-full border border-clay bg-bone/80 text-clay backdrop-blur-sm">
              <svg viewBox="0 0 136 136" className="stamp-spin absolute inset-0 h-full w-full" aria-hidden="true">
                <defs><path id="stampPath" d="M68,68 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" /></defs>
                <text fill="currentColor" style={{ font: "500 10px var(--font-mono, monospace)", letterSpacing: "0.32em" }}>
                  <textPath href="#stampPath">HOSTED IN PERSON · HOSTED IN PERSON ·</textPath>
                </text>
              </svg>
              <span className="font-display text-[19px] italic leading-tight text-center">Sam<br />&amp; Maddie</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
