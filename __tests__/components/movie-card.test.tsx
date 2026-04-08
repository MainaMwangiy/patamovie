import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { MovieCard } from "@/components/movie-card";
import type { Movie } from "@/lib/tmdb";
import { jest } from "@jest/globals";
import Image from "next/image";

// Mock LazyImage - using proper typing instead of any
interface MockLazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

jest.mock("@/components/performance/lazy-image", () => ({
  LazyImage: ({ src, alt, className }: MockLazyImageProps) => (
    <Image src={src} alt={alt} className={className} width={300} height={450} />
  ),
}));

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  overview: "This is a test movie overview",
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
};

describe("MovieCard", () => {
  it("renders movie information correctly", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("1000 votes")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    const mockOnClick = jest.fn();
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    fireEvent.click(screen.getByText("Test Movie"));
    expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
  });

  it("shows popularity badge for popular movies", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Hot")).toBeInTheDocument();
  });

  it("does not show popularity badge for non-popular movies", () => {
    const lessPopularMovie = { ...mockMovie, popularity: 50 };
    render(<MovieCard movie={lessPopularMovie} />);
    expect(screen.queryByText("Hot")).not.toBeInTheDocument();
  });

  it("handles missing release date", () => {
    const movieWithoutDate = { ...mockMovie, release_date: "" };
    render(<MovieCard movie={movieWithoutDate} />);
    expect(screen.getByText("TBA")).toBeInTheDocument();
  });

  it("shows overview on hover", () => {
    render(<MovieCard movie={mockMovie} />);
    const card = screen.getByRole("button", { name: `View details for ${mockMovie.title}` });
    fireEvent.mouseOver(card);
    expect(screen.getByText(mockMovie.overview)).toBeInTheDocument();
  });

  it("handles missing overview", () => {
    const movieWithoutOverview = { ...mockMovie, overview: "" };
    render(<MovieCard movie={movieWithoutOverview} />);
    const card = screen.getByRole("button", { name: `View details for ${mockMovie.title}` });
    fireEvent.mouseOver(card);
    expect(screen.getByText("No description available.")).toBeInTheDocument();
  });

  it("is focusable and keyboard accessible", () => {
    const mockOnClick = jest.fn();
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    const card = screen.getByRole("button", { name: `View details for ${mockMovie.title}` });
    card.focus();
    expect(card).toHaveFocus();
    fireEvent.keyDown(card, { key: "Enter" });
    expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
  });

  it("matches snapshot", () => {
    const { container } = render(<MovieCard movie={mockMovie} />);
    expect(container).toMatchSnapshot();
  });
});
