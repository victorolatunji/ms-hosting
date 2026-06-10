// Terms of use. Reflects the contact-to-book model (no direct booking, no
// payment on site). Business terms — liability, cancellations, rates — MUST be
// confirmed by the clients before launch.
//
// Place at: /app/terms/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/app/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Use | M&S Hosting",
  description: "The terms that apply to using the M&S Hosting Solutions website.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" updated="[Month] 2026">
      <section>
        <p>
          These terms apply to your use of the M&amp;S Hosting Solutions website. By using the site,
          you agree to them.
        </p>
        <p>
          <strong>This is a draft for client review.</strong> The business terms below must be
          confirmed by M&amp;S Hosting Solutions, ideally with legal advice, before this page goes
          live.
        </p>
      </section>

      <section>
        <h2>Enquiries, not bookings</h2>
        <p>
          This website is for enquiries only. You cannot book or pay for a stay directly here.
          Submitting a form starts a conversation with us; it does not create a confirmed
          reservation. A stay is only confirmed once we agree the details with you directly.
        </p>
      </section>

      <section>
        <h2>Rates</h2>
        <p>
          Rates are not published on this site. We provide pricing in response to your enquiry,
          based on the home, dates, and length of stay.
        </p>
      </section>

      <section>
        <h2>Cancellations</h2>
        <p>
          Our cancellation terms are described on our{" "}
          <Link href="/cancellations">cancellations page</Link> and are agreed with you at the time
          of booking. [Confirm cancellation terms.]
        </p>
      </section>

      <section>
        <h2>Accuracy of information</h2>
        <p>
          We try to keep property descriptions, photos, and availability accurate, but details can
          change. Nothing on this site is a guarantee or a contract on its own.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          When you send us a message, you confirm the information you provide is your own and
          accurate. Please do not submit anything unlawful or that infringes someone else&apos;s
          rights.
        </p>
      </section>

      <section>
        <h2>Liability</h2>
        <p>
          [Liability terms to be confirmed with legal advice.] To the extent permitted by law, we
          are not responsible for losses arising from use of this website.
        </p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:info.mshostingsolutions@gmail.com">info.mshostingsolutions@gmail.com</a>{" "}
          or call (905) 922-6538.
        </p>
      </section>
    </LegalLayout>
  );
}