import { Suspense } from "react";
import { SearchView } from "@/components/search/search-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-10 sm:px-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-full" />
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
}
