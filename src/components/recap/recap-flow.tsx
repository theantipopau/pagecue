"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button, LinkButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryItem } from "@/domain/library/types";
import type { Recap, RecapDetailLevel } from "@/domain/recap/schema";
import { localLibraryRepository } from "@/repositories/library/local-library-repository";
import { RecapResult } from "./recap-result";

const DETAIL_LEVEL_OPTIONS: Array<{
  value: RecapDetailLevel;
  label: string;
  description: string;
}> = [
  {
    value: "quick",
    label: "Quick",
    description: "Key reminders in about 10 seconds.",
  },
  {
    value: "standard",
    label: "Standard",
    description: "A concise story, character, and open-thread refresher.",
  },
  {
    value: "detailed",
    label: "Detailed",
    description: "A fuller refresher without going beyond your boundary.",
  },
];

type RecapApiResponse =
  | { status: "ok"; recap: Recap }
  | {
      status: "unsupported_book" | "boundary_unavailable" | "provider_error";
      message: string;
    }
  | { status: "validation_failed"; reason: string; message: string }
  | { status: "invalid_request" | "rate_limited"; message: string };

export function RecapFlow({ libraryItemId }: { libraryItemId: string }) {
  const [item, setItem] = useState<LibraryItem | null | undefined>(undefined);
  const [detailLevel, setDetailLevel] = useState<RecapDetailLevel>("standard");
  const [phase, setPhase] = useState<
    "setup" | "generating" | "result" | "error"
  >("setup");
  const [recap, setRecap] = useState<Recap | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (item === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Card>
          <p className="text-foreground">This shelf item could not be found.</p>
          <LinkButton href="/app" variant="secondary" className="mt-4">
            Back to my shelf
          </LinkButton>
        </Card>
      </div>
    );
  }

  if (!item.book.isSyntheticDemo) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Card>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Recap unavailable for this title
          </h1>
          <p className="mt-2 text-muted-foreground">
            PageCue only generates recaps for books with an approved, structured
            story source. This title doesn&apos;t have one yet, so no recap can
            be produced for it.
          </p>
          <LinkButton
            href={`/library/${item.id}`}
            variant="secondary"
            className="mt-4"
          >
            Back to book
          </LinkButton>
        </Card>
      </div>
    );
  }

  if (
    !item.progress?.mappedBoundarySegmentOrdinal ||
    !item.progress.mappedBoundaryLabel
  ) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Card>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Set your progress first
          </h1>
          <p className="mt-2 text-muted-foreground">
            PageCue needs to know where you stopped before it can choose a safe
            spoiler boundary.
          </p>
          <LinkButton href={`/library/${item.id}/progress`} className="mt-4">
            Set your progress
          </LinkButton>
        </Card>
      </div>
    );
  }

  const boundaryLabel = item.progress.mappedBoundaryLabel;
  const boundaryOrdinal = item.progress.mappedBoundarySegmentOrdinal;
  const confidence = item.progress.mappingConfidence ?? "medium";

  async function handleGenerate() {
    setPhase("generating");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: item!.book.id,
          bookTitle: item!.book.title,
          boundarySegmentOrdinal: boundaryOrdinal,
          detailLevel,
        }),
      });
      const data: RecapApiResponse = await response.json();
      if (data.status === "ok") {
        setRecap(data.recap);
        setPhase("result");
      } else {
        setErrorMessage(data.message);
        setPhase("error");
      }
    } catch {
      setErrorMessage("We couldn't reach the recap service. Please try again.");
      setPhase("error");
    }
  }

  if (phase === "result" && recap) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <RecapResult
          recap={recap}
          libraryItemId={item.id}
          onChangeDetailLevel={() => setPhase("setup")}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Resume with a recap
      </h1>
      <p className="mt-1 text-muted-foreground">{item.book.title}</p>

      <Card className="mt-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Your progress</dt>
            <dd className="text-foreground">{boundaryLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Confidence</dt>
            <dd className="text-foreground">{confidence}</dd>
          </div>
        </dl>
      </Card>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-medium text-foreground">
          Recap length
        </legend>
        {DETAIL_LEVEL_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`block cursor-pointer rounded-md border p-3 transition-colors ${
              detailLevel === option.value
                ? "border-primary bg-primary/5"
                : "border-border bg-surface hover:bg-muted"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="detail-level"
                value={option.value}
                checked={detailLevel === option.value}
                onChange={() => setDetailLevel(option.value)}
              />
              <span className="font-medium text-foreground">
                {option.label}
              </span>
            </span>
            <span className="mt-1 block pl-6 text-sm text-muted-foreground">
              {option.description}
            </span>
          </label>
        ))}
      </fieldset>

      {phase === "error" && errorMessage && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        This recap only uses information through {boundaryLabel}. It uses a
        deterministic demonstration provider in this preview, not a live AI
        model, and every recap is validated before it can be shown to you.
      </p>

      <div className="mt-4 flex gap-3">
        <Button onClick={handleGenerate} disabled={phase === "generating"}>
          {phase === "generating" ? "Generating…" : "Generate recap"}
        </Button>
        <LinkButton href={`/library/${item.id}`} variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </div>
  );
}
