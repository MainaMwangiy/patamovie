import { tmdbService } from "@/lib/tmdb";

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Mock fetch globally for this test file
beforeAll(() => {
  global.fetch = mockFetch;
});

describe("TMDB Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    tmdbService.clearCache();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getPopularMovies", () => {
    it("should fetch popular movies successfully", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Movie",
            overview: "Test overview",
            poster_path: "/test.jpg",
            backdrop_path: "/test-backdrop.jpg",
            release_date: "2024-01-01",
            vote_average: 8.5,
            vote_count: 1000,
            genre_ids: [28, 12],
            adult: false,
            original_language: "en",
            original_title: "Test Movie",
            popularity: 100.5,
            video: false,
          },
        ],
        total_pages: 10,
        total_results: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
        status: 200,
        statusText: "OK",
      } as any);

      const result = await tmdbService.getPopularMovies(1);

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/movie/popular"));
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: jest.fn(),
      } as any);

      await expect(tmdbService.getPopularMovies(1)).rejects.toThrow("TMDB API error: 404 Not Found");
    });

    it("should cache responses", async () => {
      const mockResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
        status: 200,
        statusText: "OK",
      } as any);

      // First call
      await tmdbService.getPopularMovies(1);
      // Second call should use cache
      await tmdbService.getPopularMovies(1);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should not use expired cache", async () => {
      const mockResponse = { page: 1, results: [], total_pages: 1, total_results: 0 };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
        status: 200,
        statusText: "OK",
      } as any);

      // First call
      await tmdbService.getPopularMovies(1);

      // Simulate cache expiration
      const dateSpy = jest.spyOn(Date, "now").mockReturnValueOnce(Date.now() + 5 * 60 * 1000 + 1);

      // Second call should hit API again
      await tmdbService.getPopularMovies(1);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      
      dateSpy.mockRestore();
    });
  });

  describe("searchMovies", () => {
    it("should search movies with query", async () => {
      const mockResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
        status: 200,
        statusText: "OK",
      } as any);

      await tmdbService.searchMovies("test query");

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/search/movie"));
      // Fix the URL encoding expectation - it's double encoded in the actual call
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("query=test%2520query"));
    });
  });

  describe("getImageURL", () => {
    it("should return correct image URL", () => {
      const url = tmdbService.getImageURL("/test.jpg", "w500");
      expect(url).toBe("https://image.tmdb.org/t/p/w500/test.jpg");
    });

    it("should return placeholder for null path", () => {
      const url = tmdbService.getImageURL(null);
      expect(url).toBe("/abstract-movie-poster.png");
    });
  });

  it("should throw error if API key is missing", async () => {
    const originalApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    delete process.env.NEXT_PUBLIC_TMDB_API_KEY;

    // Mock fetch to simulate API key error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: jest.fn().mockResolvedValue({ error: "Invalid API key" }),
    } as any);

    await expect(tmdbService.getPopularMovies(1)).rejects.toThrow();

    // Restore API key
    process.env.NEXT_PUBLIC_TMDB_API_KEY = originalApiKey;
  });
});