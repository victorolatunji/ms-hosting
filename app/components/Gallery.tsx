"use client";
// Listing photo gallery.
// Desktop: one large photo + four small in a grid, "Show all photos" opens the viewer.
// Mobile: swipeable strip with a photo counter. Tapping any photo opens the viewer.
// Viewer: full-screen, arrow keys / swipe / buttons, Esc to close.

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Grid2X2, X } from "lucide-react";

type Props = { photos: string[]; name: string; tag?: string | null };

export default function Gallery({ photos, name, tag }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const total = photos.length;
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + total) % total)),
    [total]
  );

  // Keyboard controls + lock page scroll while the viewer is open
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  if (total === 0) return null;

  const onStripScroll = () => {
    const el = stripRef.current;
    if (el) setMobileIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const badge = tag && (
    <div className="pointer-events-none absolute left-4 top-4 z-[2] flex items-center gap-2 rounded-full bg-bone px-3.5 py-2 text-[12px] font-medium tracking-[0.02em] text-moss">
      <span className="h-1.5 w-1.5 rotate-45 bg-clay" />
      {tag}
    </div>
  );

  return (
    <>
      {/* MOBILE: swipe strip */}
      <div className="relative md:hidden">
        {badge}
        <div
          ref={stripRef}
          onScroll={onStripScroll}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-[22px] border border-line [scrollbar-width:none]"
        >
          {photos.map((src, i) => (
            <button
              key={src}
              onClick={() => setOpen(i)}
              className="aspect-[4/3] w-full shrink-0 snap-center border-none bg-line p-0"
              aria-label={`Open photo ${i + 1} of ${total}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${name}, photo ${i + 1}`}
                loading={i < 2 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/60 px-2.5 py-1 font-mono text-[11px] text-bone">
          {mobileIndex + 1} / {total}
        </div>
      </div>

      {/* DESKTOP: 1 large + 4 small */}
      <div className="relative hidden md:block">
        {badge}
        <div className="grid aspect-[16/10] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[22px] border border-line">
          {photos.slice(0, 5).map((src, i) => (
            <button
              key={src}
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden border-none bg-line p-0 ${i === 0 ? "col-span-2 row-span-2" : ""} ${total === 1 ? "col-span-4" : ""}`}
              aria-label={`Open photo ${i + 1} of ${total}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${name}, photo ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
        {total > 1 && (
          <button
            onClick={() => setOpen(0)}
            className="absolute bottom-4 right-4 flex cursor-pointer items-center gap-2 rounded-full border border-ink/15 bg-bone px-4 py-2 text-[13px] font-medium text-ink shadow-sm hover:bg-bone-soft"
          >
            <Grid2X2 size={14} /> Show all {total} photos
          </button>
        )}
      </div>

      {/* VIEWER */}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photos`}
          className="fixed inset-0 z-[100] flex flex-col bg-ink/95"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-bone">
            <span className="font-mono text-[12px] tracking-[0.1em]">
              {open + 1} / {total}
            </span>
            <button
              onClick={close}
              aria-label="Close photos"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-bone/10 text-bone hover:bg-bone/20"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-2 pb-6 md:px-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[open]}
              alt={`${name}, photo ${open + 1}`}
              className="max-h-full max-w-full select-none rounded-lg object-contain"
            />
            {total > 1 && (
              <>
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-bone/90 text-ink md:flex"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-bone/90 text-ink md:flex"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
