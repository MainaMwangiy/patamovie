import { Card, CardContent } from "@/components/ui/card"

export function MovieCardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="aspect-[2/3] bg-muted animate-pulse rounded-t-lg" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
          <div className="flex justify-between">
            <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
          </div>
          <div className="h-5 bg-muted rounded animate-pulse w-1/3" />
        </div>
      </CardContent>
    </Card>
  )
}
