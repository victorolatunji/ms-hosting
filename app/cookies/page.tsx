// Cookies page. Discloses what's actually running (Tawk.to chat, Sentry).
// Keep this honest — update it if you add/remove tools that set cookies.
//
// Place at: /app/cookies/page.tsx

import type { Metadata } from "next";
import LegalLayout from "@/app/components/LegalLayout";

export const metadata: Metadata = {
  title: "Cookies | M&S Hosting",
  description: "How M&S Hosting Solutions uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Notice" updated="[Month] 2026">
      <section>
        <p>
          Cookies are small files stored on your device that help a website work and remember
          things between visits. This notice explains the cookies this site uses.
        </p>
        <p>
          <strong>This is a draft for client review.</strong> Confirm the list below matches the
          tools actually running before this page goes live.
        </p>
      </section>

      <section>
        <h2>Essential</h2>
        <p>
          These keep the site working and cannot be turned off. They include cookies that help the
          site load correctly and securely.
        </p>
      </section>

      <section>
        <h2>Live chat</h2>
        <p>
          We use <strong>Tawk.to</strong> to power the chat widget. If you use the chat, Tawk.to
          sets cookies to remember your conversation. See Tawk.to&apos;s own privacy policy for
          details on what it stores.
        </p>
      </section>

      <section>
        <h2>Error monitoring</h2>
        <p>
          We use <strong>Sentry</strong> to detect and diagnose technical errors so we can keep the
          site working properly. It may store limited technical information about your session to do
          this.
        </p>
      </section>

      <section>
        <h2>Managing cookies</h2>
        <p>
          You can clear or block cookies in your browser settings at any time. Blocking some cookies
          may affect how parts of the site work, such as the live chat.
        </p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          Questions about cookies? Email{" "}
          <a href="mailto:info.mshostingsolutions@gmail.com">info.mshostingsolutions@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  );
}