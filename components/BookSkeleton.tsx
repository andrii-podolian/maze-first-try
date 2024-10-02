'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BookSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </CardFooter>
    </Card>
  )
}

export function BookListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-40 mb-4" /> {/* Add New Book button skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <BookSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}