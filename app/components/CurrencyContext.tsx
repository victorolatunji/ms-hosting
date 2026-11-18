"use client";
// Site-wide display currency. Remembered on this device; rates load once per visit.
import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { CURRENCIES, FALLBACK_RATES, formatMoney, type Currency } from "@/lib/currency";

const KEY = "ms-currency";
const EVENT = "ms-currency-change";

function read(): Currency {
  try {
    const v = window.localStorage.getItem(KEY) as Currency | null;
    return v && (CURRENCIES as readonly string[]).includes(v) ? v : "CAD";
  } catch {
    return "CAD";
  }
}
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
};

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (cad: number) => string;   // CAD amount -> display string in chosen currency
  rateDate: string | null;
};
const CurrencyCtx = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency = useSyncExternalStore(subscribe, read, () => "CAD" as Currency);
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);
  const [rateDate, setRateDate] = useState<string | null>(null);

  useEffect(() => {
    if (currency === "CAD") return;
    let cancelled = false;
    fetch("/api/fx")
      .then((r) => r.json())
      .then((j: { rates: Record<Currency, number>; date: string | null }) => {
        if (cancelled) return;
        setRates(j.rates);
        setRateDate(j.date);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [currency]);

  const setCurrency = useCallback((c: Currency) => {
    try { window.localStorage.setItem(KEY, c); } catch { /* storage blocked */ }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  const format = useCallback((cad: number) => formatMoney(cad, currency, rates), [currency, rates]);

  return <CurrencyCtx.Provider value={{ currency, setCurrency, format, rateDate }}>{children}</CurrencyCtx.Provider>;
}

export function useCurrency(): Ctx {
  const c = useContext(CurrencyCtx);
  if (!c) throw new Error("useCurrency must be used inside CurrencyProvider");
  return c;
}
