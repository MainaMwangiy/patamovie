import Link from "next/link"
import { Film, Github, ExternalLink } from "lucide-react"
import dayjs from 'dayjs';

export function Footer() {
  const copyRightYear = dayjs().year();
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-foreground">PataMovie</span>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              Discover amazing movies from thousands of titles. Built with Next.js and powered by TMDB.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Browse Popular Movies</li>
              <li>Advanced Search</li>
              <li>Detailed Movie Info</li>
              <li>User Authentication</li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Project</h3>
            <div className="space-y-2">
              <Link
                href="https://github.com/mainamwangiy/patamovie"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                View Source Code
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href="https://www.themoviedb.org/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                TMDB API
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {`© ${copyRightYear} PataMovie.`}
          </p>
          <p className="text-xs text-muted-foreground">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  )
}
