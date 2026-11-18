// Privacy policy (Canada: PIPEDA and CASL). Keep this matching what the site
// actually does. If a service is added or removed, update the list below.

import type { Metadata } from "next";
import LegalLayout from "@/app/components/LegalLayout";
import PrivacyBody, { PRIVACY_TITLE, PRIVACY_UPDATED } from "@/app/components/legal/PrivacyBody";

export const metadata: Metadata = {
  title: "Privacy Policy | M&S Hosting",
  description: "How M&S Hosting Solutions collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title={PRIVACY_TITLE} updated={PRIVACY_UPDATED}>
      <PrivacyBody />
    </LegalLayout>
  );
}
