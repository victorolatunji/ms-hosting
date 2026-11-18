"use client";
// "Moving postcard": a slow, cinematic crossfade through real M&S homes with a
// gentle Ken Burns drift. Lighter and safer than a video file:
//  - only the current and next photo are ever loaded
//  - pauses when scrolled off screen or the tab is hidden
//  - respects "reduce motion" (no zoom, slow fade)
// To use a real video later, set HERO_VIDEO below to "/hero.mp4" (+ a poster).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type Slide = { src: string; name: string; city: string; href: string };

const HERO_VIDEO: { src: string; poster: string } | null = null;
const SLIDE_MS = 6500;

export default function HeroMotion({
  slides,
  className = "",
  controls = "bottom",
}: {
  slides: Slide[];
  className?: string;
  controls?: "top" | "bottom"; // top = keep clear of anything overlapping the bottom edge
}) {
  const [i, setI] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  // Advance while visible and the tab is active
  useEffect(() => {
    if (HERO_VIDEO || slides.length < 2) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.1 });
    if (box.current) io.observe(box.current);
    const t = window.setInterval(() => {
      if (visible.current && !document.hidden) setI((n) => (n + 1) % slides.length);
    }, SLIDE_MS);
    return () => { window.clearInterval(t); io.disconnect(); };
  }, [slides.length]);

  // Only the previous (fading out), current, and next (preloading) photos are in the DOM.
  const len = slides.length;
  const mounted = (n: number) => n === i || n === (i + 1) % len || n === (i - 1 + len) % len;

  const cur = slides[i];

  return (
    <div ref={box} className={`relative overflow-hidden bg-moss ${className}`}>
      {HERO_VIDEO ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO.src}
          poster={HERO_VIDEO.poster}
          autoPlay muted loop playsInline preload="metadata"
          aria-hidden="true"
        />
      ) : (
        slides.map((s, n) =>
          mounted(n) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.src}
              src={s.src}
              alt=""
              aria-hidden="true"
              fetchPriority={n === 0 ? "high" : "low"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${
                n === i ? "kenburns opacity-100" : "opacity-0"
              }`}
              style={{ animationDuration: `${SLIDE_MS + 1500}ms` }}
            />
          ) : null
        )
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink/40" />
      {/* Soft inner edge so the photo melts into the page instead of a hard frame */}
      <div className="pointer-events-none absolute inset-0 z-[1] shadow-[inset_0_0_60px_18px_rgba(245,239,229,0.28)]" />

      {/* Caption: which home you are looking at */}
      {!HERO_VIDEO && cur && (
        <Link
          href={cur.href}
          className={`absolute ${controls === "top" ? "top-[16%]" : "bottom-4"} left-1/2 z-[2] flex max-w-[86%] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-bone/90 px-3.5 py-2 text-[12px] text-ink no-underline backdrop-blur-sm transition-colors hover:text-clay`}
        >
          <span className="h-1.5 w-1.5 rotate-45 bg-clay" />
          <span key={cur.src} className="fade-in truncate font-medium">{cur.name}</span>
          <span className="text-ink-soft">· {cur.city}</span>
        </Link>
      )}

      {/* Progress dashes */}
      {!HERO_VIDEO && slides.length > 1 && (
        <div className={`absolute ${controls === "top" ? "top-[calc(16%+44px)]" : "bottom-16"} left-1/2 z-[2] flex -translate-x-1/2 gap-1.5`} aria-hidden="true">
          {slides.map((s, n) => (
            <span key={s.src} className="h-[3px] w-5 overflow-hidden rounded-full bg-bone/35">
              {n === i && <span className="slide-progress block h-full bg-bone" style={{ animationDuration: `${SLIDE_MS}ms` }} />}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
