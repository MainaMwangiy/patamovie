"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  fallback?: string
  width?: number
  height?: number
  priority?: boolean
}

export function LazyImage({
  src,
  alt,
  className,
  fallback = "/abstract-movie-poster.png",
  width,
  height,
  priority = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden bg-muted", className)} style={{ width, height }}>
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
      {!isLoaded && isInView && <div className="absolute inset-0 bg-muted animate-pulse" />}
    </div>
  )
}
