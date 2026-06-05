// City data for the M&S Hosting site.
// Used by the homepage Cities grid and by /cities/[slug] pages.
// Intros are placeholders, Maddie and Sam should edit each one with their voice.

export type City = {
  // URL slug, matches what's in lib/properties.ts citySlug field
  slug: string;

  // Display name
  name: string;

  // One-paragraph intro shown on the city detail page.
  // Stub copy for now, please review with the clients.
  intro: string;

  // Hero image for the city card and the top of the city detail page
  img: string;
};

export const CITIES: City[] = [
  {
    slug: "toronto",
    name: "Toronto",
    intro:
      "Canada's biggest city and the one most of our guests have on their list. We host two homes inside the Greater Toronto Area's core, both within a short ride of downtown but kept far enough away to actually rest at night.",
    img: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1400&q=85",
  },
  {
    slug: "oshawa",
    name: "Oshawa",
    intro:
      "Forty-five minutes east of downtown Toronto, Oshawa is one of the fastest-growing cities in the GTA. Quieter streets, more space, and easy access to the 401 make our two Oshawa homes a favourite for longer stays and group weekends.",
    img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1400&q=85",
  },
  {
    slug: "ajax",
    name: "Ajax",
    intro:
      "Ajax sits right on Lake Ontario between Pickering and Whitby, with the GO Train running straight into downtown Toronto. Our two Ajax homes are family-sized, close to transit, and built for the kind of guest who wants the city when they want it and quiet when they don't.",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=85",
  },
  {
    slug: "whitby",
    name: "Whitby",
    intro:
      "Whitby is home to Thermea Spa Village, one of the GTA's quietest weekend escapes, and both of our Whitby homes are within walking distance of it. If the goal of the trip is to do nothing, this is the right city.",
    img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1400&q=85",
  },
  {
    slug: "pickering",
    name: "Pickering",
    intro:
      "Pickering is a lakeside city just east of Toronto, with the GO Train, the 401, and easy access to nearby beaches and trails. Our Pickering home is a self-contained private suite, popular with couples who want a quiet base for a weekend or longer.",
    img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1400&q=85",
  },
  {
    slug: "uxbridge",
    name: "Uxbridge",
    intro:
      "Uxbridge is the GTA's countryside, an hour from downtown Toronto and yet a different world. Rolling hills, quiet roads, and our largest home, built for groups who want the city left behind for a few days.",
    img: "https://images.unsplash.com/photo-1507371341162-763b5e419408?w=1400&q=85",
  },
  {
    slug: "mississauga",
    name: "Mississauga",
    intro:
      "Mississauga is the GTA's second-biggest city, anchored by the Square One mall, the Living Arts Centre, and a steady stream of conferences and concerts. Our Mississauga townhouse is five minutes from Square One with free parking, the easiest yes in our collection.",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85",
  },
];

// Look up a single city by its slug. Returns null if not found.
export function getCityBySlug(slug: string): City | null {
  return CITIES.find((c) => c.slug === slug) ?? null;
}