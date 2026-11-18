"use client";
// Heart button that saves a stay to the guest's shortlist.
import { Heart } from "lucide-react";
import { useSaved } from "./useSaved";

export default function SaveButton({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const { isSaved, toggle } = useSaved();
  const on = isSaved(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from saved stays` : `Save ${name}`}
      className={`flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-none bg-bone/95 backdrop-blur-sm transition-transform active:scale-90 ${className}`}
    >
      <Heart
        size={16}
        className={on ? "heart-pop" : ""}
        fill={on ? "var(--color-clay)" : "none"}
        color={on ? "var(--color-clay)" : "var(--color-moss)"}
      />
    </button>
  );
}
