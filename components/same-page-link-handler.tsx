"use client";

import { useEffect } from "react";

export default function SamePageLinkHandler() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (!(e instanceof MouseEvent)) return;
      if (e.button !== 0) return; // left click only
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as Element | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore mailto/tel and external links
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
      // Resolve URL against current location
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return; // external

      // If link points to same pathname (ignore search/hash), prevent navigation and scroll to top
      if (url.pathname === window.location.pathname) {
        e.preventDefault();
        const container = document.querySelector('[class*="overflow-y-auto"]') as HTMLElement | null;
        if (container) {
          container.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          try {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch {
            window.scrollTo(0, 0);
          }
        }
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
