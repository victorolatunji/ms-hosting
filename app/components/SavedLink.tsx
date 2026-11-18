"use client";
// Desktop header link to the saved shortlist, with a live count.
import Link from "next/link";
import { Heart } from "lucide-react";
import { useSaved } from "./useSaved";

export default function SavedLink() {
  const { count } = useSaved();
  return (
    <Link href="/saved" aria-label={`Saved stays (${count})`} className="relative flex items-center gap-1.5 text-sm text-ink no-underline underline-link">
      <Heart size={15} fill={count ? "var(--color-clay)" : "none"} color={count ? "var(--color-clay)" : "currentColor"} />
      Saved
      {count > 0 && <span className="font-mono text-[11px] text-clay">{count}</span>}
    </Link>
  );
}
