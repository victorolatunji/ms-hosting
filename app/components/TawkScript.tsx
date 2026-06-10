"use client";

import { useEffect } from "react";
import Script from "next/script";

const TAWK_PATTERN = /tawk\.to|Tawk_API/i;

function suppressTawkConsoleNoise() {
  const methods = ["log", "info", "debug", "warn", "error"] as const;
  const original = {} as Record<(typeof methods)[number], (...a: unknown[]) => void>;

  const isFromTawk = (args: unknown[]) => {
    // Caller's stack: if tawk's script invoked console.*, its frame is here.
    if (TAWK_PATTERN.test(new Error().stack ?? "")) return true;
    // Or an Error/string argument that points back at tawk.
    return args.some(
      (a) =>
        (a instanceof Error && TAWK_PATTERN.test(a.stack ?? a.message)) ||
        (typeof a === "string" && TAWK_PATTERN.test(a))
    );
  };

  for (const m of methods) {
    original[m] = console[m].bind(console);
    console[m] = (...args: unknown[]) => {
      if (!isFromTawk(args)) original[m](...args);
    };
  }

  // Restore on unmount so the patch doesn't leak across HMR/navigation.
  return () => {
    for (const m of methods) console[m] = original[m];
  };
}

export default function TawkScript() {
  const widgetId = process.env.NEXT_PUBLIC_TAWK_TO_ID;

  useEffect(() => {
    if (!widgetId) return;
    return suppressTawkConsoleNoise();
  }, [widgetId]);

  if (!widgetId) return null;

  return (
    <Script
      id="tawk-to-widget"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = Tawk_API || {};
          var Tawk_LoadStart = new Date();
          (function(){
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/${widgetId}';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  );
}