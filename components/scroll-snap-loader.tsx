"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import scroll-snap pieces on the client only
export const ScrollSnapContainer = dynamic(
  () => import("@/components/scroll-snap-container").then((mod) => ({ default: mod.ScrollSnapContainer })),
  { ssr: false }
);
export const ScrollSnapSection = dynamic(
  () => import("@/components/scroll-snap-container").then((mod) => ({ default: mod.ScrollSnapSection })),
  { ssr: false }
);
export const ScrollSnapDots = dynamic(
  () => import("@/components/scroll-snap-container").then((mod) => ({ default: mod.ScrollSnapDots })),
  { ssr: false }
);

interface Props {
  children: React.ReactNode;
}

export default function ScrollSnapLoader({ children }: Props) {
  return <ScrollSnapContainer>{children}</ScrollSnapContainer>;
}
