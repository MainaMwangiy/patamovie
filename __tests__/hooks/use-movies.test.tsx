import { renderHook, waitFor } from "@testing-library/react";
import { usePopularMovies, useMovieSearch } from "@/hooks/use-movies";
import { tmdbService } from "@/lib/tmdb";
import { jest } from "@jest/globals";

// Mock tmdbService
jest.mock("@/lib/tmdb", () => ({
  tmdbService: {
    getPopularMovies: jest.fn(),
    searchMovies: jest.fn(),
    getMovieDetails: jest.fn(),
    getGenres: jest.fn(),
    getImageURL: jest.fn().mockImplementation((path) => path || "/abstract-movie-poster.png"),
    getBackdropURL: jest.fn().mockImplementation((path) => path || "/movie-backdrop.png"),
    getProfileURL: jest.fn().mockImplementation((path) => path || "/diverse-person-profiles.png"),
    clearCache: jest.fn(),
  },
}));

const mockTmdbService = tmdbService as jest.Mocked<typeof tmdbService>;

describe("usePopularMovies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch popular movies successfully", async () => {
    const mockResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    };
    mockTmdbService.getPopularMovies.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePopularMovies(1));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors", async () => {
    const errorMessage = "API Error";
    mockTmdbService.getPopularMovies.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePopularMovies(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBeNull();
  });

  it("fetches popular movies for different pages", async () => {
    const mockResponse = { page: 2, results: [], total_pages: 10, total_results: 100 };
    mockTmdbService.getPopularMovies.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => usePopularMovies(2));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockTmdbService.getPopularMovies).toHaveBeenCalledWith(2);
    expect(result.current.data).toEqual(mockResponse);
  });
});

describe("useMovieSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should search movies with debouncing", async () => {
    const mockResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    };
    mockTmdbService.searchMovies.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMovieSearch("test query", 1));

    expect(result.current.loading).toBe(false);

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockTmdbService.searchMovies).toHaveBeenCalledWith("test query", 1);
    expect(result.current.data).toEqual(mockResponse);
  });

  it("should not search with empty query", () => {
    const { result } = renderHook(() => useMovieSearch("", 1));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockTmdbService.searchMovies).not.toHaveBeenCalled();
  });

  it("debounces multiple rapid query changes", async () => {
    const mockResponse = { page: 1, results: [], total_pages: 1, total_results: 0 };
    mockTmdbService.searchMovies.mockResolvedValue(mockResponse);
    const { result, rerender } = renderHook(({ query }) => useMovieSearch(query, 1), {
      initialProps: { query: "test" },
    });

    rerender({ query: "test2" });
    rerender({ query: "test3" });

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockTmdbService.searchMovies).toHaveBeenCalledTimes(1);
      expect(mockTmdbService.searchMovies).toHaveBeenCalledWith("test3", 1);
    });
  });
});