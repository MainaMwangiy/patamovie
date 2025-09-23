import { Suspense } from "react"
import { MovieDetails } from "@/components/movie-details"
import { MovieDetailsSkeleton } from "@/components/movie-details-skeleton"
import { BackButton } from "@/components/back-button"
import { Footer } from "@/components/footer"
import { ErrorBoundary } from "@/components/error-boundary"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const resolvedParams = await params
  const movieId = Number.parseInt(resolvedParams.id)

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
