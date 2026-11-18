// Display currencies. Prices are set and CHARGED in CAD; other currencies are
// shown for guidance only, at a daily exchange rate.
export const CURRENCIES = ["CAD", "USD", "EUR", "GBP", "AUD"] as const;
export type Currency = (typeof CURRENCIES)[number];

// Units of each currency per 1 CAD. Used only if the live rate can't be fetched.
export const FALLBACK_RATES: Record<Currency, number> = { CAD: 1, USD: 0.71, EUR: 0.66, GBP: 0.56, AUD: 1.09 };

const LOCALE: Record<Currency, string> = { CAD: "en-CA", USD: "en-US", EUR: "en-IE", GBP: "en-GB", AUD: "en-AU" };

export function formatMoney(cad: number, currency: Currency, rates: Record<Currency, number>) {
  const amount = cad * (rates[currency] ?? 1);
  return amount.toLocaleString(LOCALE[currency], {
    style: "currency",
    currency,
    currencyDisplay: currency === "CAD" || currency === "AUD" ? "narrowSymbol" : "symbol",
    maximumFractionDigits: currency === "CAD" ? 2 : 0,
    minimumFractionDigits: currency === "CAD" ? 2 : 0,
  }) + (currency === "AUD" ? " AUD" : "");
}
