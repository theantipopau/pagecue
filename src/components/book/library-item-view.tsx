"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryItem } from "@/domain/library/types";
import { formatReadingStatus } from "@/lib/formatting/reading-status";
import { localLibraryRepository } from "@/repositories/library/local-library-repository";

export function LibraryItemView({ libraryItemId }: { libraryItemId: string }) {
  const [item, setItem] = useState<LibraryItem | null | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    localLibraryRepository.getLibraryItem(libraryItemId).then((result) => {
      if (isMounted) setItem(result);
    });
    return () => {
      isMounted = false;
    };
  }, [libraryItemId]);

  if (item === undefined) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (item === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Card>
          <p className="text-foreground">This shelf item could not be found.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been removed, or your guest data was reset.
          </p>
          <LinkButton href="/app" variant="secondary" className="mt-4">
            Back to my shelf
          </LinkButton>
        </Card>
      </div>
    );
  }

  const recapSupported = item.book.isSyntheticDemo;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/app"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to my shelf
      </Link>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row">
        <div
          aria-hidden="true"
          className="flex h-48 w-32 flex-shrink-0 items-center justify-center rounded-md border border-border bg-muted font-serif text-3xl text-muted-foreground shadow-sm"
        >
          {item.book.title.charAt(0)}
        </div>

        <div className="flex-1">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            {item.book.title}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {item.book.authors.join(", ")}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{formatReadingStatus(item.status)}</Badge>
            {recapSupported ? (
              <Badge tone="success">Recap available</Badge>
            ) : (
              <Badge tone="warning">Recap unavailable for this title</Badge>
            )}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            {item.edition.publisher && (
              <div>
                <dt className="font-medium text-foreground">Publisher</dt>
                <dd>{item.edition.publisher}</dd>
              </div>
            )}
            {item.edition.pageCount && (
              <div>
                <dt className="font-medium text-foreground">Pages</dt>
                <dd>{item.edition.pageCount}</dd>
              </div>
            )}
            {item.edition.language && (
              <div>
                <dt className="font-medium text-foreground">Language</dt>
                <dd>{item.edition.language.toUpperCase()}</dd>
              </div>
            )}
          </dl>

          {item.book.description && (
            <div className="mt-4">
              <p className="text-sm text-foreground">{item.book.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                This description is catalogue metadata only and is never used as
                a source for recap generation.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton
              href={`/library/${item.id}/progress`}
              variant="secondary"
            >
              {item.progress ? "Update progress" : "Set your progress"}
            </LinkButton>
            {recapSupported && item.progress?.mappedBoundaryLabel && (
              <LinkButton href={`/library/${item.id}/recap`}>
                Resume with a recap
              </LinkButton>
            )}
          </div>

          {item.progress?.mappedBoundaryLabel && (
            <p className="mt-3 text-sm text-muted-foreground">
              Current safe boundary: {item.progress.mappedBoundaryLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
