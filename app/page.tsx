import { Suspense } from "react"
import { MovieGrid } from "@/components/movie-grid"
import { SearchBar } from "@/components/search-bar"
import { MovieGridSkeleton } from "@/components/movie-grid-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
              Discover Amazing Movies
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Find your next favorite film from thousands of movies. Browse popular titles, search by name, and explore
              detailed information about cast, crew, and ratings.
            </p>
            <ErrorBoundary>
              <SearchBar />
            </ErrorBoundary>
          </header>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Popular Movies</h2>
              <div className="text-sm text-muted-foreground">Updated daily from TMDB</div>
            </div>
            <ErrorBoundary>
              <Suspense fallback={<MovieGridSkeleton />}>
                <MovieGrid />
              </Suspense>
            </ErrorBoundary>
          </section>
        </div>
      </main>
    </>
  )
}
