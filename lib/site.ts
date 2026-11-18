// Site-wide constants used for SEO, sharing previews and structured data.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mshostingsolutions.ca").replace(/\/$/, "");
export const SITE_NAME = "M&S Hosting Solutions";
export const PHONE = "+1-905-922-6538";
export const EMAIL = "info.mshostingsolutions@gmail.com";
export const INSTAGRAM = "https://www.instagram.com/mshostingsolutions";
export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
