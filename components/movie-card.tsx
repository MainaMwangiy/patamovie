"use client"
import { Star, Calendar, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LazyImage } from "@/components/performance/lazy-image"
import { tmdbService, type Movie } from "@/lib/tmdb"
import { cn, formatRating } from "@/lib/utils"

interface MovieCardProps {
  movie: Movie
  onClick?: (movie: Movie) => void
  className?: string
  priority?: boolean
}

export function MovieCard({ movie, onClick, className, priority = false }: MovieCardProps) {
  const handleClick = () => {
    onClick?.(movie)
  }

  const posterUrl = tmdbService.getImageURL(movie.poster_path, "w342")
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card border-border",
        className,
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          <LazyImage
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="w-full h-full transition-transform duration-300 group-hover:scale-110"
            fallback="/abstract-movie-poster.png"
            priority={priority}
            width={342}
            height={513}
          />

          {/* Rating Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-none">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {formatRating(movie.vote_average)}
            </Badge>
          </div>

          {/* Popularity Indicator */}
          {movie.popularity > 100 && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                <TrendingUp className="w-3 h-3 mr-1" />
                Hot
              </Badge>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <p className="text-sm line-clamp-3">{movie.overview || "No description available."}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{releaseYear}</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs">{movie.vote_count} votes</span>
            </div>
          </div>

          {/* Language Badge */}
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {movie.original_language.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
