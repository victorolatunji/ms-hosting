// Privacy policy. Structured for Canada (PIPEDA + CASL). The SCAFFOLD is real;
// the bracketed [...] bits and retention specifics MUST be confirmed by the
// clients before launch — they describe what M&S actually does with data.
//
// Place at: /app/privacy/page.tsx

import type { Metadata } from "next";
import LegalLayout from "@/app/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | M&S Hosting",
  description: "How M&S Hosting Solutions collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="[Month] 2026">
      <section>
        <p>
          M&amp;S Hosting Solutions (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy
          explains what personal information we collect, why we collect it, and the choices you
          have. We handle personal information in line with Canada&apos;s Personal Information
          Protection and Electronic Documents Act (PIPEDA).
        </p>
        <p>
          <strong>This is a draft for client review.</strong> Bracketed items must be confirmed by
          M&amp;S Hosting Solutions before this page goes live.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <p>When you contact us through a form on this site, we collect:</p>
        <ul>
          <li>Your name and email address</li>
          <li>The message and any details you choose to include (such as a property of interest or travel dates)</li>
          <li>Whether you opted in to receive marketing emails</li>
        </ul>
        <p>
          We do not take payments on this site, so we do not collect payment or financial
          information.
        </p>
      </section>

      <section>
        <h2>Why we collect it</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Respond to your enquiry and arrange a stay</li>
          <li>Send you marketing emails, only if you opted in (you can unsubscribe at any time)</li>
          <li>Keep records of our correspondence with you</li>
        </ul>
      </section>

      <section>
        <h2>How it is stored and who can see it</h2>
        <p>
          Your information is stored securely and is accessible only to Madeline and Samuel
          Jean-Louis. We use the following trusted service providers to operate this site:
        </p>
        <ul>
          <li><strong>Supabase</strong> — stores your enquiry (hosted in Canada)</li>
          <li><strong>Resend</strong> — sends our email replies and notifications</li>
          <li><strong>Tawk.to</strong> — powers the live chat widget, if you use it</li>
          <li><strong>Vercel</strong> — hosts this website</li>
        </ul>
        <p>
          We do not sell your personal information. We keep your information for [retention period
          to confirm] and then delete it.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>You can, at any time:</p>
        <ul>
          <li>Ask what information we hold about you</li>
          <li>Ask us to correct or delete it</li>
          <li>Unsubscribe from marketing emails using the link in any email, or by contacting us</li>
        </ul>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          For any privacy question or request, email{" "}
          <a href="mailto:info.mshostingsolutions@gmail.com">info.mshostingsolutions@gmail.com</a>{" "}
          or call (905) 922-6538.
        </p>
      </section>
    </LegalLayout>
  );
}