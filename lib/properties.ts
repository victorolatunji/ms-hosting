// Canonical property data for the M&S Hosting site.
// Both the homepage Properties grid and individual /stays/[slug] pages
// read from this single source of truth.
//
// In Phase 3 this gets replaced with Supabase queries. When that happens,
// only the data source changes, the consuming components stay the same.

export type Property = {
  // Unique numeric ID. Useful for React keys and matches what a database
  // primary key will look like later.
  id: number;

  // URL-safe slug, used to build the property page URL: /stays/[slug]
  // Lowercase, hyphenated, no special characters.
  slug: string;

  // Display name of the property
  name: string;

  // City this property is in (display name)
  city: string;

  // City slug, used to link to the city page: /cities/[citySlug]
  citySlug: string;

  // Short one-or-two-sentence blurb shown on cards
  blurb: string;

  // Longer description shown on the individual property page.
  // For now this is a placeholder, edit per property once the real copy is ready.
  description: string;

  // Bed configuration, free-form string e.g. "2 queen beds"
  beds: string;

  // Number of guests the property sleeps
  guests: number;

  // Star rating out of 5, or null if no reviews yet
  rating: number | null;

  // Number of guest reviews
  reviews: number;

  // Public path to the property's hero photo
  img: string;

  // Small badge shown over the photo, e.g. "Superhost", or null for none
  tag: string | null;

  // Set to true to grey out the listing and show the "Not available" stamp.
  // Useful for properties undergoing renovation or temporarily offline.
  unavailable?: boolean;
};

export const PROPERTIES: Property[] = [
  {
    id: 1,
    slug: "black-gold-hot-tub-retreat",
    name: "Black & Gold Hot Tub Retreat",
    city: "Toronto",
    citySlug: "toronto",
    blurb: "A moody, golden-lit escape twenty minutes from downtown, with a private hot tub for slow evenings.",
    description: "Twenty minutes from the heart of downtown Toronto sits a home that trades the usual rental palette for something darker and warmer. Deep blacks, brushed gold, and lamplight in every corner. The private hot tub sits just off the back, perfect for ending a long day. Two queen beds, full kitchen, and the kind of quiet you do not get in a hotel.",
    beds: "2 queen beds",
    guests: 4,
    rating: null,
    reviews: 0,
    img: "/images/properties/01-black-gold-toronto.jpg",
    tag: "Superhost",
  },
  {
    id: 2,
    slug: "cozy-toes-city-glows",
    name: "Cozy Toes and City Glows",
    city: "Toronto",
    citySlug: "toronto",
    blurb: "A warm guest suite with the city skyline at the door. Perfect for two couples or a small family.",
    description: "A bright, welcoming guest suite where the Toronto skyline is your view at sunrise and your nightlight after dark. Two beds, a small kitchen, and walking distance to transit. Well rated by repeat guests, several of whom book it again for return visits.",
    beds: "2 beds",
    guests: 4,
    rating: 4.95,
    reviews: 84,
    img: "/images/properties/02-cozy-toes-toronto.jpg",
    tag: "Top guest favourite",
  },
  {
    id: 3,
    slug: "modern-2br-upper-duplex",
    name: "Modern 2BR Upper Duplex",
    city: "Oshawa",
    citySlug: "oshawa",
    blurb: "Bright, fully private upper duplex with thoughtful finishes. A clean, quiet base for longer stays.",
    description: "An upper duplex in a quiet Oshawa neighbourhood, finished with care. Two beds, full kitchen, in-suite laundry, and an entrance that is genuinely your own. Built for visitors staying a week or longer, with workspace and reliable Wi-Fi throughout.",
    beds: "2 beds",
    guests: 4,
    rating: null,
    reviews: 0,
    img: "/images/properties/03-modern-duplex-oshawa.jpg",
    tag: "New place to stay",
  },
  {
    id: 4,
    slug: "4br-retreat-hot-tub",
    name: "4BR Retreat with Hot Tub",
    city: "Oshawa",
    citySlug: "oshawa",
    blurb: "Hot tub, BBQ, pool table, and room for everyone. Built for friends and family weekends.",
    description: "When the group is too big for any one bedroom to make sense, this is the place. Five beds, hot tub in the back, BBQ on the patio, pool table inside. The kind of house that makes a weekend feel like a real holiday. Sleeps ten comfortably.",
    beds: "5 beds",
    guests: 10,
    rating: 4.80,
    reviews: 47,
    img: "/images/properties/04-4br-retreat-oshawa.jpg",
    tag: "Superhost",
  },
  {
    id: 5,
    slug: "karibu-home-retreat",
    name: "Karibu Home Retreat",
    city: "Ajax",
    citySlug: "ajax",
    blurb: "A welcoming family home minutes from the 401, hosted with the warmth the name promises.",
    description: "Karibu means welcome in Swahili, and the home was named for the feeling it leaves with guests. Three queen beds, full kitchen, family-sized common rooms, and the kind of host touches that make a longer stay feel easy. Minutes from the 401 and the GO Station.",
    beds: "3 queen beds",
    guests: 6,
    rating: 4.64,
    reviews: 62,
    img: "/images/properties/05-karibu-ajax.jpg",
    tag: "Superhost",
  },
  {
    id: 6,
    slug: "spacious-home-movie-lounge",
    name: "Spacious Home with Movie Lounge",
    city: "Ajax",
    citySlug: "ajax",
    blurb: "Sprawling layout with a private movie lounge and easy GO Train access to downtown Toronto.",
    description: "A bigger Ajax home with one of our most-asked-about features: a private movie lounge with proper seating and a real screen. Three beds, family kitchen, and a quick walk to the GO Train if downtown Toronto is on the itinerary. Popular with multi-generational family stays.",
    beds: "3 beds",
    guests: 6,
    rating: 4.77,
    reviews: 78,
    img: "/images/properties/06-movie-lounge-ajax.jpg",
    tag: "Top guest favourite",
  },
  {
    id: 7,
    slug: "fully-private-hot-tub-suite",
    name: "Fully Private Hot Tub Suite",
    city: "Pickering",
    citySlug: "pickering",
    blurb: "A self-contained main floor suite with private hot tub access. Quiet, romantic, walkable to transit.",
    description: "A self-contained main floor suite, perfect for couples who want privacy without giving up modern comforts. Private entrance, full bath, and access to your own hot tub. Quiet street, walkable to Pickering transit, and the kind of place that often gets booked for anniversary weekends.",
    beds: "1 queen bed",
    guests: 2,
    rating: 4.89,
    reviews: 91,
    img: "/images/properties/07-hot-tub-suite-pickering.jpg",
    tag: "Top guest favourite",
  },
  {
    id: 8,
    slug: "serene-urban-retreat",
    name: "Serene Urban Retreat",
    city: "Whitby",
    citySlug: "whitby",
    blurb: "A perfect 5.0 rated home, fifteen minutes on foot from Thermea Spa Village. Built for unwinding.",
    description: "Every review for this home has come back five stars. Three beds, full kitchen, deeply quiet, with Thermea Spa Village a fifteen-minute walk away. Built for people who want to unplug, get a massage, and not think about much else for a few days.",
    beds: "3 beds",
    guests: 6,
    rating: 5.00,
    reviews: 38,
    img: "/images/properties/08-serene-retreat-whitby.jpg",
    tag: null,
  },
  {
    id: 9,
    slug: "luxury-recreation-retreat",
    name: "Luxury Recreation Retreat",
    city: "Uxbridge",
    citySlug: "uxbridge",
    blurb: "Five king beds, full recreation amenities, the GTA countryside at your back door. Group escapes done right.",
    description: "Five king beds, full recreation amenities, and the kind of countryside view you do not expect to find an hour outside Toronto. Built for group escapes: birthdays, bachelor or bachelorette weekends, family reunions. Sleeps twelve, with common rooms big enough to actually all sit together.",
    beds: "5 king beds",
    guests: 12,
    rating: 5.00,
    reviews: 24,
    img: "/images/properties/09-luxury-uxbridge.jpg",
    tag: null,
  },
  {
    id: 10,
    slug: "urban-zen-retreat",
    name: "Urban Zen Retreat",
    city: "Whitby",
    citySlug: "whitby",
    blurb: "A calm, considered home a short walk from Thermea. Booked up fast, especially on weekends.",
    description: "A calmer, more considered home in central Whitby. Four beds, full kitchen, a short walk from Thermea Spa Village. Weekends book up first, so if a Friday-to-Sunday is on the table, ask early. Repeat guests rebook this one more than any other in our collection.",
    beds: "4 beds",
    guests: 8,
    rating: 4.84,
    reviews: 56,
    img: "/images/properties/10-urban-zen-whitby.jpg",
    tag: "Guest favourite",
  },
  {
    id: 11,
    slug: "modern-townhouse-square-one",
    name: "Modern Townhouse, Square One",
    city: "Mississauga",
    citySlug: "mississauga",
    blurb: "Five minutes from Square One with free parking. Polished, central, easy to recommend.",
    description: "Five minutes from Square One, Mississauga's biggest mall and event hub, with free parking on-site. Three beds, polished modern interior, and a Netflix-ready living room for the kind of evenings where you do not want to leave the couch. A reliable pick for shoppers, conference attendees, and anyone with a Mississauga errand list.",
    beds: "3 beds",
    guests: 6,
    rating: 4.60,
    reviews: 32,
    img: "/images/properties/11-square-one-mississauga.jpg",
    tag: null,
  },
];

// Helper functions used by pages and components.

// Look up a single property by its URL slug. Returns null if not found.
// Used by /stays/[slug]/page.tsx to render the right property.
export function getPropertyBySlug(slug: string): Property | null {
  return PROPERTIES.find((p) => p.slug === slug) ?? null;
}

// Return every property in a given city, identified by city slug.
// Used by /cities/[slug]/page.tsx to render the property grid for that city.
export function getPropertiesByCity(citySlug: string): Property[] {
  return PROPERTIES.filter((p) => p.citySlug === citySlug);
}