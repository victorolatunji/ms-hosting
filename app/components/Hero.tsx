"use client";
// Hero section. Hooks into SearchContext to submit search filters.

import { useState, useRef } from "react";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import { CITIES } from "@/lib/cities";
import { useSearch } from "./SearchContext";

export default function Hero() {
  const { submitSearch } = useSearch();

  const [city, setCity] = useState<string>("");
  const [checkin, setCheckin] = useState<string>("");
  const [checkout, setCheckout] = useState<string>("");
  const [guests, setGuests] = useState<number>(0);
  const [cityOpen, setCityOpen] = useState<boolean>(false);

  // Refs to the hidden date inputs so we can imperatively call showPicker()
  // when the user clicks the visible cell.
  const checkinRef = useRef<HTMLInputElement>(null);
  const checkoutRef = useRef<HTMLInputElement>(null);

  // Open the calendar picker for the given input.
  // showPicker() is supported in all modern browsers and is the canonical
  // way to programmatically open date pickers.
  const openPicker = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      // Older browsers without showPicker fall back to focusing,
      // which at least lets the user start typing the date.
      el.focus();
    }
  };

  const cityLabel = city
    ? CITIES.find((c) => c.slug === city)?.name ?? "Anywhere in the GTA"
    : "Anywhere in the GTA";

  const guestsLabel = guests === 0
    ? "Add guests"
    : `${guests} guest${guests === 1 ? "" : "s"}`;

  const formatDate = (iso: string): string => {
    if (!iso) return "Add dates";
    try {
      const [y, m, d] = iso.split("-").map(Number);
      const date = new Date(y, (m ?? 1) - 1, d ?? 1);
      return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch({ city, checkin, checkout, guests });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center px-6 pt-10 pb-20 md:px-6 md:pt-10 md:pb-20">

      <div
        className="
          absolute overflow-hidden
          right-[-4vw] top-[6%] w-[46vw] max-w-[600px] h-[85%]
          shadow-[0_50px_100px_-40px_rgba(31,37,33,0.45)]
          max-md:right-[-16vw] max-md:top-auto max-md:bottom-[-6vh]
          max-md:w-[86vw] max-md:h-[44vh] max-md:opacity-35
        "
        style={{ borderRadius: "50% 50% 8px 8px / 30% 30% 8px 8px" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-moss/30" />
      </div>

      <div
        className="
          hidden md:flex
          absolute right-[6vw] bottom-[60px]
          w-[130px] h-[130px] rounded-full
          border border-clay text-clay
          items-center justify-center text-center
          text-[10px] tracking-[0.24em] uppercase leading-relaxed
          bg-bone/55 backdrop-blur-sm
        "
        style={{ transform: "rotate(-8deg)" }}
      >
        <span>
          Hosted<br />
          in person<br />
          <span className="font-display italic text-[22px] tracking-normal">
            by Maddie &amp; Sam
          </span>
        </span>
      </div>

      <div className="relative z-[2] max-w-[1320px] mx-auto w-full">
        <div className="max-w-[660px]">
          <div className="fade-up mb-7">
            <Eyebrow>A GTA Collection</Eyebrow>
          </div>

          <h1
            className="font-display fade-up text-moss font-medium leading-[0.98] mb-8"
            style={{
              fontSize: "clamp(46px, 8vw, 92px)",
              animationDelay: ".1s",
            }}
          >
            Settle in.<br />
            <span className="italic text-clay font-normal">Stay a while.</span>
          </h1>

          <p
            className="fade-up leading-[1.65] text-ink-soft max-w-[520px] mb-12"
            style={{
              fontSize: "clamp(16px, 1.6vw, 19px)",
              animationDelay: ".2s",
            }}
          >
            Eleven carefully kept homes across seven cities in the Greater Toronto Area,
            hosted in person by Madeline and Samuel Jean-Louis.
          </p>

          <form
            onSubmit={handleSubmit}
            className="
              fade-up bg-bone border border-line rounded-[18px] p-2
              shadow-[0_30px_80px_-30px_rgba(31,37,33,0.25)]
              grid gap-1 max-w-[600px]
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
            "
            style={{ animationDelay: ".3s" }}
          >
            {/* WHERE cell with dropdown */}
            <div className="relative">
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
                    Anywhere in the GTA
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
                The whole cell is a button that imperatively opens the
                hidden input's calendar picker. Reliable across browsers. */}
            <button
              type="button"
              onClick={() => openPicker(checkinRef)}
              className="text-left px-[14px] py-3 rounded-xl cursor-pointer hover:bg-bone-soft transition-colors relative"
            >
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft mb-1 flex items-center gap-1.5">
                <Calendar size={14} /> Check in
              </div>
              <div className="text-sm font-medium text-ink truncate">
                {formatDate(checkin)}
              </div>
              {/* The actual date input is tucked off-screen but still in the DOM,
                  so its picker can be summoned. sr-only positions it for
                  screen readers without affecting layout. */}
              <input
                ref={checkinRef}
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                aria-label="Check in date"
                className="sr-only"
              />
            </button>

            {/* CHECK OUT, same pattern */}
            <button
              type="button"
              onClick={() => openPicker(checkoutRef)}
              className="text-left px-[14px] py-3 rounded-xl cursor-pointer hover:bg-bone-soft transition-colors relative"
            >
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft mb-1 flex items-center gap-1.5">
                <Calendar size={14} /> Check out
              </div>
              <div className="text-sm font-medium text-ink truncate">
                {formatDate(checkout)}
              </div>
              <input
                ref={checkoutRef}
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                min={checkin || undefined}
                aria-label="Check out date"
                className="sr-only"
              />
            </button>

            {/* GUESTS with +/- stepper. No upper cap. */}
            <div className="px-[14px] py-3 rounded-xl">
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
      </div>
    </section>
  );
}