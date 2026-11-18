// What the Cancellations popup shows: the Hot Tub Oasis policy and house rules,
// plus a link to the cancellation request form (data-form: the popup closes and
// the page scrolls to the form).
import Link from "next/link";
import DirectPolicy from "./DirectPolicy";

export default function CancellationsSummary() {
  return (
    <>
      <DirectPolicy id="direct" inPopup />
      <p className="m-0 mt-6 text-[14px]">
        Need to cancel or move your dates?{" "}
        <Link href="/cancellations#cancel-form" data-form className="text-clay">Send us a cancellation request</Link> and Sam or Maddie will
        reply the same day.
      </p>
    </>
  );
}
