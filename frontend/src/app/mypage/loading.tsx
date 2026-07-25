import { Skeleton } from "@/components/ui/skeleton";

export default function MyPageLoading() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6" aria-busy="true" aria-label="よみこみちゅう">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
