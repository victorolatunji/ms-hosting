// Enquiries inbox: every form on the site lands here.
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPropertyBySlug } from "@/lib/properties";
import { setInquiryStatus } from "../actions";
import { DbDown, PageTitle, Pill, when } from "../ui";

const TYPES = { all: "All", property: "Booking requests", contact: "General", host: "Become a host", cancellation: "Cancellations" } as const;
const STATUS = { new: "New", replied: "Replied", archived: "Archived" } as const;
type T = keyof typeof TYPES;
type S = keyof typeof STATUS;

type Row = {
  id: string | number; created_at: string; type: string; name: string; email: string; subject: string | null;
  message: string; marketing_consent: boolean; property_slug: string | null; property_address: string | null;
  booking_date: string | null; status: S;
};

export default async function Inbox({ searchParams }: { searchParams: Promise<{ type?: string; status?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const type: T = sp.type && sp.type in TYPES ? (sp.type as T) : "all";
  const status: S = sp.status && sp.status in STATUS ? (sp.status as S) : "new";

  let q = supabaseAdmin.from("inquiries").select("*").eq("status", status).order("created_at", { ascending: false }).limit(200);
  if (type !== "all") q = q.eq("type", type);
  const { data, error } = await q;
  const rows = (data ?? []) as Row[];

  const href = (t: T, s: S) => `/admin/inbox?type=${t}&status=${s}`;

  return (
    <>
      <PageTitle title="Inbox" sub="Every form on the site lands here, newest first." />

      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(STATUS) as S[]).map((s) => (
          <Link key={s} href={href(type, s)} className={`rounded-full border px-4 py-1.5 text-[13px] no-underline ${s === status ? "border-moss bg-moss text-bone" : "border-line text-ink"}`}>
            {STATUS[s]}
          </Link>
        ))}
      </div>
      <div className="mb-7 flex flex-wrap gap-2">
        {(Object.keys(TYPES) as T[]).map((t) => (
          <Link key={t} href={href(t, status)} className={`rounded-full border px-3 py-1 text-[12px] no-underline ${t === type ? "border-clay text-clay" : "border-line text-ink-soft"}`}>
            {TYPES[t]}
          </Link>
        ))}
      </div>

      {error ? (
        <DbDown what="enquiries" />
      ) : rows.length === 0 ? (
        <p className="text-[14px] text-ink-soft">Nothing here. Lovely.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {rows.map((r) => {
            const stay = r.property_slug ? getPropertyBySlug(r.property_slug) : null;
            const subject = encodeURIComponent(`Re: ${r.subject ?? "Your enquiry"} · M&S Hosting Solutions`);
            const body = encodeURIComponent(`Hi ${r.name.split(" ")[0]},\n\nThank you for reaching out.\n\n\n\nWarmly,\nSam & Maddie\nM&S Hosting Solutions\n(905) 922-6538\n\n> ${r.message.replace(/\n/g, "\n> ")}`);
            return (
              <li key={r.id} className="rounded-[18px] border border-line bg-bone p-5 md:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Pill tone={r.type === "property" ? "clay" : r.type === "host" ? "moss" : r.type === "cancellation" ? "amber" : "neutral"}>
                    {TYPES[(r.type as T)] ?? r.type}
                  </Pill>
                  {r.marketing_consent && <Pill>Marketing opt-in</Pill>}
                  <span className="ml-auto font-mono text-[11px] text-ink-soft">{when(r.created_at)}</span>
                </div>
                <div className="font-display text-[22px] leading-tight text-moss">{r.name}</div>
                <a href={`mailto:${r.email}`} className="text-[13px] text-clay no-underline">{r.email}</a>
                <dl className="m-0 mt-3 grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2">
                  {stay && <div><dt className="inline text-ink-soft">Home: </dt><dd className="m-0 inline"><Link href={`/stays/${stay.slug}`} target="_blank" className="text-ink">{stay.name}, {stay.city}</Link></dd></div>}
                  {r.booking_date && <div><dt className="inline text-ink-soft">Dates: </dt><dd className="m-0 inline">{r.booking_date}</dd></div>}
                  {r.property_address && <div><dt className="inline text-ink-soft">Address: </dt><dd className="m-0 inline">{r.property_address}</dd></div>}
                  {r.subject && !stay && <div><dt className="inline text-ink-soft">Subject: </dt><dd className="m-0 inline">{r.subject}</dd></div>}
                </dl>
                <p className="m-0 mt-3 whitespace-pre-wrap text-[14px] leading-[1.65] text-ink">{r.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`mailto:${r.email}?subject=${subject}&body=${body}`} className="rounded-full bg-clay px-4 py-2 text-[13px] font-medium text-bone no-underline">
                    Reply by email
                  </a>
                  {(Object.keys(STATUS) as S[]).filter((s) => s !== r.status).map((s) => (
                    <form key={s} action={setInquiryStatus.bind(null, r.id, s)}>
                      <button className="cursor-pointer rounded-full border border-line bg-transparent px-4 py-2 text-[13px] text-ink hover:border-clay">
                        Mark {STATUS[s].toLowerCase()}
                      </button>
                    </form>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
