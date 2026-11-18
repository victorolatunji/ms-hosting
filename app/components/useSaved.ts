"use client";
// Saved stays ("hearts"), kept in this browser's localStorage so they survive
// reloads and app restarts. Every component using this hook stays in sync.
// Storage can be blocked (private mode, some in-app browsers), so every
// read/write is wrapped and simply falls back to in-memory.

import { useCallback, useSyncExternalStore } from "react";

const KEY = "ms-saved-stays";
const EVENT = "ms-saved-change";
let memory: string[] = [];
let cache: { raw: string | null; value: string[] } = { raw: null, value: [] };

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cache.raw) return cache.value; // stable reference for React
    const value = raw ? (JSON.parse(raw) as string[]).filter((s) => typeof s === "string") : [];
    cache = { raw, value };
    return value;
  } catch {
    return memory;
  }
}

function write(next: string[]) {
  memory = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: memory copy still works for this visit */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb); // other tabs
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const EMPTY: string[] = [];

export function useSaved() {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY);
  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);
  const toggle = useCallback((slug: string) => {
    const cur = read();
    write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  }, []);
  const clear = useCallback(() => write([]), []);
  return { saved, isSaved, toggle, clear, count: saved.length };
}
