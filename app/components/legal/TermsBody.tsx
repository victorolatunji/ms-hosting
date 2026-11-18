// Body of the Terms of Use and Booking page. Shared by app/terms/page.tsx and the legal popup.
import Link from "next/link";
import { DIRECT_CANCELLATION, DIRECT_HOUSE_RULES } from "@/lib/policies";

export const TERMS_TITLE = "Terms of Use and Booking";
export const TERMS_UPDATED = "November 2026";

export default function TermsBody() {
  return (
    <>
    <section>
      <p>
        These terms apply to the M&amp;S Hosting Solutions website (mshostingsolutions.ca) and to
        stays booked through it. M&amp;S Hosting Solutions is run by Sam and Maddie Jean-Louis in
        Ontario, Canada. By using the site or booking a stay, you agree to these terms.
      </p>
    </section>

    <section>
      <h2>Two ways to book</h2>
      <p>
        <strong>Request to book (most homes).</strong> Sending a request starts a conversation. It is
        not a confirmed reservation. We reply with availability and rates, and your stay is only
        confirmed once we agree the details with you directly. Some stays may be completed on a
        booking platform such as Airbnb, in which case that platform&apos;s terms also apply.
      </p>
      <p>
        <strong>Book now (Hot Tub Oasis).</strong> When you pay through our secure checkout and
        receive a confirmation email, your reservation is confirmed and these terms, the house
        rules and the cancellation policy below form our agreement with you.
      </p>
    </section>

    <section>
      <h2>Who can book</h2>
      <p>
        You must be at least 18 to book, and you must be staying at the home. The person who books
        is responsible for everyone in their group and for following the house rules.
      </p>
    </section>

    <section>
      <h2>Prices and payment</h2>
      <ul>
        <li>Prices are set in Canadian dollars (CAD), and direct bookings are charged in CAD.</li>
        <li>
          Prices shown in other currencies are estimates for guidance, using a daily exchange rate.
          Your bank&apos;s rate and any card fees may differ.
        </li>
        <li>The total shown before you pay is the total you are charged, including any taxes we are required to collect.</li>
        <li>Payments are processed securely by Stripe. Full payment is taken at the time of booking.</li>
      </ul>
    </section>

    <section>
      <h2>Cancellations and refunds</h2>
      <p>
        For direct bookings, our <strong>{DIRECT_CANCELLATION.name}</strong> policy applies. It is the
        same policy as the home&apos;s Airbnb listing:
      </p>
      <ul>
        {DIRECT_CANCELLATION.rules.map((r) => <li key={r}>{r}</li>)}
      </ul>
      <p>
        To cancel or change dates, use our <Link href="/cancellations">cancellations page</Link>, or
        email or call us. For stays booked on another platform, that platform&apos;s cancellation
        policy applies.
      </p>
    </section>

    <section>
      <h2>House rules</h2>
      <p>Each home lists its rules on its page under &quot;Good to know&quot;. For Hot Tub Oasis:</p>
      <ul>
        {DIRECT_HOUSE_RULES.map((r) => <li key={r}>{r}</li>)}
      </ul>
      <p>
        The number of guests may not exceed what the listing allows. Parties, events and unregistered
        visitors are not allowed in any of our homes.
      </p>
    </section>

    <section>
      <h2>Your stay</h2>
      <ul>
        <li>Please treat the home with care. You are responsible for damage caused during your stay beyond normal wear and tear, and we may charge the reasonable cost of repairs or extra cleaning.</li>
        <li>If house rules are seriously broken (for example a party or over-occupancy), we may end the stay early without a refund.</li>
        <li>Some homes have exterior security cameras, always disclosed on the listing. Cameras never cover inside spaces or private areas such as hot tubs.</li>
        <li>Use of hot tubs, fire pits, BBQs and other amenities is at your own risk and must follow the posted rules.</li>
      </ul>
    </section>

    <section>
      <h2>If we have to cancel</h2>
      <p>
        In the rare case we must cancel your stay (for example due to an emergency or a problem with
        the home), we will tell you as soon as possible and give you a full refund.
      </p>
    </section>

    <section>
      <h2>Accuracy</h2>
      <p>
        We work hard to keep descriptions, photos and details accurate, but small things can change.
        If something important is not as described when you arrive, tell us right away so we can make it right.
      </p>
    </section>

    <section>
      <h2>Liability</h2>
      <p>
        To the extent permitted by law, we are not responsible for loss of or damage to your
        belongings, or for indirect losses connected with your stay or your use of this website.
        Nothing in these terms limits any rights you have under Ontario consumer protection law.
      </p>
    </section>

    <section>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Ontario and the federal laws of Canada that apply there.</p>
    </section>

    <section>
      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. The version shown when you book is the one that
        applies to your stay.
      </p>
    </section>

    <section>
      <h2>Contact us</h2>
      <p>
        Questions? Email <a href="mailto:info.mshostingsolutions@gmail.com">info.mshostingsolutions@gmail.com</a> or
        call <a href="tel:9059226538">(905) 922-6538</a>.
      </p>
    </section>
    </>
  );
}
