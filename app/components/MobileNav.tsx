"use client";
// App-style bottom bar on phones (hidden from tablet up).
// Stays, Map, Saved (with live count), and Call.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BedDouble, Heart, Map, Phone } from "lucide-react";
import { useSaved } from "./useSaved";

export default function MobileNav() {
  const { count } = useSaved();
  const path = usePathname();
  const items = [
    { href: "/#stays", label: "Stays", icon: BedDouble, active: path === "/" },
    { href: "/#map", label: "Map", icon: Map, active: false },
    { href: "/saved", label: "Saved", icon: Heart, active: path === "/saved", badge: count },
    { href: "tel:9059226538", label: "Call", icon: Phone, active: false },
  ];
  if (path?.startsWith("/admin")) return null; // not needed inside the admin
  return (
    <nav
      aria-label="Quick links"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-bone/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="m-0 grid list-none grid-cols-4 p-0">
        {items.map(({ href, label, icon: Icon, active, badge }) => (
          <li key={label}>
            <Link
              href={href}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-[0.12em] no-underline ${active ? "text-clay" : "text-ink-soft"}`}
            >
              <Icon size={19} />
              {label}
              {badge ? (
                <span className="absolute right-[calc(50%-20px)] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[9px] text-bone">
                  {badge}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
