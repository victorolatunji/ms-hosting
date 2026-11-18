"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import SavedLink from "./SavedLink";
import LegalLink from "./legal/LegalLink";
import { lockScroll } from "@/lib/scroll-lock";

import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "./CurrencyContext";

const NAV_LINKS = [
  { label: "Stays", href: "/#stays" },
  { label: "Cities", href: "/#cities" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

// Where the header CTA sends people: the host page, scrolled to its form.
const HOST_HREF = "/become-a-host#host-form";

export default function Header() {
  const path = usePathname();
  // The menu remembers which page it was opened on, so it closes itself on navigation.
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const menuOpen = menuFor !== null && menuFor === path;
  const setMenuOpen = (open: boolean) => setMenuFor(open ? path : null);
  const { currency, setCurrency } = useCurrency();
  const [showCurrency, setShowCurrency] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const topMarker = useRef<HTMLDivElement>(null);

  // Solid header once the page has moved off the very top.
  // An IntersectionObserver always reports the starting position, so the header
  // is right even when the phone restores a scroll position or jumps to a #link
  // before the page's JavaScript is ready (the old scroll listener missed that,
  // leaving a see-through header over the content).
  useEffect(() => {
    const el = topMarker.current;
    const check = () => setScrolled(window.scrollY > 40);
    check();
    let io: IntersectionObserver | undefined;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
      io.observe(el);
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("pageshow", check);
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("pageshow", check);
    };
  }, []);

  // While the menu is open: the page behind stays still, Esc closes it.
  useEffect(() => {
    if (!menuOpen) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuFor(null); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      {/* Invisible marker 40px tall at the very top of the page. */}
      <div ref={topMarker} aria-hidden className="pointer-events-none absolute left-0 top-0 h-10 w-px" />

      <header
        className={`sticky top-0 transition-[background-color,border-color] duration-300 ${menuOpen ? "z-[70]" : "z-50"} ${
          menuOpen
            ? "bg-bone border-b border-line" // no blur while open: blur would trap the dimmed backdrop inside the header
            : solid
            ? "bg-bone/95 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 no-underline text-ink shrink-0">
            <Image
              src="/images/logo.jpeg"
              alt="M&S Hosting Solutions"
              width={42}
              height={42}
              priority
              className="rounded-full object-cover bg-bone border border-line"
            />
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">M&amp;S Hosting</div>
              <div className="font-mono text-[9px] tracking-[0.22em] text-ink-soft uppercase mt-0.5">
                Ontario · Hosted in person
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline-link text-ink text-sm tracking-[0.01em] no-underline"
              >
                {link.label}
              </Link>
            ))}

            <SavedLink />

            <div className="relative">
              <button
                onClick={() => setShowCurrency(!showCurrency)}
                className="bg-transparent border border-line text-ink px-3.5 py-2 rounded-full text-[13px] cursor-pointer flex items-center gap-1.5"
              >
                <Globe size={14} /> {currency} <ChevronDown size={12} />
              </button>

              {showCurrency && (
                <div className="absolute top-full right-0 mt-2 bg-bone border border-line rounded-xl p-1.5 min-w-[130px] z-[60] shadow-[0_14px_36px_-10px_rgba(31,37,33,0.18)]">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setShowCurrency(false);
                      }}
                      className={`block w-full text-left px-3.5 py-2 rounded-lg text-[13px] border-none cursor-pointer ${
                        c === currency
                          ? "bg-clay/10 text-clay"
                          : "bg-transparent text-ink"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={HOST_HREF}
              className="bg-moss text-bone px-[22px] py-[11px] rounded-full text-[13px] font-medium tracking-[0.02em] no-underline inline-block"
            >
              Become a Host
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Menu"}
            aria-expanded={menuOpen}
            className="md:hidden bg-transparent border border-line text-ink p-2.5 rounded-full cursor-pointer flex items-center justify-center"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <>
            {/* Dim the page; tap it to close. Sits under the menu, over everything else. */}
            <div
              aria-hidden
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 top-[71px] -z-10 bg-ink/40"
            />
            {/* Drops down over the page (doesn't push it), and scrolls on short screens. */}
            <div className="md:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-71px)] overflow-y-auto overscroll-contain bg-moss-dark border-t border-bone/10 px-5 pt-2 pb-[22px] shadow-[0_24px_40px_-20px_rgba(31,37,33,0.6)]">
              {[...NAV_LINKS, { label: "Saved stays", href: "/saved" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 border-b border-bone/10 text-bone/85 no-underline text-[15px] hover:text-amber"
                >
                  {link.label}
                </Link>
              ))}
              <LegalLink
                href="/terms"
                className="block py-4 border-b border-bone/10 text-bone/85 no-underline text-[15px] hover:text-amber"
              >
                Terms
              </LegalLink>

              <div className="flex gap-2 mt-[18px]">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex-1 p-[11px] rounded-[10px] text-xs cursor-pointer border ${
                      c === currency
                        ? "bg-amber text-moss-dark border-amber font-medium"
                        : "bg-transparent text-bone/80 border-bone/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <Link
                href={HOST_HREF}
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full mt-3.5 bg-clay text-bone p-3.5 rounded-full text-sm font-medium no-underline"
              >
                Become a Host
              </Link>
            </div>
          </>
        )}
      </header>
    </>
  );
}
