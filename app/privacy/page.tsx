// Privacy policy (Canada: PIPEDA and CASL). Keep this matching what the site
// actually does. If a service is added or removed, update the list below.

import type { Metadata } from "next";
import LegalLayout from "@/app/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | M&S Hosting",
  description: "How M&S Hosting Solutions collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="November 2026">
      <section>
        <p>
          M&amp;S Hosting Solutions (&quot;we&quot;, &quot;us&quot;) is a family-run hosting business
          run by Sam and Maddie Jean-Louis in Ontario, Canada. This policy explains what personal
          information we collect through this website, why, who helps us handle it, and your
          choices. We follow Canada&apos;s Personal Information Protection and Electronic Documents
          Act (PIPEDA) and Canada&apos;s Anti-Spam Legislation (CASL).
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <p><strong>When you send an enquiry or booking request</strong> (contact, request to book, become a host, or cancellation forms):</p>
        <ul>
          <li>Your name and email address</li>
          <li>Your message, and details you choose to add such as the home, travel dates, number of guests, preferred currency, or a property address</li>
          <li>Whether you agreed to receive marketing emails</li>
        </ul>
        <p><strong>When you book Hot Tub Oasis directly:</strong></p>
        <ul>
          <li>Your name, email address and phone number</li>
          <li>Your dates, number of guests, any notes, and the amount paid</li>
          <li>
            Your payment is handled entirely by Stripe on its own secure checkout page. We never see,
            receive or store your full card number.
          </li>
        </ul>
        <p><strong>When you use the live chat</strong>, Tawk.to records the conversation so we can reply.</p>
        <p>
          <strong>Technical information.</strong> Like most websites, our hosting and error-monitoring
          services automatically record basic technical details (such as browser type, pages visited,
          and error reports) to keep the site secure and working.
        </p>
      </section>

      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To reply to you, check availability, and arrange or manage your stay</li>
          <li>To take payment, send confirmations, and give check-in details for direct bookings</li>
          <li>To handle changes, cancellations and refunds</li>
          <li>To keep records we are required to keep, such as tax and payment records</li>
          <li>To send occasional emails about new homes and offers, only if you said yes</li>
          <li>To keep the website secure and fix problems</li>
        </ul>
        <p>We only use your information for these purposes. We do not sell or rent it to anyone.</p>
      </section>

      <section>
        <h2>Who helps us</h2>
        <p>We use trusted service providers to run this site. Each only gets what it needs to do its job:</p>
        <ul>
          <li><strong>Supabase</strong>: stores enquiries and bookings (servers in Canada)</li>
          <li><strong>Stripe</strong>: processes payments for direct bookings</li>
          <li><strong>Resend</strong>: sends our emails and notifications</li>
          <li><strong>Vercel</strong>: hosts the website</li>
          <li><strong>Tawk.to</strong>: provides the live chat</li>
          <li><strong>Sentry</strong>: reports technical errors so we can fix them</li>
        </ul>
        <p>
          Some of these providers store or process information outside Canada, including in the
          United States, where it may be accessible to authorities under local law. We choose
          providers with strong security and privacy commitments.
        </p>
      </section>

      <section>
        <h2>Information kept on your device</h2>
        <p>
          If you save stays (the heart button) or choose a currency, that choice is kept in your own
          browser&apos;s storage on your device so it is still there next time. It is never sent to us.
          Clearing your browser data removes it. See our <a href="/cookies">Cookies notice</a> for more.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <ul>
          <li>Enquiries and chat messages: up to 2 years after our last contact with you</li>
          <li>Booking and payment records: 7 years, as Canadian tax rules require</li>
          <li>Marketing consent: until you unsubscribe, plus a record of when you did</li>
        </ul>
        <p>After that, we delete it or make it anonymous.</p>
      </section>

      <section>
        <h2>How we protect it</h2>
        <p>
          Your information is only accessible to Sam and Maddie through a password-protected admin
          area, and to our service providers as described above. Connections to this site are
          encrypted. If a breach ever put your information at real risk of significant harm, we
          would tell you and the Office of the Privacy Commissioner of Canada, as the law requires.
        </p>
      </section>

      <section>
        <h2>Marketing emails</h2>
        <p>
          We only send marketing emails if you tick the box agreeing to them. Every email includes a
          way to unsubscribe, or you can just reply or email us. Booking confirmations and replies to
          your messages are not marketing and are sent either way.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>You can ask us at any time to:</p>
        <ul>
          <li>Tell you what personal information we hold about you</li>
          <li>Correct anything that is wrong</li>
          <li>Delete your information, unless we must keep it by law (for example tax records)</li>
          <li>Stop sending you marketing emails</li>
        </ul>
        <p>
          We will reply within 30 days. If you are not happy with our answer, you can contact the{" "}
          <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer">Office of the Privacy Commissioner of Canada</a>.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>This site is for adults planning stays. We do not knowingly collect information from anyone under 18.</p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>If we change this policy, we will update it here and change the date at the top.</p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          Sam and Maddie are responsible for privacy at M&amp;S Hosting Solutions. For any question or
          request, email <a href="mailto:info.mshostingsolutions@gmail.com">info.mshostingsolutions@gmail.com</a> or
          call <a href="tel:9059226538">(905) 922-6538</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
