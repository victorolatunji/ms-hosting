"use client";
// Month calendar for direct bookings: booked nights are crossed out, guests tap
// check-in then check-out. All rules live in lib/stay-dates.ts (tested).
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fromParts, pick, selectable, nightBlocked, toDay, type Range } from "@/lib/stay-dates";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS_AHEAD = 12;

type Props = {
  blocked: Range[];
  checkin: string;
  checkout: string;
  onChange: (checkin: string, checkout: string) => void;
};

export default function AvailabilityCalendar({ blocked, checkin, checkout, onChange }: Props) {
  const today = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD
  const [ty, tm] = today.split("-").map(Number);
  const start = checkin ? checkin.split("-").map(Number) : [ty, tm];
  const [view, setView] = useState({ y: start[0], m: start[1] - 1 }); // m is 0-based

  const monthIndex = (view.y - ty) * 12 + (view.m - (tm - 1));
  const canPrev = monthIndex > 0;
  const canNext = monthIndex < MONTHS_AHEAD - 1;
  const shift = (n: number) =>
    setView(({ y, m }) => {
      const t = new Date(Date.UTC(y, m + n, 1));
      return { y: t.getUTCFullYear(), m: t.getUTCMonth() };
    });

  const firstDow = new Date(Date.UTC(view.y, view.m, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const label = new Date(Date.UTC(view.y, view.m, 1)).toLocaleDateString("en-CA", { month: "long", year: "numeric", timeZone: "UTC" });
  const pickingCheckout = Boolean(checkin) && !checkout;

  const cells: (string | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => fromParts(view.y, view.m, i + 1)),
  ];

  return (
    <div className="rounded-xl border border-line p-2 sm:p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-ink hover:bg-bone-soft disabled:cursor-default disabled:opacity-30">
          <ChevronLeft size={18} />
        </button>
        <div className="font-display text-[18px] text-moss" aria-live="polite">{label}</div>
        <button type="button" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-ink hover:bg-bone-soft disabled:cursor-default disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
        {WEEKDAYS.map((w) => <div key={w} className="py-1.5">{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-y-1" role="grid" aria-label={`Availability for ${label}`}>
        {cells.map((d, i) => {
          if (!d) return <div key={`pad-${i}`} />;
          const past = toDay(d) < toDay(today);
          const booked = !past && nightBlocked(d, blocked);
          const can = selectable(d, today, checkin, checkout, blocked);
          const isIn = d === checkin;
          const isOut = d === checkout;
          const inRange = Boolean(checkin && checkout) && toDay(d) > toDay(checkin) && toDay(d) < toDay(checkout);
          const day = Number(d.slice(8));
          const nice = new Date(`${d}T12:00:00Z`).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
          const state = isIn ? "check-in" : isOut ? "check-out" : booked ? "booked" : past ? "past" : "available";
          return (
            <div key={d} className={`flex min-w-0 justify-center ${inRange ? "bg-clay/12" : ""} ${isIn && checkout ? "rounded-l-full bg-clay/12" : ""} ${isOut ? "rounded-r-full bg-clay/12" : ""}`}>
              <button
                type="button"
                disabled={!can}
                onClick={() => { const [a, b] = pick(d, today, checkin, checkout, blocked); onChange(a, b); }}
                aria-label={`${nice}, ${state}`}
                aria-pressed={isIn || isOut}
                className={[
                  "relative flex aspect-square w-full max-w-10 items-center justify-center rounded-full border-none p-0 text-[14px] transition-colors",
                  isIn || isOut ? "bg-clay font-medium text-bone" : "bg-transparent",
                  !isIn && !isOut && can ? "cursor-pointer text-ink hover:bg-bone-soft" : "",
                  !can && !isIn && !isOut ? "cursor-default" : "",
                  past ? "text-ink-soft/35" : "",
                  booked && !isIn && !isOut ? "text-ink-soft/55 line-through decoration-clay/70 decoration-2" : "",
                  !can && !past && !booked && pickingCheckout ? "text-ink-soft/35" : "",
                ].join(" ")}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[12px] text-ink-soft">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-clay" /> Your dates</span>
          <span className="flex items-center gap-1.5"><span className="line-through decoration-clay/70 decoration-2">14</span> Booked</span>
        </span>
        {(checkin || checkout) && (
          <button type="button" onClick={() => onChange("", "")} className="cursor-pointer border-none bg-transparent p-0 text-[12px] text-clay underline">
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
}
