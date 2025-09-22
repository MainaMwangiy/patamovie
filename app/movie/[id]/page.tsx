import { Suspense } from "react"
import type { Metadata } from "next"
import { MovieDetails } from "@/components/movie-details"
import { MovieDetailsSkeleton } from "@/components/movie-details-skeleton"
import { BackButton } from "@/components/back-button"
import { Footer } from "@/components/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { tmdbService } from "@/lib/tmdb"

interface MoviePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movieId = Number.parseInt(params.id)

  if (isNaN(movieId)) {
    return {
      title: "Movie Not Found | PataMovie",
      description: "The requested movie could not be found.",
    }
  }

  try {
    const movie = await tmdbService.getMovieDetails(movieId)
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : ""

    return {
      title: `${movie.title} ${releaseYear ? `(${releaseYear})` : ""} | PataMovie`,
      description: movie.overview || `Discover ${movie.title} and explore cast, crew, ratings, and more.`,
      openGraph: {
        title: movie.title,
        description: movie.overview || `Discover ${movie.title} and explore cast, crew, ratings, and more.`,
        images: movie.backdrop_path ? [tmdbService.getBackdropURL(movie.backdrop_path, "w1280")] : [],
      },
    }
  } catch (error) {
    return {
      title: "Movie Details | PataMovie",
      description: "Explore detailed movie information including cast, crew, and ratings.",
    }
  }
}

export default function MoviePage({ params }: MoviePageProps) {
  const movieId = Number.parseInt(params.id)

  if (isNaN(movieId)) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Movie ID</h1>
            <p className="text-muted-foreground mb-6">The movie ID provided is not valid.</p>
            <BackButton />
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <BackButton className="mb-6" />
          <ErrorBoundary>
            <Suspense fallback={<MovieDetailsSkeleton />}>
              <MovieDetails movieId={movieId} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <Footer />
    </>
  )
}
