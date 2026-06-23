"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { demoBoundaries } from "@/data/demo/boundaries";
import { selectSafeBoundary } from "@/domain/progress/boundary";
import type { ProgressType } from "@/domain/progress/types";
import type { LibraryItem } from "@/domain/library/types";
import { localLibraryRepository } from "@/repositories/library/local-library-repository";

const PROGRESS_TYPE_LABELS: Record<ProgressType, string> = {
  chapter: "Chapter",
  percentage: "Percentage",
  page: "Page",
};

export function ProgressEditor({ libraryItemId }: { libraryItemId: string }) {
  const router = useRouter();
  const [item, setItem] = useState<LibraryItem | null | undefined>(undefined);
  const [progressType, setProgressType] = useState<ProgressType>("chapter");
  const [rawValue, setRawValue] = useState("");
  const [selectedBoundaryOrdinal, setSelectedBoundaryOrdinal] = useState<
    number | null
  >(null);
  const [lastMappingOrdinal, setLastMappingOrdinal] = useState<number | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    localLibraryRepository.getLibraryItem(libraryItemId).then((result) => {
      if (isMounted) setItem(result);
    });
    return () => {
      isMounted = false;
    };
  }, [libraryItemId]);

  const numericValue = Number(rawValue);
  const isValidValue =
    rawValue.trim() !== "" &&
    Number.isFinite(numericValue) &&
    numericValue > 0 &&
    (progressType !== "percentage" || numericValue <= 100);

  const mapping = useMemo(() => {
    if (!item?.book.isSyntheticDemo || !isValidValue) return null;
    return selectSafeBoundary(
      {
        type: progressType,
        value: numericValue,
        editionPageCount: item.edition.pageCount,
        hasExactPageMap: item.edition.hasExactPageMap,
      },
      demoBoundaries,
    );
  }, [item, isValidValue, progressType, numericValue]);

  // Reset the selected boundary whenever the computed mapping changes, while still letting the
  // reader override it afterwards - an in-render adjustment rather than an effect, so a single
  // boundary change doesn't trigger an extra commit/render pass.
  const currentMappingOrdinal = mapping?.boundary.segmentOrdinal ?? null;
  if (currentMappingOrdinal !== lastMappingOrdinal) {
    setLastMappingOrdinal(currentMappingOrdinal);
    setSelectedBoundaryOrdinal(currentMappingOrdinal);
  }

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

  const eligibleBoundaries = mapping
    ? demoBoundaries.filter(
        (b) => b.segmentOrdinal <= mapping.boundary.segmentOrdinal,
      )
    : [];
  const selectedBoundary = eligibleBoundaries.find(
    (b) => b.segmentOrdinal === selectedBoundaryOrdinal,
  );

  async function handleSubmit(formEvent: FormEvent) {
    formEvent.preventDefault();
    if (!item) return;
    setSaving(true);
    try {
      const chosenIsComputed =
        selectedBoundaryOrdinal === mapping?.boundary.segmentOrdinal;
      await localLibraryRepository.updateLibraryItem(item.id, {
        status: item.status === "want_to_read" ? "reading" : item.status,
        progress: {
          type: progressType,
          value: numericValue,
          chapterOrdinal: progressType === "chapter" ? numericValue : undefined,
          percentage: progressType === "percentage" ? numericValue : undefined,
          pageNumber: progressType === "page" ? numericValue : undefined,
          mappedBoundarySegmentOrdinal: selectedBoundary?.segmentOrdinal,
          mappedBoundaryLabel: selectedBoundary?.label,
          mappingConfidence: chosenIsComputed ? mapping?.confidence : "exact",
          mappingExplanation: chosenIsComputed
            ? mapping?.explanation
            : `You chose an earlier boundary than your progress suggested: ${selectedBoundary?.label}.`,
          updatedAt: new Date().toISOString(),
        },
      });
      router.push(`/library/${item.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Update your progress
      </h1>
      <p className="mt-1 text-muted-foreground">{item.book.title}</p>

      {!item.book.isSyntheticDemo && (
        <Card className="mt-6">
          <p className="text-sm text-foreground">
            Recap generation isn&apos;t available for this title yet, so
            progress here is for your own tracking only.
          </p>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">
            How are you tracking progress?
          </legend>
          <div className="flex gap-2">
            {(Object.keys(PROGRESS_TYPE_LABELS) as ProgressType[]).map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProgressType(type)}
                  aria-pressed={progressType === type}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    progressType === type
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-foreground hover:bg-muted"
                  }`}
                >
                  {PROGRESS_TYPE_LABELS[type]}
                </button>
              ),
            )}
          </div>
        </fieldset>

        <Field
          id="progress-value"
          label={
            progressType === "chapter"
              ? "Chapter number"
              : progressType === "percentage"
                ? "Percentage complete"
                : "Page number"
          }
          hint={
            progressType === "page"
              ? "This edition has no exact page map, so page-based mapping will be approximate."
              : undefined
          }
        >
          <input
            id="progress-value"
            type="number"
            inputMode="numeric"
            min={1}
            max={progressType === "percentage" ? 100 : undefined}
            value={rawValue}
            onChange={(event) => setRawValue(event.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus-visible:outline-none"
            aria-describedby={
              progressType === "page" ? "progress-value-hint" : undefined
            }
          />
        </Field>

        {item.book.isSyntheticDemo &&
          rawValue.trim() !== "" &&
          !isValidValue && (
            <p role="alert" className="text-sm text-danger">
              Enter a positive number
              {progressType === "percentage" ? " from 1 to 100" : ""}.
            </p>
          )}

        {item.book.isSyntheticDemo && mapping && (
          <Card aria-live="polite">
            <div className="flex items-center gap-2">
              <Badge
                tone={
                  mapping.confidence === "exact" ||
                  mapping.confidence === "high"
                    ? "success"
                    : "warning"
                }
              >
                {mapping.confidence === "exact"
                  ? "Exact match"
                  : mapping.confidence === "high"
                    ? "High confidence"
                    : mapping.confidence === "medium"
                      ? "Approximate"
                      : "Low confidence"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-foreground">
              {mapping.explanation}
            </p>

            <Field
              id="boundary-choice"
              label="Recap will use this safe boundary"
              hint="You can choose an earlier boundary, but never a later one."
            >
              <select
                id="boundary-choice"
                value={selectedBoundaryOrdinal ?? ""}
                onChange={(event) =>
                  setSelectedBoundaryOrdinal(Number(event.target.value))
                }
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus-visible:outline-none"
              >
                {eligibleBoundaries.map((boundary) => (
                  <option
                    key={boundary.segmentOrdinal}
                    value={boundary.segmentOrdinal}
                  >
                    {boundary.label}
                  </option>
                ))}
              </select>
            </Field>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={
              !isValidValue ||
              saving ||
              (item.book.isSyntheticDemo && !selectedBoundary)
            }
          >
            {saving ? "Saving…" : "Save progress"}
          </Button>
          <LinkButton href={`/library/${item.id}`} variant="secondary">
            Cancel
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
