// Terms of use and booking. Covers both models: request to book (most homes)
// and direct booking with payment (Hot Tub Oasis). Policy text comes from
// lib/policies.ts so it always matches the booking panel.

import type { Metadata } from "next";
import LegalLayout from "@/app/components/LegalLayout";
import TermsBody, { TERMS_TITLE, TERMS_UPDATED } from "@/app/components/legal/TermsBody";

export const metadata: Metadata = {
  title: "Terms | M&S Hosting",
  description: "The terms for using the M&S Hosting Solutions website and booking a stay.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout title={TERMS_TITLE} updated={TERMS_UPDATED}>
      <TermsBody />
    </LegalLayout>
  );
}
