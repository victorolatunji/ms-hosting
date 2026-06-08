"use client";
// Loads the Tawk.to live chat widget on every page.
// Uses Next.js's <Script> component with strategy="afterInteractive" so the
// widget loads after the page is interactive, not blocking initial render.
//
// The widget ID lives in a public env var (NEXT_PUBLIC_TAWK_TO_ID) so it
// can be rotated or swapped per environment without code changes.
// Falls back gracefully when the env var is missing (renders nothing),
// useful during local development if Tawk.to is disabled.

import Script from "next/script";

export default function TawkScript() {
  const widgetId = process.env.NEXT_PUBLIC_TAWK_TO_ID;

  // No widget configured? Render nothing.
  // Avoids ugly console errors and lets us deploy without Tawk.to wired up.
  if (!widgetId) {
    return null;
  }

  return (
    <Script
      id="tawk-to-widget"
      strategy="afterInteractive"
      // Inline script that injects the Tawk.to async loader.
      // Identical to the embed snippet from Tawk.to's dashboard, just
      // adapted to use the env var instead of a hardcoded ID.
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