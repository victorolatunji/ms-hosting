// Stops the page scrolling behind a popup, menu or photo viewer.
// Counted, so two overlays open at once don't unlock each other early.
// Also tucks the Tawk chat bubble away so it can't sit on top of the overlay.

let locks = 0;

type TawkApi = { hideWidget?: () => void; showWidget?: () => void };
const tawk = () => (window as unknown as { Tawk_API?: TawkApi }).Tawk_API;

export function lockScroll(): () => void {
  if (typeof document === "undefined") return () => {};
  locks += 1;
  if (locks === 1) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    try { tawk()?.hideWidget?.(); } catch {}
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      if (!window.location.pathname.startsWith("/admin")) {
        try { tawk()?.showWidget?.(); } catch {}
      }
    }
  };
}
