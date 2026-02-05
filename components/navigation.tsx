"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// Inline minimal SVG icons to avoid pulling in the entire icon library
function IconMenu({ className = "w-6 h-6" }: { className?: string }){
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}
function IconX({ className = "w-6 h-6" }: { className?: string }){
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function IconSun({ className = "w-4 h-4" }: { className?: string }){
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M20 12h2M2 12H4M16.95 7.05l1.41-1.41M4.64 19.36l1.41-1.41M16.95 16.95l1.41 1.41M4.64 4.64l1.41 1.41" />
    </svg>
  );
}
function IconMoon({ className = "w-4 h-4" }: { className?: string }){
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
import { cn } from "@/lib/utils";
import { useI18n, Locale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch by only rendering theme icon after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // Close mobile menu in all cases
    setIsOpen(false);

    // If clicking a link to the same pathname, prevent default navigation
    // and scroll the proper container to top (supports scroll-snap container).
    if (pathname === href.split("#")[0]) {
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
  };

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/portfolio", label: t("nav.portfolio") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const toggleLocale = () => {
    setLocale(locale === "ro" ? "en" : "ro");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={(e) => handleLinkClick(e, "/") }>
            {mounted ? (
              <Image
                src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
                alt="YST Media"
                width={640}
                height={427}
                priority
                fetchPriority="high"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 400px"
                className="h-36 sm:h-40 md:h-44 lg:h-48"
                style={{ aspectRatio: '640/427', width: 'auto' }}
              />
            ) : (
              <div className="h-36 sm:h-40 md:h-44 lg:h-48" style={{ aspectRatio: '640/427', width: 'auto' }} />
            )}
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-20 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="inline-flex items-center justify-center transform-gpu backface-hidden antialiased px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted dark:bg-muted/10 dark:hover:bg-muted/20 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/40 dark:hover:shadow-primary/40 active:translate-y-0"
                style={{ willChange: 'transform' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
              aria-label={`Toggle language, current: ${locale === "ro" ? "Romanian" : "English"}`}
            >
              <Image
                src={locale === "ro" ? "/flags/ro.svg" : "/flags/gb.svg"}
                alt={locale === "ro" ? "Romanian flag" : "British flag"}
                width={locale === "ro" ? 24 : 32}
                height={16}
                className="rounded-sm object-cover h-4 w-auto"
                style={{ width: 'auto' }}
                loading="eager"
              />
              <span className="uppercase">{locale}</span>
            </button>

            {/* CTA Button */}
            <Link
              href="/contact#form"
              prefetch={false}
              onClick={(e) => handleLinkClick(e, "/contact#form")}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-primary-foreground bg-primary dark:bg-accent dark:text-accent-foreground rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-100"
            >
              {t("nav.letsChat")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={toggleLocale}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Toggle language, current: ${locale === "ro" ? "Romanian" : "English"}`}
            >
              <Image
                src={locale === "ro" ? "/flags/ro.svg" : "/flags/gb.svg"}
                alt={locale === "ro" ? "Romanian flag" : "British flag"}
                width={locale === "ro" ? 22 : 28}
                height={16}
                className="rounded-sm object-cover h-4 w-auto"
                style={{ width: 'auto' }}
                loading="eager"
              />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-80 pb-6" : "max-h-0"
          )}
        >
          <div className="flex flex-col items-center gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact#form"
              prefetch={false}
              onClick={(e) => handleLinkClick(e, "/contact#form")}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-full transition-all duration-300 hover:scale-105 mt-2"
            >
              {t("nav.letsChat")}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
