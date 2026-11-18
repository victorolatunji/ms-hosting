import { PROPERTIES } from "@/lib/properties";
import { capWords } from "@/lib/words";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

// Footer. Dark moss-dark background, four columns + bottom strip.
// Server component, all static content.
// Every link points at a real page.

// The three link columns. Each is a title and a list of [label, href] pairs.
const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Explore",
    links: [
      ["All stays", "/#stays"],
      ["Cities", "/#cities"],
      ["Map view", "/#map"],
      ["Saved stays", "/saved"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Sam & Maddie", "/#about"],
      ["Contact", "/#contact"],
      ["Book Hot Tub Oasis", "/stays/hot-tub-oasis"],
      ["Become a host", "/become-a-host"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "/terms"],
      ["Privacy policy", "/privacy"],
      ["Cookies", "/cookies"],
      ["Cancellations", "/cancellations"],
    ],
  },
];

const INSTAGRAM = "https://www.instagram.com/mshostingsolutions";

export default function Footer() {
  return (
    <footer className="bg-moss-dark text-bone/65 px-6 pt-[72px] pb-9 max-md:px-5 max-md:pt-14 max-md:pb-7">
      <div className="max-w-[1320px] mx-auto">

        {/* Brand full width on phones, then link columns side by side */}
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-11">

          {/* Column 1: brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/images/logo.jpeg"
                alt=""
                width={44}
                height={44}
                className="rounded-full object-cover bg-bone"
              />
              <span className="font-display text-bone text-[20px] font-semibold">
                M&amp;S Hosting
              </span>
            </div>
            <p className="text-[13px] leading-[1.7] m-0 mb-4 max-w-[280px]">
              Family run hosting across Ontario. {capWords(PROPERTIES.length)} homes, two
              hosts, real people on the line.
            </p>
            <a
              href="tel:9059226538"
              className="text-amber text-[13px] no-underline inline-flex items-center gap-1.5"
            >
              <Phone size={12} /> (905) 922 6538
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="M&S Hosting Solutions on Instagram"
              className="mt-3 flex w-fit items-center gap-2 text-[13px] text-bone/80 no-underline transition-colors hover:text-amber"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
              @mshostingsolutions
            </a>
          </div>

          {/* Columns 2-4: link lists */}
          {COLUMNS.map((col, i) => (
            <div key={col.title} className={i === COLUMNS.length - 1 ? "col-span-2 sm:col-span-1" : ""}>
              <div className="font-mono text-amber text-[10px] tracking-[0.22em] uppercase mb-5">
                {col.title}
              </div>
              <ul className={`list-none p-0 m-0 gap-[11px] ${i === COLUMNS.length - 1 ? "grid grid-cols-2 sm:flex sm:flex-col" : "flex flex-col"}`}>
                {col.links.map(([label, href]) => {
                  // Use Next.js Link for internal routes (those starting with /).
                  // External / placeholder hrefs (# or http) use a plain <a>.
                  const isInternalRoute = href.startsWith("/");
                  return (
                    <li key={label}>
                      {isInternalRoute ? (
                        <Link
                          href={href}
                          className="text-bone/70 no-underline text-sm hover:text-bone transition-colors"
                        >
                          {label}
                        </Link>
                      ) : (
                        <a
                          href={href}
                          className="text-bone/70 no-underline text-sm hover:text-bone transition-colors"
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip: copyright + locality + developer credit */}
        <div className="border-t border-bone/10 pt-[26px] flex justify-between flex-wrap gap-4 text-[12px]">
          <span>© {new Date().getFullYear()} M&amp;S Hosting Solutions. All rights reserved.</span>
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-bone/50">
              Site by{" "}
              <a
                href="https://victorolatunji.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone/70 hover:text-amber transition-colors no-underline"
              >
                victorolatunji@vaolabs.dev
              </a>
            </span>
            <Link href="/admin/login" className="text-bone/50 no-underline transition-colors hover:text-amber">
              Team login
            </Link>
            <span className="font-mono tracking-[0.12em] uppercase text-[10px]">
              Made with care in Ontario
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}