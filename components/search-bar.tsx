"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMovieSearch } from "@/hooks/use-movies"
import { LazyImage } from "./performance/lazy-image"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { data, loading, error } = useMovieSearch(query)
  const router = useRouter()

  const handleClear = () => {
    setQuery("")
    setIsOpen(false)
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setIsOpen(value.length > 0)
  }

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10 pr-10 h-12 text-base bg-card border-border focus:ring-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4">
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-24 bg-muted rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-destructive">
              <p>Error searching movies: {error}</p>
            </div>
          )}

          {data && data.results.length === 0 && !loading && (
            <div className="p-4 text-center text-muted-foreground">
              <p>No movies found for "{query}"</p>
            </div>
          )}

          {data && data.results.length > 0 && (
            <div className="p-4">
              <div className="space-y-3">
                {data.results.slice(0, 5).map((movie) => (
                  <div
                    key={movie.id}
                    className="flex gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <LazyImage
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-12 h-18 object-cover rounded"
                      fallback="/abstract-movie-poster.png"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{movie.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">★</span>
                          <span className="text-xs text-muted-foreground">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {data.results.length > 5 && (
                <div className="mt-3 pt-3 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">Showing 5 of {data.total_results} results</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
