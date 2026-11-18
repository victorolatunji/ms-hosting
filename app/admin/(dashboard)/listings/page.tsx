// Listings: switch each home between Live, Unavailable and Hidden.
// Changes show on the public site straight away.
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getStatuses, STATUSES, type ListingStatus } from "@/lib/listing-status";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PROPERTIES } from "@/lib/properties";
import { setListingStatus } from "../actions";
import { PageTitle, Pill } from "../ui";

const LABEL: Record<ListingStatus, string> = { live: "Live", unavailable: "Unavailable", hidden: "Hidden" };
const HELP: Record<ListingStatus, string> = {
  live: "Shown and bookable",
  unavailable: "Shown greyed out, not clickable",
  hidden: "Removed from the site",
};

export default async function Listings() {
  await requireAdmin();
  const [statuses, ping] = await Promise.all([
    getStatuses(),
    supabaseAdmin.from("listing_status").select("slug", { head: true, count: "exact" }),
  ]);
  const dbOk = !ping.error;

  const sorted = PROPERTIES;

  return (
    <>
      <PageTitle title="Listings" sub="Live, Unavailable (greyed out, can't be clicked) or Hidden (off the site). Changes apply right away." />
      {!dbOk && (
        <div className="mb-6 rounded-[14px] border border-clay/30 bg-clay/10 px-5 py-4 text-[14px] text-ink">
          The database isn&apos;t reachable, so changes can&apos;t be saved right now and every listing shows as Live.
        </div>
      )}
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {sorted.map((p) => {
          const st: ListingStatus = statuses[p.slug] ?? "live";
          return (
            <li key={p.slug} className={`flex flex-col gap-4 rounded-[18px] border bg-bone p-4 sm:flex-row sm:items-center border-line`}>
              <div className="flex min-w-0 flex-1 items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt="" className={`h-16 w-20 shrink-0 rounded-lg object-cover ${st === "live" ? "" : "grayscale"}`} />
                <div className="min-w-0">
                  <Link href={`/stays/${p.slug}`} target="_blank" className="block truncate font-display text-[19px] text-moss no-underline">{p.name}</Link>
                  <div className="text-[12px] text-ink-soft">{p.city} · sleeps {p.guests} · {p.bookingMode === "direct" ? "Book now" : "Request to book"}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Pill tone={st === "live" ? "moss" : st === "unavailable" ? "amber" : "clay"}>{LABEL[st]}</Pill>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 overflow-hidden rounded-full border border-line" role="group" aria-label={`Status for ${p.name}`}>
                {STATUSES.map((s) => (
                  <form key={s} action={setListingStatus.bind(null, p.slug, s)}>
                    <button
                      disabled={!dbOk || s === st}
                      title={HELP[s]}
                      className={`cursor-pointer border-none px-4 py-2 text-[13px] disabled:cursor-default ${s === st ? "bg-moss text-bone" : "bg-transparent text-ink hover:bg-bone-soft disabled:opacity-50"}`}
                    >
                      {LABEL[s]}
                    </button>
                  </form>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
