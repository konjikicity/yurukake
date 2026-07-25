import { Skeleton } from "@/components/ui/skeleton";
import MonthCardSkeleton from "@/components/MonthCardSkeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto" aria-busy="true" aria-label="よみこみちゅう">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-10 w-28" />
      </div>
      <Skeleton className="h-36 w-full mb-8 rounded-xl" />
      <Skeleton className="h-28 w-full mb-8 rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MonthCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
