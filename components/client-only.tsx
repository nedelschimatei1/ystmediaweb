"use client";

import { useState, useEffect, ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

/**
 * ClientOnly wrapper that shows a fallback (skeleton) until the client has hydrated.
 * Optional delay to prevent flash of loading state on fast connections.
 */
export function ClientOnly({ children, fallback = null, delay = 0 }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsClient(true), delay);
      return () => clearTimeout(timer);
    }
    setIsClient(true);
  }, [delay]);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
