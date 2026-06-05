"use client";
// Floating chat widget, bottom-right of every page.
// Uses useState to toggle the panel open/closed, so it's a client component.
//
// This is UI only for now. In Phase 5 we'll either:
//   - Replace this entirely with a Tawk.to embed script, or
//   - Keep the visual shell and have it open Tawk.to underneath.
// Either way the design here matches what we'd want Tawk.to themed to look like.

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    // Fixed position, always visible. z-100 puts it above everything else.
    <div className="fixed bottom-5 right-5 z-[100]">

      {/* The open chat panel, only rendered when open=true.
          .chat-slide animates it up from below. */}
      {open && (
        <div
          className="
            chat-slide absolute bottom-[76px] right-0
            bg-bone rounded-[20px] overflow-hidden
            border border-line
            shadow-[0_30px_70px_-20px_rgba(31,37,33,0.45)]
          "
          style={{
            // min/max constraint, fits a phone screen without overflowing
            width: "min(340px, calc(100vw - 40px))",
          }}
        >
          {/* Header strip, moss background */}
          <div className="bg-moss text-bone px-[22px] py-5">
            <div className="flex items-center gap-2.5 mb-1">
              {/* Tiny pulsing green dot, "online" indicator */}
              <span className="w-2 h-2 rounded-full bg-[#7FA88A] pulse-dot" />
              <span className="font-display text-[18px] font-medium">
                Maddie &amp; Sam are here
              </span>
            </div>
            <div className="text-[12px] opacity-80">
              Typically reply within an hour
            </div>
          </div>

          {/* Body, message + input */}
          <div className="p-[22px]">
            {/* Sample first message, looks like it's from Maddie & Sam */}
            <div className="bg-clay/10 px-[15px] py-3.5 rounded-[14px] text-[13px] text-ink mb-3.5 leading-[1.5]">
              Hi there. Anything we can help you find today?
            </div>

            {/* Reply input. Disabled-feeling for now since it doesn't go anywhere. */}
            <input
              placeholder="Type your message"
              className="
                w-full px-3.5 py-3
                border border-line rounded-xl
                bg-transparent text-sm text-ink font-body
              "
            />
          </div>
        </div>
      )}

      {/* The floating action button. Clay circle, paper-plane icon. */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="
          w-[60px] h-[60px] rounded-full
          bg-clay text-bone border-none cursor-pointer
          flex items-center justify-center
          shadow-[0_16px_36px_-10px_rgba(196,99,74,0.6)]
          relative
        "
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}

        {/* Amber notification dot, top-right of the button.
            Only shown when chat is closed, to draw attention. */}
        {!open && (
          <span
            className="
              absolute top-1.5 right-1.5
              w-3 h-3 rounded-full bg-amber
            "
            style={{ border: "2px solid var(--color-clay)" }}
          />
        )}
      </button>
    </div>
  );
}