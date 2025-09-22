import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading-spinner"
import "./globals.css"
import ClientProviders from "./ClientProviders"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
