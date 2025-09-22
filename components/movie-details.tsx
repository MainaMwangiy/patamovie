"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMovieDetails } from "@/hooks/use-movies"
import { useAuth } from "@/app/auth/auth-provider"
import { tmdbService } from "@/lib/tmdb"
import {
  Calendar,
  Clock,
  Star,
  Globe,
  DollarSign,
  Users,
  AlertCircle,
  ExternalLink,
  Heart,
  Bookmark,
} from "lucide-react"
import { useState } from "react"
import { LazyImage } from "./performance/lazy-image"

interface MovieDetailsProps {
  movieId: number
}

export function MovieDetails({ movieId }: MovieDetailsProps) {
  const { data: movie, loading, error } = useMovieDetails(movieId)
  const { user } = useAuth()
  const [imageError, setImageError] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !movie) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || "Movie not found"}
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">Please check the movie ID and try again.</span>
        </AlertDescription>
      </Alert>
    )
  }

  const backdropUrl = tmdbService.getBackdropURL(movie.backdrop_path, "w1280")
  const posterUrl = tmdbService.getImageURL(movie.poster_path, "w500")
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "Unknown"

  const handleFavorite = () => {
    if (!user) {
      // Show auth modal or redirect to login
      return
    }
    setIsFavorited(!isFavorited)
    // In a real app, this would make an API call to save the favorite
  }

  const handleBookmark = () => {
    if (!user) {
      // Show auth modal or redirect to login
      return
    }
    setIsBookmarked(!isBookmarked)
    // In a real app, this would make an API call to save the bookmark
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop Image */}
        <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
          <LazyImage
            src={backdropUrl || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover"
            fallback="/movie-backdrop.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Movie Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-balance">{movie.title}</h1>
            {movie.tagline && <p className="text-lg md:text-xl text-gray-200 text-pretty">{movie.tagline}</p>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster and Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
              <LazyImage
                src={imageError ? "/abstract-movie-poster.png" : posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleFavorite}
                variant={isFavorited ? "default" : "outline"}
                disabled={!user}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                {isFavorited ? "Favorited" : "Add to Favorites"}
              </Button>
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="lg"
                onClick={handleBookmark}
                disabled={!user}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {!user && (
              <p className="text-sm text-muted-foreground text-center">Sign in to save favorites and bookmarks</p>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <div>
                    <div className="font-semibold">{movie.vote_average.toFixed(1)}/10</div>
                    <div className="text-sm text-muted-foreground">{movie.vote_count.toLocaleString()} votes</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-semibold">{releaseYear}</div>
                    <div className="text-sm text-muted-foreground">Release Year</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-secondary" />
                  <div>
                    <div className="font-semibold">{runtime}</div>
                    <div className="text-sm text-muted-foreground">Runtime</div>
                  </div>
                </div>

                {movie.budget > 0 && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-semibold">${(movie.budget / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-muted-foreground">Budget</div>
                    </div>
                  </div>
                )}

                {movie.homepage && (
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Official Website
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed text-pretty">
                {movie.overview || "No overview available for this movie."}
              </p>
            </CardContent>
          </Card>

          {/* Genres */}
          <Card>
            <CardHeader>
              <CardTitle>Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 12).map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-2">
                        <LazyImage
                          src={tmdbService.getProfileURL(actor.profile_path, "w185") || "/placeholder.svg"}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                          fallback="/diverse-person-profiles.png"
                        />
                      </div>
                      <h4 className="font-medium text-sm text-foreground truncate">{actor.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Production Info */}
          <Card>
            <CardHeader>
              <CardTitle>Production Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {movie.production_companies.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Production Companies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_companies.map((company) => (
                      <Badge key={company.id} variant="outline">
                        {company.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-foreground">Status:</span>
                  <span className="ml-2 text-muted-foreground">{movie.status}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Original Language:</span>
                  <span className="ml-2 text-muted-foreground">{movie.original_language.toUpperCase()}</span>
                </div>
                {movie.revenue > 0 && (
                  <div>
                    <span className="font-semibold text-foreground">Revenue:</span>
                    <span className="ml-2 text-muted-foreground">${(movie.revenue / 1000000).toFixed(1)}M</span>
                  </div>
                )}
                {movie.imdb_id && (
                  <div>
                    <span className="font-semibold text-foreground">IMDB:</span>
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      View on IMDB
                      <ExternalLink className="w-3 h-3 ml-1 inline" />
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
