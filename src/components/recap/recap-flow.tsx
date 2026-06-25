"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryItem } from "@/domain/library/types";
import type { RecapHistoryEntry } from "@/domain/recap/history";
import type { Recap, RecapDetailLevel } from "@/domain/recap/schema";
import { localLibraryRepository } from "@/repositories/library/local-library-repository";
import { localRecapHistoryRepository } from "@/repositories/recap-history/local-recap-history-repository";
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

const DETAIL_LEVEL_LABELS: Record<RecapDetailLevel, string> = {
  quick: "Quick",
  standard: "Standard",
  detailed: "Detailed",
};

type RecapApiResponse =
  | { status: "ok"; recap: Recap }
  | {
      status: "unsupported_book" | "boundary_unavailable" | "provider_error";
      message: string;
    }
  | { status: "validation_failed"; reason: string; message: string }
  | { status: "invalid_request" | "rate_limited"; message: string };

function formatHistoryDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function RecapFlow({ libraryItemId }: { libraryItemId: string }) {
  const [item, setItem] = useState<LibraryItem | null | undefined>(undefined);
  const [detailLevel, setDetailLevel] = useState<RecapDetailLevel>("standard");
  const [phase, setPhase] = useState<
    "setup" | "generating" | "result" | "error"
  >("setup");
  const [recap, setRecap] = useState<Recap | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<RecapHistoryEntry[]>([]);

  useEffect(() => {
    let isMounted = true;
    localLibraryRepository.getLibraryItem(libraryItemId).then((result) => {
      if (isMounted) setItem(result);
    });
    localRecapHistoryRepository.listHistory(libraryItemId).then((entries) => {
      if (isMounted) setHistory(entries);
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
        const entry = await localRecapHistoryRepository.addHistoryEntry(
          item!.id,
          data.recap,
        );
        setHistory((prev) => [entry, ...prev]);
      } else {
        setErrorMessage(data.message);
        setPhase("error");
      }
    } catch {
      setErrorMessage("We couldn't reach the recap service. Please try again.");
      setPhase("error");
    }
  }

  function handleViewHistoryEntry(entry: RecapHistoryEntry) {
    setRecap(entry.recap);
    setPhase("result");
  }

  async function handleClearHistory() {
    await localRecapHistoryRepository.clearHistory(item!.id);
    setHistory([]);
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
        This recap only uses information through {boundaryLabel}, and every
        recap is validated before it can be shown to you, regardless of how it
        was generated.
      </p>

      <div className="mt-4 flex gap-3">
        <Button onClick={handleGenerate} disabled={phase === "generating"}>
          {phase === "generating" ? "Generating…" : "Generate recap"}
        </Button>
        <LinkButton href={`/library/${item.id}`} variant="secondary">
          Cancel
        </LinkButton>
      </div>

      {history.length > 0 && (
        <section
          className="mt-10 border-t border-border pt-6"
          aria-labelledby="history-heading"
        >
          <div className="flex items-center justify-between">
            <h2
              id="history-heading"
              className="font-serif text-xl font-semibold text-foreground"
            >
              Previously generated
            </h2>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Clear history
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {history.map((entry) => (
              <li key={entry.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge tone="neutral">
                      {DETAIL_LEVEL_LABELS[entry.recap.detailLevel]}
                    </Badge>
                    <span className="text-foreground">
                      {entry.recap.boundaryLabel}
                    </span>
                    <span className="text-muted-foreground">
                      {formatHistoryDate(entry.createdAt)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewHistoryEntry(entry)}
                    className="text-sm font-medium text-primary underline hover:opacity-80"
                  >
                    View
                  </button>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
