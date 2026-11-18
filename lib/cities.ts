// City data for the M&S Hosting site.
// Used by the homepage Cities grid, the map, and /cities/[slug] pages.
// Intros for new cities are DRAFTS: review with Sam and Maddie.
//
// Landmark photos are placeholders from Wikimedia Commons (free licence,
// credit required). scripts/download-photos.mjs saves them to
// public/cities/<slug>.jpg. Swap in M&S's own photos any time.

export type City = {
  slug: string;
  name: string;
  intro: string;
  img: string;               // hero image (the landmark placeholder)
  landmark: string;          // what the photo shows
  landmarkSource: string;    // remote original, used by the download script
  landmarkCredit: string;    // Wikimedia file page, linked under the photo
};

const wm = (path: string) => `https://upload.wikimedia.org/wikipedia/commons/${path}`;
const thumb = (path: string, file: string) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/1920px-${file}`;
const credit = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const CITIES: City[] = [
  {
    slug: "toronto",
    name: "Toronto",
    intro:
      "Canada's biggest city and the one most of our guests have on their list. Our Toronto homes are a short ride from downtown, but far enough away to actually rest at night.",
    img: "/cities/toronto-landmark.webp",
    landmark: "The CN Tower and Toronto skyline",
    landmarkSource: thumb("8/8b/Toronto_Skyline_from_Snake_Island%2C_September_11_2026_%2801%29.jpg", "Toronto_Skyline_from_Snake_Island%2C_September_11_2026_%2801%29.jpg"),
    landmarkCredit: credit("Toronto_Skyline_from_Snake_Island,_September_11_2026_(01).jpg"),
  },
  {
    slug: "pickering",
    name: "Pickering",
    intro:
      "Pickering is a lakeside city just east of Toronto, with the GO Train, the 401, and Frenchman's Bay on the waterfront. It is also home to Hot Tub Oasis, Sam's own suite and the one stay you can book direct with us.",
    img: "/cities/pickering-landmark.webp",
    landmark: "Frenchman's Bay",
    landmarkSource: wm("7/75/Markers_near_Frenchman%27s_Bay_in_Pickering.jpg"),
    landmarkCredit: credit("Markers_near_Frenchman's_Bay_in_Pickering.jpg"),
  },
  {
    slug: "ajax",
    name: "Ajax",
    intro:
      "Ajax sits right on Lake Ontario between Pickering and Whitby, with the GO Train running straight into downtown Toronto. A family-sized base for guests who want the city when they want it and quiet when they don't.",
    img: "/cities/ajax-landmark.webp",
    landmark: "The Ajax waterfront",
    landmarkSource: wm("b/bd/Aerial_Photograph_of_Ajax%2C_Ontario_-_Discover_The_Town_Of_Ajax_%2801m08s%29_%28edited%29.jpg"),
    landmarkCredit: credit("Aerial_Photograph_of_Ajax,_Ontario_-_Discover_The_Town_Of_Ajax_(01m08s)_(edited).jpg"),
  },
  {
    slug: "whitby",
    name: "Whitby",
    intro:
      "Whitby is home to Thermea Spa Village, one of the GTA's quietest weekend escapes, and every one of our Whitby homes is close to it. If the goal of the trip is to do nothing, this is the right town.",
    img: "/cities/whitby-landmark.webp",
    landmark: "Downtown Whitby",
    landmarkSource: thumb("2/2c/Downtown_Whitby%2C_Ontario%2C_March_9_2026_%2803%29.jpg", "Downtown_Whitby%2C_Ontario%2C_March_9_2026_%2803%29.jpg"),
    landmarkCredit: credit("Downtown_Whitby,_Ontario,_March_9_2026_(03).jpg"),
  },
  {
    slug: "oshawa",
    name: "Oshawa",
    intro:
      "Forty-five minutes east of downtown Toronto, Oshawa is one of the fastest-growing cities in the GTA. Quieter streets, more space, and easy access to the 401 make it a favourite for longer stays.",
    img: "/cities/oshawa-landmark.webp",
    landmark: "Parkwood Estate",
    landmarkSource: thumb("8/84/Parkwood_Estate_National_Historic_Site_of_Canada_2007.jpg", "Parkwood_Estate_National_Historic_Site_of_Canada_2007.jpg"),
    landmarkCredit: credit("Parkwood_Estate_National_Historic_Site_of_Canada_2007.jpg"),
  },
  {
    slug: "brampton",
    name: "Brampton",
    intro:
      "Brampton is one of Canada's biggest and most diverse cities, with the GO Train into Toronto and Sheridan College close by. Our Brampton homes are roomy, pet-friendly options for families and longer visits.",
    img: "/cities/brampton-landmark.webp",
    landmark: "Peel Art Gallery, Museum and Archives",
    landmarkSource: wm("c/c9/Peel_Art_Gallery%2C_Museum_and_Archives_Building_%28PAMA%29.jpg"),
    landmarkCredit: credit("Peel_Art_Gallery,_Museum_and_Archives_Building_(PAMA).jpg"),
  },
  {
    slug: "vaughan",
    name: "Vaughan",
    intro:
      "Vaughan is home to Canada's Wonderland and a subway line straight into downtown Toronto. Our Vaughan suite puts the rides seven minutes away and a hot tub at the end of the day.",
    img: "/cities/vaughan-landmark.webp",
    landmark: "Canada's Wonderland",
    landmarkSource: thumb("d/d5/A_very_Canadian_Canada%27s_Wonderland_%2841514872810%29.jpg", "A_very_Canadian_Canada%27s_Wonderland_%2841514872810%29.jpg"),
    landmarkCredit: credit("A_very_Canadian_Canada's_Wonderland_(41514872810).jpg"),
  },
  {
    slug: "bradford",
    name: "Bradford",
    intro:
      "Bradford West Gwillimbury sits beside the Holland Marsh, Ontario's soup and salad bowl, an hour north of Toronto with the GO Train five minutes from our homes. This is where our biggest group houses live.",
    img: "/cities/bradford-landmark.webp",
    landmark: "The Holland Marsh",
    landmarkSource: wm("4/48/Harvesting_carrots_on_the_Holland_Marsh.jpg"),
    landmarkCredit: credit("Harvesting_carrots_on_the_Holland_Marsh.jpg"),
  },
  {
    slug: "sudbury",
    name: "Sudbury",
    intro:
      "Greater Sudbury is our northern outpost, about four hours from Toronto, surrounded by lakes and rock. Home of the Big Nickel, Science North, and two of our homes, one built for big groups.",
    img: "/cities/sudbury-landmark.webp",
    landmark: "The Big Nickel",
    landmarkSource: thumb("e/e9/The_Big_Nickel_1988.jpg", "The_Big_Nickel_1988.jpg"),
    landmarkCredit: credit("The_Big_Nickel_1988.jpg"),
  },
];

export function getCityBySlug(slug: string): City | null {
  return CITIES.find((c) => c.slug === slug) ?? null;
}
