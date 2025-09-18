import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading-spinner"
import "./globals.css"

export const metadata: Metadata = {
  title: "MovieFinder - Discover Amazing Movies",
  description:
    "Find your next favorite film from thousands of movies. Browse popular, top-rated, and search for any movie with detailed cast, crew, and rating information.",
  keywords: ["movies", "films", "cinema", "entertainment", "TMDB", "movie database", "movie search"],
  authors: [{ name: "MovieFinder Team" }],
  creator: "MovieFinder",
  publisher: "MovieFinder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-movie-app.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-movie-app.vercel.app",
    title: "MovieFinder - Discover Amazing Movies",
    description:
      "Find your next favorite film from thousands of movies. Browse popular, top-rated, and search for any movie.",
    siteName: "MovieFinder",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieFinder - Discover Amazing Movies",
    description:
      "Find your next favorite film from thousands of movies. Browse popular, top-rated, and search for any movie.",
    creator: "@moviefinder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              {children}
            </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
