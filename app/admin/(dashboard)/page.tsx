// Admin overview: what needs attention today.
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getStatuses } from "@/lib/listing-status";
import { PROPERTIES } from "@/lib/properties";
import { PageTitle } from "./ui";

export default async function AdminOverview() {
  await requireAdmin();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Toronto" });

  const [newInq, upcoming, statuses] = await Promise.all([
    supabaseAdmin.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabaseAdmin.from("bookings").select("id", { count: "exact", head: true }).eq("status", "confirmed").gte("checkout", today),
    getStatuses(),
  ]);
  const dbOk = !newInq.error;
  const unavailable = PROPERTIES.filter((p) => statuses[p.slug] === "unavailable").length;
  const hidden = PROPERTIES.filter((p) => statuses[p.slug] === "hidden").length;

  const cards = [
    { href: "/admin/inbox", n: dbOk ? newInq.count ?? 0 : "?", label: "New enquiries", hint: "Waiting for a reply" },
    { href: "/admin/bookings", n: upcoming.error ? "?" : upcoming.count ?? 0, label: "Upcoming direct bookings", hint: "Hot Tub Oasis" },
    { href: "/admin/listings", n: PROPERTIES.length - hidden, label: "Listings on the site", hint: `${unavailable} unavailable, ${hidden} hidden` },
  ];

  return (
    <>
      <PageTitle title="Hello, Sam & Maddie." sub="Here is what needs you today." />
      {!dbOk && (
        <div className="mb-6 rounded-[14px] border border-clay/30 bg-clay/10 px-5 py-4 text-[14px] text-ink">
          The database isn&apos;t reachable, so counts show “?”. Enquiries are still arriving by email.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="lift block rounded-[18px] border border-line bg-bone p-6 text-ink no-underline">
            <div className="font-display text-[44px] leading-none text-clay">{c.n}</div>
            <div className="mt-3 text-[15px] font-medium">{c.label}</div>
            <div className="mt-1 text-[13px] text-ink-soft">{c.hint}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
