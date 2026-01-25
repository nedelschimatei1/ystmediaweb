import { Skeleton, SkeletonCard, SkeletonServiceCard, SkeletonStat } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <Skeleton className="h-10 w-48 mx-auto rounded-full mb-6" />
        
        {/* Title */}
        <Skeleton className="h-12 w-full max-w-xl mx-auto mb-3" />
        <Skeleton className="h-12 w-4/5 mx-auto mb-6" />
        
        {/* Subtitle */}
        <Skeleton className="h-5 w-full max-w-md mx-auto mb-2" />
        <Skeleton className="h-5 w-3/4 max-w-md mx-auto mb-8" />
        
        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export function AboutSkeleton() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-10 w-full max-w-md mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/5 mb-6" />
            
            {/* Pillars */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            
            <Skeleton className="h-4 w-32" />
          </div>
          
          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonStat key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSkeleton() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-10 w-full max-w-lg mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonServiceCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeamSkeleton() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Skeleton className="h-4 w-24 mx-auto mb-3" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-4 w-full max-w-md mx-auto" />
        </div>
        
        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASkeleton() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Skeleton className="h-4 w-32 mx-auto mb-4" />
        <Skeleton className="h-12 w-full max-w-xl mx-auto mb-4" />
        <Skeleton className="h-5 w-full max-w-md mx-auto mb-2" />
        <Skeleton className="h-5 w-3/4 max-w-md mx-auto mb-8" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-44 rounded-full" />
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>
    </section>
  );
}
