// Body of the Cookies page. Shared by app/cookies/page.tsx and the legal popup.

export const COOKIES_TITLE = "Cookies";
export const COOKIES_UPDATED = "November 2026";

export default function CookiesBody() {
  return (
    <>
    <section>
      <p>
        Cookies and similar browser storage are small pieces of information kept on your device
        that help a website work and remember things between visits. Here is everything this site
        uses. We do not use advertising cookies or sell any data.
      </p>
    </section>

    <section>
      <h2>Essential</h2>
      <p>
        Needed for the site to work and stay secure, so they cannot be switched off. This includes the
        sign-in cookie for our private admin area (used only by Sam and Maddie).
      </p>
    </section>

    <section>
      <h2>Your preferences (kept on your device)</h2>
      <ul>
        <li><strong>Saved stays</strong>: the homes you tap the heart on</li>
        <li><strong>Currency</strong>: the currency you choose for prices</li>
      </ul>
      <p>These stay in your browser and are never sent to us. Clearing your browser data removes them.</p>
    </section>

    <section>
      <h2>Live chat</h2>
      <p>
        Tawk.to powers our chat widget. It sets cookies to remember your conversation. See
        Tawk.to&apos;s privacy policy for details.
      </p>
    </section>

    <section>
      <h2>Payments</h2>
      <p>
        When you book directly, you pay on Stripe&apos;s secure checkout page. Stripe uses cookies there
        to process the payment safely and prevent fraud. See Stripe&apos;s privacy policy for details.
      </p>
    </section>

    <section>
      <h2>Error monitoring</h2>
      <p>
        Sentry helps us find and fix technical errors. It may record limited technical information
        about your visit (such as browser type and the page where an error happened).
      </p>
    </section>

    <section>
      <h2>Managing cookies</h2>
      <p>
        You can clear or block cookies in your browser settings at any time. Blocking some may stop
        parts of the site working, such as the chat or saved stays.
      </p>
    </section>

    <section>
      <h2>Contact us</h2>
      <p>
        Questions? Email <a href="mailto:info.mshostingsolutions@gmail.com">info.mshostingsolutions@gmail.com</a>.
      </p>
    </section>
    </>
  );
}
