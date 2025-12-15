"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePopularMovies } from "@/hooks/use-movies"
import { MovieCard } from "@/components/movie-card"
import { MovieCardSkeleton } from "@/components/movie-card-skeleton"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import type { Movie } from "@/lib/tmdb"

export function MovieGrid() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, loading, error } = usePopularMovies(currentPage)
  const router = useRouter()

  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNextPage = () => {
    if (data && currentPage < data.total_pages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load movies: {error}
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">
            Make sure you have added your TMDB API key to the environment variables.
          </span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 20 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : data?.results.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} priority={index < 6} />
            ))}
      </div>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Page</span>
            <span className="font-medium text-foreground">{currentPage}</span>
            <span>of</span>
            <span className="font-medium text-foreground">{data.total_pages}</span>
          </div>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === data.total_pages || loading}
            className="flex items-center gap-2 bg-transparent"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Results Info */}
      {data && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {data.results.length} of {data.total_results.toLocaleString()} movies
        </div>
      )}
    </div>
  )
}
