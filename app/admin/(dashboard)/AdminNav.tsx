"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/listings", label: "Listings" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="border-b border-line bg-bone-soft">
      <div className="mx-auto flex max-w-[1100px] gap-1 overflow-x-auto px-4 [scrollbar-width:none] md:px-6">
        {TABS.map((t) => {
          const active = t.href === "/admin" ? path === "/admin" : path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-[14px] no-underline transition-colors ${active ? "border-clay text-clay" : "border-transparent text-ink-soft hover:text-ink"}`}
            >
              {t.label}
            </Link>
          );
        })}
        <Link href="/" target="_blank" className="ml-auto whitespace-nowrap px-3 py-3 text-[13px] text-ink-soft no-underline hover:text-clay">
          View site ↗
        </Link>
      </div>
    </nav>
  );
}
