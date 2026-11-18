// Pages that open in the legal popup. Plain module so server components can use it.
export const LEGAL_PATHS = ["/terms", "/privacy", "/cookies", "/cancellations"] as const;
export type LegalPath = (typeof LEGAL_PATHS)[number];
export const isLegalPath = (href: string): boolean =>
  (LEGAL_PATHS as readonly string[]).includes(href.split("#")[0]);
