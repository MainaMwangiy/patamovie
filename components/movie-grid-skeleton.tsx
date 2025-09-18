import { MovieCardSkeleton } from "@/components/movie-card-skeleton"

export function MovieGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-8">
        <div className="h-10 w-20 bg-muted rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="h-10 w-20 bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}
