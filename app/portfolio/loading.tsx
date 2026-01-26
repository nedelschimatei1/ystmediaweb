import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 h-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Skeleton className="h-12 w-32" />
          <div className="hidden md:flex gap-8">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-16 bg-gradient-to-b from-muted to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <Skeleton className="h-8 w-32 rounded-full mb-6" />
            <Skeleton className="h-12 w-full max-w-lg mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-4/5 mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center p-4 bg-card rounded-lg border border-border">
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-1 w-1 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase Skeleton */}
      <section className="py-12 lg:py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-4 w-32 mx-auto mb-3" />
            <Skeleton className="h-10 w-72 mx-auto mb-4" />
            <Skeleton className="h-5 w-full max-w-lg mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-card">
                <Skeleton className="h-6 w-64" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-4 w-28 mx-auto mb-3" />
            <Skeleton className="h-10 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <Skeleton className="h-8 w-8 rounded-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="pt-4 border-t border-border">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
