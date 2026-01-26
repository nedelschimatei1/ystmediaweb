"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Globe, Sun, Moon } from "lucide-react";
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
          <Link href="/" className="flex items-center gap-2">
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
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
                theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
              aria-label={`Toggle language, current: ${locale.toUpperCase()}`}
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{locale}</span>
            </button>

            {/* CTA Button */}
            <Link
              href="/contact#form"
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
                theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={toggleLocale}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Toggle language, current: ${locale.toUpperCase()}`}
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact#form"
              onClick={() => setIsOpen(false)}
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
