// Pure date rules for the availability calendar. Dates are "YYYY-MM-DD".
// A blocked range {start, end} blocks the NIGHTS from start up to (not including) end,
// so someone can check out on the same day the next guest checks in.

export type Range = { start: string; end: string };

const pad = (n: number) => String(n).padStart(2, "0");
export const toDay = (s: string) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
export const fromParts = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`;
export const addDays = (s: string, n: number) => {
  const t = new Date(toDay(s) + n * 86_400_000);
  return fromParts(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
};

// Is the NIGHT that starts on `d` taken?
export const nightBlocked = (d: string, blocked: Range[]) =>
  blocked.some((r) => toDay(r.start) <= toDay(d) && toDay(d) < toDay(r.end));

// Are all nights from checkin up to (not including) checkout free?
export function rangeFree(checkin: string, checkout: string, blocked: Range[]) {
  for (let d = checkin; toDay(d) < toDay(checkout); d = addDays(d, 1)) {
    if (nightBlocked(d, blocked)) return false;
  }
  return true;
}

// Can `d` be chosen right now? (Depends on whether we're picking check-in or check-out.)
export function selectable(d: string, today: string, checkin: string, checkout: string, blocked: Range[]) {
  if (toDay(d) < toDay(today)) return false;
  const pickingCheckout = Boolean(checkin) && !checkout;
  if (pickingCheckout && toDay(d) > toDay(checkin)) return rangeFree(checkin, d, blocked);
  return !nightBlocked(d, blocked); // as a new check-in
}

// What happens when a guest taps `d`. Returns the new [checkin, checkout].
export function pick(d: string, today: string, checkin: string, checkout: string, blocked: Range[]): [string, string] {
  if (toDay(d) < toDay(today)) return [checkin, checkout];
  const pickingCheckout = Boolean(checkin) && !checkout;
  if (pickingCheckout && toDay(d) > toDay(checkin) && rangeFree(checkin, d, blocked)) return [checkin, d];
  if (!nightBlocked(d, blocked)) return [d, ""]; // start a fresh selection
  return [checkin, checkout]; // tapped a booked night: ignore
}
