import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function MovieDetailsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <div className="h-64 md:h-96 bg-muted animate-pulse rounded-lg" />

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster and Actions Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <div className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-muted animate-pulse rounded" />
            <div className="w-12 h-12 bg-muted animate-pulse rounded" />
          </div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                  <div className="space-y-1 flex-1">
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Details Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              </div>
            </CardContent>
          </Card>

          {/* Genres Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cast Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="aspect-[2/3] bg-muted animate-pulse rounded-lg mb-2" />
                    <div className="h-4 bg-muted animate-pulse rounded mb-1" />
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
