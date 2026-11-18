// Cookies and on-device storage. Keep honest: update when tools change.

import type { Metadata } from "next";
import LegalLayout from "@/app/components/LegalLayout";
import CookiesBody, { COOKIES_TITLE, COOKIES_UPDATED } from "@/app/components/legal/CookiesBody";

export const metadata: Metadata = {
  title: "Cookies | M&S Hosting",
  description: "How M&S Hosting Solutions uses cookies and similar technologies.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalLayout title={COOKIES_TITLE} updated={COOKIES_UPDATED}>
      <CookiesBody />
    </LegalLayout>
  );
}
