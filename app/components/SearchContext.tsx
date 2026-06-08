"use client";
// Context holding the homepage search filter state.
// Both Hero (which sets filters) and Properties (which reads them) consume
// this context. Lives on the homepage only; sub-pages don't see it.
//
// React Context is the right tool here because Hero and Properties are
// separated by other components (Marquee, Cities) in the page tree.
// Passing filter state via props would require threading it through every
// intermediate component, ugly.

import { createContext, useContext, useRef, useState } from "react";

export type SearchFilters = {
  city: string;
  checkin: string;
  checkout: string;
  guests: number;
};

const EMPTY_FILTERS: SearchFilters = {
  city: "",
  checkin: "",
  checkout: "",
  guests: 0,
};

// What the context exposes to consumers
type SearchContextValue = {
  filters: SearchFilters;
  setFilters: (next: SearchFilters) => void;
  clearFilters: () => void;
  // Ref the Properties section attaches to so Hero can scroll to it
  propertiesRef: React.MutableRefObject<HTMLDivElement | null>;
  // Hero calls this on submit: it sets filters and scrolls to properties
  submitSearch: (next: SearchFilters) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

// Hook to consume the context. Throws if used outside the provider, helpful
// developer-time error so we never silently render with no filters.
export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return ctx;
}

type SearchProviderProps = {
  children: React.ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const propertiesRef = useRef<HTMLDivElement | null>(null);

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  // Called from Hero on submit. Updates filters and smooth-scrolls.
  const submitSearch = (next: SearchFilters) => {
    setFilters(next);
    // Delay scroll a frame so the filter banner renders first
    requestAnimationFrame(() => {
      propertiesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <SearchContext.Provider
      value={{ filters, setFilters, clearFilters, propertiesRef, submitSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}