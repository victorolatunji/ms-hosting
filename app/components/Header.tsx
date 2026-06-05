"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Globe, ChevronDown } from "lucide-react";

const CURRENCIES = ["CAD", "USD", "EUR", "GBP", "AUD"] as const;
type Currency = (typeof CURRENCIES)[number];

const NAV_LINKS = [
  { label: "Stays", href: "/#stays" },
  { label: "Cities", href: "/#cities" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("CAD");
  const [showCurrency, setShowCurrency] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
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
            className="rounded-full object-cover bg-bone border border-line"
          />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">M&amp;S Hosting</div>
            <div className="font-mono text-[9px] tracking-[0.22em] text-ink-soft uppercase mt-0.5">
              Greater Toronto Area
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

          <button className="bg-moss text-bone border-none px-[22px] py-[11px] rounded-full text-[13px] font-medium cursor-pointer tracking-[0.02em]">
            Sign in
          </button>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          className="md:hidden bg-transparent border border-line text-ink p-2.5 rounded-full cursor-pointer flex items-center justify-center"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-bone border-t border-line px-5 pt-2 pb-[22px]">
          {[...NAV_LINKS, { label: "Terms", href: "#terms" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-4 border-b border-line text-ink no-underline text-[15px]"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex gap-2 mt-[18px]">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`flex-1 p-[11px] rounded-[10px] text-xs cursor-pointer border ${
                  c === currency
                    ? "bg-moss text-bone border-moss"
                    : "bg-transparent text-ink border-line"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button className="w-full mt-3.5 bg-clay text-bone border-none p-3.5 rounded-full text-sm font-medium cursor-pointer">
            Sign in
          </button>
        </div>
      )}
    </header>
  );
}