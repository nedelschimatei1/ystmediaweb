import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
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
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <Skeleton className="h-8 w-32 mx-auto rounded-full mb-6" />
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-lg mx-auto mb-2" />
          <Skeleton className="h-5 w-3/4 max-w-lg mx-auto" />
        </div>
      </section>

      {/* Schedule Consultation Skeleton */}
      <section className="py-12 lg:py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-4 w-40 mx-auto mb-3" />
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-5 w-full max-w-md mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info Skeleton */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form Skeleton */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 lg:p-8">
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-80 mb-6" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              </div>
              <div className="mb-4">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
              <div className="mb-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
              <div className="mb-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
              <div className="mb-6">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <Skeleton className="h-12 w-full rounded-full" />
            </div>

            {/* Info Skeleton */}
            <div className="lg:col-span-2 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Skeleton */}
      <section className="py-12 lg:py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <Skeleton className="h-4 w-20 mx-auto mb-3" />
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </section>

      {/* FAQ Skeleton */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-4 w-40 mx-auto mb-3" />
            <Skeleton className="h-10 w-56 mx-auto" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-card">
                <Skeleton className="h-5 w-full max-w-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
