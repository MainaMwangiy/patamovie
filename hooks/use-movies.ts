"use client"

import { useState, useEffect } from "react"
import { tmdbService, type Movie, type MovieDetails, type TMDBResponse } from "@/lib/tmdb"

export function usePopularMovies(page = 1) {
  const [data, setData] = useState<TMDBResponse<Movie> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true)
        setError(null)
        const response = await tmdbService.getPopularMovies(page)
        setData(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movies")
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [page])

  return { data, loading, error }
}

export function useMovieSearch(query: string, page = 1) {
  const [data, setData] = useState<TMDBResponse<Movie> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setData(null)
      setLoading(false)
      return
    }

    async function searchMovies() {
      try {
        setLoading(true)
        setError(null)
        const response = await tmdbService.searchMovies(query, page)
        setData(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search movies")
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, page])

  return { data, loading, error }
}

export function useMovieDetails(movieId: number | null) {
  const [data, setData] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!movieId) {
      setData(null)
      setLoading(false)
      return
    }

    async function fetchMovieDetails() {
      try {
        setLoading(true)
        setError(null)
        const response = await tmdbService.getMovieDetails(movieId ?? 0)
        setData(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movie details")
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [movieId])

  return { data, loading, error }
}
