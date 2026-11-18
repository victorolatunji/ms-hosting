"use client";
// Saved stays grid + "send my shortlist" form that pre-fills an enquiry.
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import InquiryForm from "./InquiryForm";
import SaveButton from "./SaveButton";
import { useSaved } from "./useSaved";
import { PROPERTIES } from "@/lib/properties";

export default function SavedList() {
  const { saved, clear } = useSaved();
  const stays = PROPERTIES.filter((p) => saved.includes(p.slug));

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Your shortlist</Eyebrow>
          <h1 className="m-0 font-display leading-[1.05] text-moss" style={{ fontSize: "clamp(36px, 6vw, 64px)" }}>
            Saved <span className="italic text-clay">stays.</span>
          </h1>
        </div>
        {stays.length > 0 && (
          <button onClick={clear} className="cursor-pointer border-none bg-transparent text-[13px] text-ink-soft underline">
            Clear all
          </button>
        )}
      </div>

      {stays.length === 0 ? (
        <div className="rounded-[18px] border border-line bg-bone p-10 text-center">
          <Heart size={28} className="mx-auto mb-4 text-clay" />
          <p className="m-0 mb-6 text-[15px] text-ink-soft">
            Tap the heart on any home to keep it here. Your list stays on this device.
          </p>
          <Link href="/#stays" className="inline-block rounded-full bg-clay px-6 py-3 text-[14px] font-medium text-bone no-underline">
            Browse stays
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {stays.map((p) => (
              <Link key={p.slug} href={`/stays/${p.slug}`} className="lift relative block overflow-hidden rounded-[18px] border border-line bg-bone text-ink no-underline">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} className="img-zoom h-full w-full object-cover" />
                  <SaveButton slug={p.slug} name={p.name} className="absolute right-3 top-3" />
                </div>
                <div className="p-5">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="font-display text-[21px] leading-[1.15] text-moss">{p.name}</div>
                    {p.rating !== null && (
                      <span className="flex shrink-0 items-center gap-1 text-[13px]">
                        <Star size={13} fill="var(--color-clay)" stroke="var(--color-clay)" /> {p.rating.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                    {p.city} / sleeps {p.guests}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[22px] border border-line bg-bone p-7 shadow-[0_18px_44px_-22px_rgba(31,37,33,0.18)]">
              <Eyebrow>Can&apos;t decide?</Eyebrow>
              <div className="mb-5 font-display text-[28px] leading-[1.1] text-moss">
                Send us your <span className="italic text-clay">shortlist.</span>
              </div>
              <p className="m-0 mb-5 text-[14px] leading-[1.6] text-ink-soft">
                Tell us your dates and Sam or Maddie will tell you which of these is free, and which they would pick for you.
              </p>
              <InquiryForm
                inquiryType="contact"
                subject={`Shortlist: ${stays.map((s) => s.name).join(", ")}`.slice(0, 200)}
                messagePlaceholder="Your dates, how many guests, and what the trip is for."
                submitLabel="Send my shortlist"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
