"use client";
// If anything in the admin fails, show a calm message instead of a blank crash page.
import Link from "next/link";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="rounded-[18px] border border-clay/30 bg-clay/10 p-6 text-[14px] leading-[1.6] text-ink">
      <div className="mb-2 font-display text-[24px] text-moss">Something didn&apos;t save.</div>
      <p className="m-0 mb-4">
        Nothing was lost. Try again, and if it keeps happening send Victor this code:{" "}
        <code>{error.digest ?? error.message}</code>
      </p>
      <div className="flex gap-2">
        <button onClick={reset} className="cursor-pointer rounded-full border-none bg-clay px-4 py-2 text-bone">Try again</button>
        <Link href="/admin" className="rounded-full border border-line px-4 py-2 text-ink no-underline">Back to overview</Link>
      </div>
    </div>
  );
}
