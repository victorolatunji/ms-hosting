// Property detail page, rendered for each /stays/[slug] URL.
// Server component (no "use client"), generated at build time.
//
// In Phase 3 the data source moves from lib/properties.ts to Supabase,
// but the structure of this file stays the same.

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronLeft,
  Star,
  Users,
  Bed,
  MapPin,
  Wifi,
  Car,
  Wind,
  Coffee,
  Bath,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ChatWidget from "@/app/components/ChatWidget";
import Eyebrow from "@/app/components/ui/Eyebrow";
import Field from "@/app/components/ui/Field";
import { PROPERTIES, getPropertyBySlug } from "@/lib/properties";

// Standard amenities shown on every property page.
// In Phase 3 these become per-property data from Supabase. For now they're
// universal across all M&S homes, accurate per the brand promises.
const STANDARD_AMENITIES: [React.ComponentType<{ size?: number; className?: string }>, string][] = [
  [Wifi,   "Fast Wi-Fi"],
  [Car,    "Free parking"],
  [Wind,   "AC and heat"],
  [Coffee, "Espresso bar"],
  [Bath,   "Plush linens"],
];

// generateStaticParams tells Next.js which slugs to pre-build at compile time.
// Without this, dynamic routes are rendered on-demand. With it, all 11 pages
// are pre-rendered as static HTML, near-instant page loads.
export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

// generateMetadata produces the <title> and <meta description> for each page.
// Better SEO, better social sharing, better browser tabs.
//
// The "params" prop in App Router is a Promise as of Next 15+, so we await it.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return { title: "Not found | M&S Hosting" };
  }

  return {
    title: `${property.name} in ${property.city} | M&S Hosting`,
    description: property.blurb,
  };
}

// The page component. Receives the slug from the URL via the params prop.
export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  // If the slug doesn't match any property, render Next.js's 404 page.
  if (!property) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="max-w-[1320px] mx-auto px-6 pt-8 pb-[110px] max-md:px-5 max-md:pt-6 max-md:pb-[70px]">

        {/* Back link to the homepage stays section */}
        <Link
          href="/#stays"
          className="underline-link inline-flex items-center gap-1.5 text-ink-soft text-sm no-underline mb-6"
        >
          <ChevronLeft size={14} /> Back to all stays
        </Link>

        {/* Two-column layout on desktop, stacked on mobile.
            Left: photo + description. Right: details and CTA. */}
        <div
          className="grid gap-10 max-lg:grid-cols-1"
          style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 1fr)" }}
        >

          {/* LEFT COLUMN: hero photo + story */}
          <div>
            {/* Hero photo, fills the column width */}
            <div className="rounded-[22px] overflow-hidden border border-line aspect-[4/3] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={property.img}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              {/* Tag, if any */}
              {property.tag && (
                <div className="absolute top-4 left-4 bg-bone text-moss px-3.5 py-2 rounded-full text-[12px] font-medium tracking-[0.02em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-clay rotate-45" />
                  {property.tag}
                </div>
              )}
            </div>

            {/* Headline + city/rating row sits under the photo on mobile,
                but on desktop the rating sits in the right column. We render
                both copies and hide one with responsive classes. */}
            <div className="mt-9">
              <Eyebrow>The home</Eyebrow>
              <h1
                className="font-display m-0 leading-[1.05] text-moss"
                style={{ fontSize: "clamp(34px, 4.5vw, 54px)" }}
              >
                {property.name}
              </h1>

              {/* City + rating + reviews summary line */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-ink-soft">
                <Link
                  href={`/cities/${property.citySlug}`}
                  className="underline-link inline-flex items-center gap-1.5 text-ink no-underline"
                >
                  <MapPin size={14} className="text-clay" /> {property.city}
                </Link>
                {property.rating !== null ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={14} fill="var(--color-clay)" stroke="var(--color-clay)" />
                    {property.rating.toFixed(2)}
                    <span className="text-ink-soft">
                      &middot; {property.reviews} review{property.reviews === 1 ? "" : "s"}
                    </span>
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-amber tracking-[0.15em] uppercase">
                    New listing
                  </span>
                )}
              </div>

              {/* Full description */}
              <p className="mt-7 text-[17px] leading-[1.75] text-ink-soft m-0">
                {property.description}
              </p>
            </div>

            {/* Amenities, a small grid of icon + label tiles */}
            <div className="mt-10">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-clay mb-4 flex items-center gap-3">
                <span className="w-[7px] h-[7px] bg-clay rotate-45 inline-block" />
                What every M&amp;S home includes
              </div>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                {STANDARD_AMENITIES.map(([Icon, label]) => (
                  <div
                    key={label}
                    className="border border-line rounded-[14px] px-4 py-5"
                  >
                    <Icon size={20} className="text-clay mb-2.5" />
                    <div className="text-[13px] text-ink">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: sticky details card + enquiry form */}
          <div className="lg:sticky lg:top-24 lg:self-start">

            {/* The details card */}
            <div className="bg-bone border border-line rounded-[22px] p-7 shadow-[0_18px_44px_-22px_rgba(31,37,33,0.18)]">
              <Eyebrow>Enquire</Eyebrow>
              <div
                className="font-display text-moss leading-[1.1] mb-6"
                style={{ fontSize: "clamp(26px, 3vw, 32px)" }}
              >
                Rates on{" "}
                <span className="italic text-clay">request.</span>
              </div>

              {/* Quick-facts list */}
              <ul className="list-none p-0 m-0 mb-6 flex flex-col gap-3 text-[14px]">
                <li className="flex items-center gap-2.5 text-ink">
                  <Bed size={15} className="text-clay" /> {property.beds}
                </li>
                <li className="flex items-center gap-2.5 text-ink">
                  <Users size={15} className="text-clay" /> Sleeps {property.guests}
                </li>
                <li className="flex items-center gap-2.5 text-ink">
                  <MapPin size={15} className="text-clay" /> {property.city}, ON
                </li>
              </ul>

              {/* Enquiry form. Pre-fills the subject with the property name
                  so submissions in Phase 3 are easy to triage. */}
              <form
                className="flex flex-col gap-3.5"
                action="/#contact"
                method="get"
              >
                <Field label="Your name"  placeholder="Jane Doe"          name="name"  />
                <Field label="Email"      placeholder="jane@example.com"  name="email" type="email" />

                {/* Hidden subject field that travels with the form. We'll wire
                    submissions in Phase 3 and the subject will arrive with the message. */}
                <input
                  type="hidden"
                  name="subject"
                  value={`Enquiry about ${property.name}`}
                />

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-ink-soft">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder={`Tell us about your stay at ${property.name}`}
                    className="
                      w-full px-[15px] py-[13px]
                      border border-line rounded-xl
                      bg-transparent text-sm text-ink font-body
                      resize-y transition-colors
                    "
                  />
                </div>

                <button
                  type="submit"
                  className="
                    bg-clay text-bone border-none p-[15px] rounded-xl
                    text-sm font-medium cursor-pointer mt-1
                    tracking-[0.02em]
                  "
                >
                  Send enquiry
                </button>
              </form>

              <p className="text-[12px] text-ink-soft mt-4 leading-[1.5]">
                Maddie or Sam will reply within the hour during the day, or
                first thing the next morning.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}