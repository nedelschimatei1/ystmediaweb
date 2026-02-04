import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="text-[150px] sm:text-[200px] font-serif font-bold text-muted/20 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-primary/40" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-3">
          Pagină Negăsită
        </h1>
        <h2 className="text-lg text-muted-foreground mb-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-md mx-auto">
          Ne pare rău, pagina pe care o căutați nu există sau a fost mutată.
          <br />
          <span className="text-xs opacity-70">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground rounded-full font-medium hover:bg-primary/90 dark:hover:bg-accent/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Acasă / Home
          </Link>
          <Link
            href="/contact"
            prefetch={false}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Contact
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Pagini populare / Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/"
              className="px-4 py-2 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              Acasă
            </Link>
            <Link
              href="/portfolio"
              prefetch={false}
              className="px-4 py-2 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              Portofoliu
            </Link>
            <Link
              href="/contact"
              prefetch={false}
              className="px-4 py-2 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
