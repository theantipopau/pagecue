"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GUEST_PROFILE_ID } from "@/domain/library/guest-profile";
import type { LibraryItem } from "@/domain/library/types";
import { formatReadingStatus } from "@/lib/formatting/reading-status";
import { localLibraryRepository } from "@/repositories/library/local-library-repository";

export function ShelfDashboard() {
  const [items, setItems] = useState<LibraryItem[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    localLibraryRepository.listLibraryItems(GUEST_PROFILE_ID).then((result) => {
      if (isMounted) setItems(result);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (items === null) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        My shelf
      </h1>
      <p className="mt-1 text-muted-foreground">
        Your guest shelf is stored on this device only.
      </p>

      {items.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-foreground">Your shelf is empty.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Search isn&apos;t available in this preview yet &mdash; reload this
            page to restore the demonstration book.
          </p>
        </Card>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-foreground">
                    {item.book.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {item.book.authors.join(", ")}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge tone="neutral">
                      {formatReadingStatus(item.status)}
                    </Badge>
                    {item.book.isSyntheticDemo && (
                      <Badge tone="success">Recap available</Badge>
                    )}
                  </div>
                </div>
                <Link
                  href={`/library/${item.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                >
                  Open
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
