import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading-spinner"
import "./globals.css"
import ClientProviders from "./client-provider"

export const metadata: Metadata = {
  title: "PataMovie - Discover Amazing Movies",
  description:
    "Find your next favorite film from thousands of movies. Browse popular, top-rated, and search for any movie with detailed cast, crew, and rating information.",
  keywords: ["movies", "films", "cinema", "entertainment", "TMDB", "movie database", "movie search"],
  authors: [{ name: "PataMovie Team" }],
  creator: "PataMovie",
  publisher: "PataMovie",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://patamovie.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://patamovie.vercel.app",
    title: "PataMovie - Discover Amazing Movies",
    description:
      "Find your next favorite film from thousands of movies. Browse popular, top-rated, and search for any movie.",
    siteName: "PataMovie",
  },
  twitter: {
    card: "summary_large_image",
    title: "PataMovie - Discover Amazing Movies",
    description:
      "Find your next favorite film from thousands of movies. Browse popular, top-rated, and search for any movie.",
    creator: "@PataMovie",
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
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`antialiased`}>
        <ErrorBoundary>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <ClientProviders>
              {children}
              </ClientProviders>
            </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
