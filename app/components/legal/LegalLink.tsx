"use client";
// A link to a legal page that opens it in a popup instead of leaving the page.
// Still a real link underneath: Ctrl/Cmd-click, middle-click and search engines
// get the full page, and it works even before the page's JavaScript has loaded.

import { useCallback, useState } from "react";
import LegalModal from "./LegalModal";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export default function LegalLink({ href, onClick, children, ...rest }: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <a
        {...rest}
        href={href}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </a>
      {open && <LegalModal href={href} onClose={close} />}
    </>
  );
}
