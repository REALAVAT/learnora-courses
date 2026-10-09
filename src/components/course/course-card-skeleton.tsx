import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <Skeleton className="aspect-16/10 rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-3 h-5 w-16" />
      </div>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
      <div className="hidden flex-col gap-4 lg:flex">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
