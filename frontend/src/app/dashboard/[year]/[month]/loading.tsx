import { Skeleton } from "@/components/ui/skeleton";

export default function MonthDetailLoading() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto" aria-busy="true" aria-label="よみこみちゅう">
      <div className="flex flex-col gap-3 mb-8 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <Skeleton className="h-24 w-full mb-8 rounded-2xl" />
      <Skeleton className="h-28 w-full mb-8 rounded-xl" />
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    </div>
  );
}
