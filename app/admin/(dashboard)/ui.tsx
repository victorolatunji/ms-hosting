// Small shared pieces for admin screens.
export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-7">
      <h1 className="m-0 font-display text-[34px] leading-tight text-moss">{title}</h1>
      {sub && <p className="m-0 mt-1 text-[14px] text-ink-soft">{sub}</p>}
    </div>
  );
}

export function DbDown({ what }: { what: string }) {
  return (
    <div className="rounded-[14px] border border-clay/30 bg-clay/10 px-5 py-4 text-[14px] leading-[1.6] text-ink">
      Can&apos;t load {what} right now: the database isn&apos;t reachable. Enquiries are still emailed to
      info.mshostingsolutions@gmail.com, so nothing is lost. Check the Supabase project is running.
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "clay" | "moss" | "amber" }) {
  const tones = {
    neutral: "border-line text-ink-soft",
    clay: "border-clay/40 bg-clay/10 text-clay",
    moss: "border-moss/30 bg-moss/10 text-moss",
    amber: "border-amber/50 bg-amber/15 text-ink",
  };
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${tones[tone]}`}>{children}</span>;
}

export const when = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", { timeZone: "America/Toronto", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
