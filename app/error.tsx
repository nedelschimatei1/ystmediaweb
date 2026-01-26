"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl font-medium text-foreground mb-3">
          Ceva nu a funcționat
        </h1>
        <h2 className="text-lg text-muted-foreground mb-2">
          Something went wrong
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Ne pare rău, a apărut o eroare neașteptată. Vă rugăm să încercați din nou.
          <br />
          <span className="text-xs opacity-70">
            Sorry, an unexpected error occurred. Please try again.
          </span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground rounded-full font-medium hover:bg-primary/90 dark:hover:bg-accent/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Încearcă din nou
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            Acasă
          </Link>
        </div>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-8 text-xs text-muted-foreground/50">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
