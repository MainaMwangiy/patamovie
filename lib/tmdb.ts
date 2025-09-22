export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  homepage: string
  imdb_id: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  credits?: {
    cast: CastMember[]
    crew: CrewMember[]
  }
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

class TMDBService {
  private baseURL = "https://api.themoviedb.org/3"
  private imageBaseURL = "https://image.tmdb.org/t/p"
  private apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 5 * 60 * 1000 

  constructor() {
    if (!this.apiKey) {
      console.warn("TMDB API key not found. Please add NEXT_PUBLIC_TMDB_API_KEY to your environment variables.")
    }
  }

  private getCacheKey(endpoint: string, params?: Record<string, string>): string {
    const paramString = params ? new URLSearchParams(params).toString() : ""
    return `${endpoint}?${paramString}`
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout
  }

  private async fetchFromAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params)

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data
    }

    if (!this.apiKey) {
      throw new Error("TMDB API key is required")
    }

    const url = new URL(`${this.baseURL}${endpoint}`)
    url.searchParams.append("api_key", this.apiKey)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    try {
      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      })

      return data
    } catch (error) {
      console.error("TMDB API fetch error:", error)
      throw error
    }
  }

  // Get popular movies
  async getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromAPI<TMDBResponse<Movie>>("/movie/popular", {
      page: page.toString(),
    })
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromAPI<TMDBResponse<Movie>>("/movie/top_rated", {
      page: page.toString(),
    })
  }

  // Get now playing movies
  async getNowPlayingMovies(page = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromAPI<TMDBResponse<Movie>>("/movie/now_playing", {
      page: page.toString(),
    })
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromAPI<TMDBResponse<Movie>>("/movie/upcoming", {
      page: page.toString(),
    })
  }

  // Search movies
  async searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromAPI<TMDBResponse<Movie>>("/search/movie", {
      query: encodeURIComponent(query),
      page: page.toString(),
    })
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromAPI<MovieDetails>(`/movie/${movieId}`, {
      append_to_response: "credits",
    })
  }

  // Get movie genres
  async getGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromAPI<{ genres: Genre[] }>("/genre/movie/list")
  }

  // Helper methods for image URLs
  getImageURL(
    path: string | null,
    size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500",
  ): string {
    if (!path) return "/abstract-movie-poster.png"
    return `${this.imageBaseURL}/${size}${path}`
  }

  getBackdropURL(path: string | null, size: "w300" | "w780" | "w1280" | "original" = "w1280"): string {
    if (!path) return "/movie-backdrop.png"
    return `${this.imageBaseURL}/${size}${path}`
  }

  getProfileURL(path: string | null, size: "w45" | "w185" | "h632" | "original" = "w185"): string {
    if (!path) return "/diverse-person-profiles.png"
    return `${this.imageBaseURL}/${size}${path}`
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const tmdbService = new TMDBService()
