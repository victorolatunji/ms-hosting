// Property detail page, rendered for each /stays/[slug] URL.

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronLeft,
  Star,
  Users,
  Bed,
  MapPin,
  Bath,
  ShowerHead,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
// import ChatWidget from "@/app/components/ChatWidget";
import Eyebrow from "@/app/components/ui/Eyebrow";
import InquiryForm from "@/app/components/InquiryForm";
import Gallery from "@/app/components/Gallery";
import BookingWidget from "@/app/components/BookingWidget";
import SaveButton from "@/app/components/SaveButton";
import { badgeFor, perksFor, PERKS } from "@/lib/perks";
import { PROPERTIES, getPropertyBySlug } from "@/lib/properties";
import { getPublicProperty } from "@/lib/listing-status";
import JsonLd from "@/app/components/JsonLd";
import { SITE_NAME, abs } from "@/lib/site";


export const revalidate = 60;

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

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
    alternates: { canonical: `/stays/${property.slug}` },
    openGraph: {
      title: `${property.name}, ${property.city}`,
      description: property.blurb,
      url: `/stays/${property.slug}`,
      images: [{ url: property.img, alt: property.name }],
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPublicProperty(slug);

  if (!property) {
    notFound();
  }

  const isDirect = property.bookingMode === "direct";

  const structured = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: property.name,
    description: property.description,
    url: abs(`/stays/${property.slug}`),
    image: property.gallery.slice(0, 8).map(abs),
    occupancy: { "@type": "QuantitativeValue", maxValue: property.guests },
    ...(property.bedrooms ? { numberOfBedrooms: property.bedrooms } : {}),
    ...(property.baths ? { numberOfBathroomsTotal: property.baths } : {}),
    address: { "@type": "PostalAddress", addressLocality: property.city, addressRegion: "ON", addressCountry: "CA" },
    containedInPlace: { "@type": "LodgingBusiness", name: SITE_NAME, url: abs("/") },
  };

  return (
    <>
      <JsonLd data={structured} />
      <Header />

      <main className="max-w-[1320px] mx-auto px-6 pt-8 pb-[110px] max-md:px-5 max-md:pt-6 max-md:pb-[70px]">

        <Link
          href="/#stays"
          className="underline-link inline-flex items-center gap-1.5 text-ink-soft text-sm no-underline mb-6"
        >
          <ChevronLeft size={14} /> Back to all stays
        </Link>

        {/* Mobile-first: single column.
            Desktop (lg breakpoint, 1024px+): two columns, photo+story wider than form. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] gap-10">

          {/* LEFT COLUMN: hero photo + story */}
          <div>
            <Gallery photos={property.gallery} name={property.name} tag={badgeFor(property)} />

            <div className="mt-9">
              <Eyebrow>The home</Eyebrow>
              <div className="flex items-start justify-between gap-4">
              <h1
                  className="font-display m-0 leading-[1.05] text-moss"
                  style={{ fontSize: "clamp(32px, 4.5vw, 54px)" }}
                >
                  {property.name}
                </h1>
                <SaveButton slug={property.slug} name={property.name} className="mt-2 shrink-0 border border-line" />
              </div>
              {perksFor(property).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {perksFor(property).map((id) => (
                    <span key={id} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                      {PERKS[id].label}
                    </span>
                  ))}
                </div>
              )}

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
                    New to M&amp;S
                  </span>
                )}
              </div>

              <p className="mt-7 text-[17px] leading-[1.75] text-ink-soft m-0">
                {property.description}
              </p>
            </div>

            {property.goodToKnow.length > 0 && (
              <div className="mt-10">
                <Eyebrow>Good to know</Eyebrow>
                <ul className="m-0 mt-1 flex list-none flex-col gap-3 p-0">
                  {property.goodToKnow.map((note) => (
                    <li key={note} className="flex items-start gap-3 text-[15px] leading-[1.6] text-ink-soft">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-clay" />
                      {note}
                    </li>
                  ))}
                </ul>
                {property.registration && (
                  <p className="m-0 mt-4 font-mono text-[11px] tracking-[0.08em] text-ink-soft">
                    Short-term rental registration: {property.registration}
                  </p>
                )}
              </div>
            )}

            <div className="mt-10">
              <Eyebrow>At a glance</Eyebrow>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [Users, `Sleeps ${property.guests}`],
                  [Bed, property.beds],
                  ...(property.baths !== null ? [[Bath, `${property.baths} bath${property.baths === 1 ? "" : "s"}`] as const] : []),
                  [MapPin, `${property.city}, ON`],
                ].map(([Icon, label]) => (
                  <div key={String(label)} className="rounded-[14px] border border-line px-4 py-5">
                    <Icon size={20} className="mb-2.5 text-clay" />
                    <div className="text-[13px] text-ink">{label as string}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: details card + enquiry form. Sticky only on desktop. */}
          <div className="lg:sticky lg:top-24 lg:self-start">

            <div className="bg-bone border border-line rounded-[22px] p-7 shadow-[0_18px_44px_-22px_rgba(31,37,33,0.18)]">
              <Eyebrow>{isDirect ? "Book direct" : "Request to book"}</Eyebrow>
              <div
                className="font-display text-moss leading-[1.1] mb-6"
                style={{ fontSize: "clamp(26px, 3vw, 32px)" }}
              >
                {isDirect ? (
                  <>Book your <span className="italic text-clay">stay.</span></>
                ) : (
                  <>Rates on <span className="italic text-clay">request.</span></>
                )}
              </div>

              <ul className="list-none p-0 m-0 mb-6 flex flex-col gap-3 text-[14px]">
                <li className="flex items-center gap-2.5 text-ink">
                  <Bed size={15} className="text-clay" /> {property.beds}
                </li>
                {property.baths !== null && (
                  <li className="flex items-center gap-2.5 text-ink">
                    <ShowerHead size={15} className="text-clay" /> {property.baths} bath{property.baths === 1 ? "" : "s"}
                  </li>
                )}
                <li className="flex items-center gap-2.5 text-ink">
                  <Users size={15} className="text-clay" /> Sleeps {property.guests}
                </li>
                <li className="flex items-center gap-2.5 text-ink">
                  <MapPin size={15} className="text-clay" /> {property.city}, ON
                </li>
              </ul>

              {property.unavailable ? (
                <div className="rounded-xl border border-line bg-bone-soft px-5 py-5 text-[14px] leading-[1.6] text-ink">
                  This home isn&apos;t taking bookings right now.{" "}
                  <Link href={`/cities/${property.citySlug}`} className="text-clay">See other stays in {property.city}</Link>{" "}
                  or <Link href="/#contact" className="text-clay">ask us</Link> when it&apos;s back.
                </div>
              ) : isDirect ? (
                <BookingWidget slug={property.slug} name={property.name} />
              ) : (
                <InquiryForm
                  inquiryType="property"
                  subject={`Booking request: ${property.name}`}
                  messagePlaceholder={`What brings you to ${property.city}? Anything we should know about your stay?`}
                  submitLabel="Request to book"
                  footnote="Sam or Maddie will confirm availability and rates, usually within the hour during the day."
                  propertySlug={property.slug}
                  askDates={{ maxGuests: property.guests }}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {/* <ChatWidget /> */}
    </>
  );
}