"use client";
// Popup that shows a legal page (terms, privacy, cookies, cancellation policy)
// on top of the current page, so guests can read it and close it without
// losing their place or anything they typed in a form.
// Phones: a sheet that slides up from the bottom. Desktop: a centred panel.
// Closes with the X, the Close button, Esc, or a tap outside.

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { LEGAL_PROSE } from "./prose";
import { lockScroll } from "@/lib/scroll-lock";
import { isLegalPath, type LegalPath } from "./paths";

// Each document only downloads the first time someone opens it.
const DOCS = {
  "/terms": { title: "Terms of Use and Booking", Body: lazy(() => import("./TermsBody")) },
  "/privacy": { title: "Privacy Policy", Body: lazy(() => import("./PrivacyBody")) },
  "/cookies": { title: "Cookies", Body: lazy(() => import("./CookiesBody")) },
  "/cancellations": { title: "Cancellation policy", Body: lazy(() => import("./CancellationsSummary")), plain: true },
} as const satisfies Record<LegalPath, unknown>;

export default function LegalModal({ href: startHref, onClose }: { href: string; onClose: () => void }) {
  // Links between legal texts (Terms -> Cancellations, Privacy -> Cookies) swap
  // the popup's content instead of leaving the page.
  const [href, setHref] = useState(startHref);
  const [path, hash] = href.split("#") as [string, string | undefined];
  const doc = path in DOCS ? DOCS[path as LegalPath] : null;
  const scrollBox = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Lock the page behind, close on Esc, put focus on the close button.
  useEffect(() => {
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [onClose]);

  // Start each document at the top, or at its section (e.g. #direct) once loaded.
  useEffect(() => {
    if (scrollBox.current) scrollBox.current.scrollTop = 0;
    if (!hash) return;
    let tries = 0;
    const t = setInterval(() => {
      const el = scrollBox.current?.querySelector<HTMLElement>(`#${CSS.escape(hash)}`);
      if (el || ++tries > 20) {
        clearInterval(t);
        if (el && scrollBox.current) scrollBox.current.scrollTop = el.offsetTop - 16;
      }
    }, 50);
    return () => clearInterval(t);
  }, [href, hash]);

  if (!doc || typeof document === "undefined") return null;
  const { title, Body } = doc;
  // The cancellation card has its own styling, so it skips the prose rules.
  const prose = "plain" in doc ? "pt-2 text-ink-soft text-[15px] leading-[1.75]" : LEGAL_PROSE;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/50 backdrop-blur-[2px] md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="fade-in flex max-h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-t-[22px] bg-bone shadow-[0_30px_80px_-20px_rgba(31,37,33,0.5)] md:max-h-[85vh] md:max-w-[760px] md:rounded-[22px]"
      >
        {/* Title bar */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-6 py-4 max-md:px-5">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
              <span className="h-1.5 w-1.5 rotate-45 bg-clay" /> Legal
            </div>
            <h2 id="legal-modal-title" className="m-0 truncate font-display text-[24px] leading-tight text-moss">
              {title}
            </h2>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-transparent text-ink hover:bg-bone-soft"
          >
            <X size={18} />
          </button>
        </div>

        {/* Text */}
        <div
          ref={scrollBox}
          className="relative flex-1 overflow-y-auto overscroll-contain px-6 pb-6 max-md:px-5"
          onClickCapture={(e) => {
            const a = (e.target as HTMLElement).closest("a");
            const to = a?.getAttribute("href");
            if (!a || !to || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
            if (isLegalPath(to)) {
              e.preventDefault();
              e.stopPropagation();
              setHref(to);
            } else if (to.startsWith("/")) {
              onClose(); // going to another page on the site: close first
            }
          }}
        >
          <div className={prose}>
            <Suspense fallback={<p className="py-10 text-center text-ink-soft">Loading…</p>}>
              <Body />
            </Suspense>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-6 py-3.5 max-md:px-5"
          style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))" }}
        >
          <Link href={href} onClick={onClose} className="text-[13px] text-ink-soft no-underline hover:text-clay">
            Open full page
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border-none bg-moss px-6 py-3 text-[13px] font-medium text-bone"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
