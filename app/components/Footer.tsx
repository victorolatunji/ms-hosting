import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

// Footer. Dark moss-dark background, four columns + bottom strip.
// Server component, all static content.
// Links wired to real pages where they exist, # for placeholders that are
// still planned (Wishlist, Reviews, Terms, Privacy, Cookies).

// The three link columns. Each is a title and a list of [label, href] pairs.
const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Explore",
    links: [
      ["All stays", "/#stays"],
      ["Cities", "/#cities"],
      ["Map view", "/#map"],
      ["Wishlist", "#"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Maddie & Sam", "/#about"],
      ["Contact", "/#contact"],
      ["Reviews", "#"],
      ["Become a host", "/become-a-host"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "#"],
      ["Privacy policy", "#"],
      ["Cookies", "#"],
      ["Cancellations", "/cancellations"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-moss-dark text-bone/65 px-6 pt-[72px] pb-9 max-md:px-5 max-md:pt-14 max-md:pb-7">
      <div className="max-w-[1320px] mx-auto">

        {/* Four-column grid */}
        <div
          className="grid gap-11 mb-14"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
        >

          {/* Column 1: brand */}
          <div>
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
              Family run hosting in the Greater Toronto Area. Eleven homes, two
              hosts, real people on the line.
            </p>
            <a
              href="tel:9059226538"
              className="text-amber text-[13px] no-underline inline-flex items-center gap-1.5"
            >
              <Phone size={12} /> (905) 922 6538
            </a>
          </div>

          {/* Columns 2-4: link lists */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-amber text-[10px] tracking-[0.22em] uppercase mb-5">
                {col.title}
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-[11px]">
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
          <span>(C) 2026 M&amp;S Hosting Solutions. All rights reserved.</span>
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-bone/50">
              Site by{" "}
              <a
                href="https://github.com/victorolatunji"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone/70 hover:text-amber transition-colors no-underline"
              >
                vao.dev
              </a>
            </span>
            <span className="font-mono tracking-[0.12em] uppercase text-[10px]">
              Made with care in Ontario
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}