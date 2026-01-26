"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";

export function Footer() {
  const { t, locale } = useI18n();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const footerLinks = {
    navigation: [
      { href: "/", label: t("nav.home") },
      { href: "/portfolio", label: t("nav.portfolio") },
      { href: "/contact", label: t("nav.contact") },
    ],
    services: [
      { href: "/portfolio", label: t("service.hotelManagement") },
      { href: "/portfolio", label: t("service.seoMarketing") },
      { href: "/portfolio", label: t("service.certifications") },
      { href: "/portfolio", label: t("service.mysteryShopper") },
    ],
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 -mt-8 flex justify-center sm:justify-start">
            <Link href="/" className="inline-block">
              {mounted ? (
                <Image
                  src={theme === "light" ? "/logo-dark.png" : "/logo-light.png"}
                  alt="YST Media"
                  width={640}
                  height={427}
                  loading="lazy"
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 400px"
                  className="h-36 sm:h-40 md:h-44 lg:h-52"
                  style={{ aspectRatio: '640/427', width: 'auto' }}
                />
              ) : (
                <div className="h-36 sm:h-40 md:h-44 lg:h-52" style={{ aspectRatio: '640/427', width: 'auto' }} />
              )}
            </Link>
          </div>

          {/* Navigation */}
          <div className="text-center sm:text-left lg:pl-22">
            <h3 className="font-medium text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-background">
              {t("footer.navigation")}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left lg:pl-6">
            <h3 className="font-medium text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-background">
              {t("footer.services")}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 className="font-medium text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-background">
              {t("nav.contact")}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="mailto:contact@ystmedia.com"
                  className="inline-flex items-center gap-2 text-background/70 hover:text-background transition-colors text-sm justify-center sm:justify-start"
                >
                  <Mail className="w-4 h-4" />
                  contact@ystmedia.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+40721469039"
                  className="inline-flex items-center gap-2 text-background/70 hover:text-background transition-colors text-sm justify-center sm:justify-start"
                >
                  <Phone className="w-4 h-4" />
                  +40 721 469 039
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 text-background/70 text-sm justify-center sm:justify-start">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  {t("contact.map.address")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/70 text-xs text-center sm:text-left">
            {new Date().getFullYear()} YST Media. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="text-background/70 hover:text-background transition-colors text-xs underline"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/contact"
              className="text-background/70 hover:text-background transition-colors text-xs underline"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
