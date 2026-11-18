// Hot Tub Oasis cancellation policy and house rules.
// Shared by /cancellations and the legal popup (opened from the Book now panel).
import Eyebrow from "@/app/components/ui/Eyebrow";
import { DIRECT_CANCELLATION, DIRECT_HOUSE_RULES } from "@/lib/policies";

export default function DirectPolicy({ id = "direct", inPopup = false }: { id?: string; inPopup?: boolean }) {
  return (
    <section id={id} className={`${inPopup ? "mt-4" : "mt-10"} rounded-[22px] border border-line p-7 max-md:p-5`}>
      <Eyebrow>Booked direct with us</Eyebrow>
      <h2 className="m-0 mb-4 font-display text-[28px] leading-tight text-moss">
        Hot Tub Oasis: <span className="italic text-clay">{DIRECT_CANCELLATION.name} policy</span>
      </h2>
      <p className="m-0 mb-3 text-[14px] text-ink-soft">The same policy as the home&apos;s Airbnb listing:</p>
      <ul className="m-0 mb-6 flex list-none flex-col gap-2.5 p-0">
        {DIRECT_CANCELLATION.rules.map((r) => (
          <li key={r} className="flex items-start gap-3 text-[14px] leading-[1.6] text-ink">
            <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rotate-45 bg-clay" /> {r}
          </li>
        ))}
      </ul>
      <h3 className="m-0 mb-3 font-display text-[21px] text-moss">House rules</h3>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {DIRECT_HOUSE_RULES.map((r) => (
          <li key={r} className="flex items-start gap-3 text-[14px] leading-[1.6] text-ink-soft">
            <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rotate-45 bg-amber" /> {r}
          </li>
        ))}
      </ul>
      {!inPopup && (
      <p className="m-0 mt-5 text-[13px] text-ink-soft">
        Booked on Airbnb or another platform? Cancel through that platform, where its policy applies.
        Questions either way, send us a note below.
      </p>
      )}
    </section>
  );
}
