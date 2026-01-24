"use client";

import dynamic from 'next/dynamic';

// Lazy load newsletter popup since it shows after 15 seconds
const NewsletterPopup = dynamic(
  () => import('@/components/newsletter-popup').then(mod => ({ default: mod.NewsletterPopup })),
  { ssr: false }
);

export function NewsletterWrapper() {
  return <NewsletterPopup />;
}
