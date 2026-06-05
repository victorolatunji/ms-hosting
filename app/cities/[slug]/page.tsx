// City detail page, rendered for each /cities/[slug] URL.
// Server component, generated at build time.
//
// Shows the city's intro and a grid of properties in that city.

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, Star } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ChatWidget from "@/app/components/ChatWidget";
import Eyebrow from "@/app/components/ui/Eyebrow";
import { CITIES, getCityBySlug } from "@/lib/cities";
import { getPropertiesByCity } from "@/lib/properties";

// Tell Next.js to pre-build a page for every known city slug at compile time.
export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

// Per-page metadata for SEO and browser tabs.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return { title: "Not found | M&S Hosting" };
  }

  return {
    title: `Stays in ${city.name} | M&S Hosting`,
    description: city.intro,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  // Fetch the properties in this city from the shared properties data
  const propertiesInCity = getPropertiesByCity(slug);

  return (
    <>
      <Header />

      <main>
        {/* HERO: city image with title overlay */}
        <section className="relative h-[420px] overflow-hidden max-md:h-[320px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={city.img}
            alt={city.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark moss gradient so the title text reads cleanly */}
          <div className="absolute inset-0 bg-gradient-to-b from-moss/30 via-moss/40 to-moss-dark/90" />

          {/* Title + back link, anchored to the bottom */}
          <div className="absolute inset-0 max-w-[1320px] mx-auto px-6 pb-12 flex flex-col justify-end max-md:px-5 max-md:pb-8">
            <Link
              href="/#cities"
              className="underline-link inline-flex items-center gap-1.5 text-bone/85 no-underline text-sm mb-3 self-start"
            >
              <ChevronLeft size={14} /> All cities
            </Link>
            <h1
              className="font-display text-bone m-0 leading-[0.95]"
              style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
            >
              {city.name}
            </h1>
          </div>
        </section>

        {/* CITY INTRO */}
        <section className="max-w-[1320px] mx-auto px-6 py-[80px] max-md:px-5 max-md:py-12">
          <div className="max-w-[720px]">
            <Eyebrow>The city</Eyebrow>
            <p className="text-[18px] leading-[1.75] text-ink-soft m-0">
              {city.intro}
            </p>
          </div>
        </section>

        {/* PROPERTIES IN THIS CITY */}
        <section className="max-w-[1320px] mx-auto px-6 pb-[110px] max-md:px-5 max-md:pb-[70px]">
          <div className="mb-10">
            <Eyebrow>The stays</Eyebrow>
            <h2
              className="font-display m-0 leading-[1.1] text-moss"
              style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}
            >
              {propertiesInCity.length === 1 ? "One home" : `${propertiesInCity.length} homes`}{" "}
              <span className="italic text-clay">in {city.name}.</span>
            </h2>
          </div>

          {/* Property grid. Reuses the same card design as the homepage,
              but inlined here to avoid mixing client/server rendering concerns
              and to skip the favorites feature on city pages. */}
          <div
            className="grid gap-7 max-sm:grid-cols-1"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
          >
            {propertiesInCity.map((p) => (
              <Link
                key={p.id}
                href={`/stays/${p.slug}`}
                className="lift bg-bone rounded-[18px] overflow-hidden border border-line relative no-underline text-ink cursor-pointer block"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className="img-zoom w-full h-full object-cover"
                  />
                  {p.tag && (
                    <div className="absolute top-3.5 left-3.5 bg-bone text-moss px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.02em] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-clay rotate-45" />
                      {p.tag}
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-[22px]">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="font-display text-[22px] font-medium leading-[1.15] text-moss flex-1">
                      {p.name}
                    </div>
                    {p.rating !== null ? (
                      <div className="flex items-center gap-1 text-[13px] text-ink shrink-0">
                        <Star size={13} fill="var(--color-clay)" stroke="var(--color-clay)" />
                        {p.rating.toFixed(2)}
                      </div>
                    ) : (
                      <span className="font-mono text-[10px] text-amber tracking-[0.15em] uppercase shrink-0">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-[13px] leading-[1.55] text-ink-soft m-0 mb-3.5">
                    {p.blurb}
                  </p>

                  <div className="font-mono text-[10px] text-ink-soft mb-4 tracking-[0.12em] uppercase">
                    {p.beds} / sleeps {p.guests}
                  </div>

                  <div className="flex justify-between items-center border-t border-line pt-3.5">
                    <div>
                      <span className="font-display text-[19px] font-medium italic text-clay">
                        Enquire
                      </span>
                      <span className="text-[12px] text-ink-soft ml-1.5">for rates</span>
                    </div>
                    <span className="text-[11px] text-ink-soft">
                      {p.reviews > 0 ? `${p.reviews} reviews` : "No reviews yet"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}