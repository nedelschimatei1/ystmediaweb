import { HeroSkeleton, AboutSkeleton, ServicesSkeleton, TeamSkeleton, CTASkeleton } from "@/components/skeletons";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 h-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="h-12 w-32 bg-muted animate-pulse rounded" />
          <div className="hidden md:flex gap-8">
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
            <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
          </div>
        </div>
      </div>

      <HeroSkeleton />
      <AboutSkeleton />
      <ServicesSkeleton />
      <TeamSkeleton />
      <CTASkeleton />
    </div>
  );
}
