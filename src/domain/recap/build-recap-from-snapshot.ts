import type { StorySnapshot } from "../story/types";
import type { Recap, RecapConfidence, RecapDetailLevel } from "./schema";

const CHARACTER_LIMIT: Record<RecapDetailLevel, number> = {
  quick: 2,
  standard: 4,
  detailed: Number.POSITIVE_INFINITY,
};

const EVENT_LIMIT: Record<RecapDetailLevel, number> = {
  quick: 1,
  standard: 3,
  detailed: Number.POSITIVE_INFINITY,
};

const THREAD_LIMIT: Record<RecapDetailLevel, number> = {
  quick: 1,
  standard: Number.POSITIVE_INFINITY,
  detailed: Number.POSITIVE_INFINITY,
};

function firstSentence(text: string): string {
  const match = text.match(/^[^.]+\./);
  return match ? match[0] : text;
}

/**
 * Deterministically derives a recap from an already-safe, boundary-cumulative snapshot.
 * Used by the mock recap provider so demo recaps stay in lockstep with the snapshot data
 * instead of duplicating prose by hand for every boundary/detail-level combination.
 * Output still passes through `validateRecap` before being shown - this function does not
 * itself decide what is safe to display.
 */
export function buildRecapFromSnapshot(
  snapshot: StorySnapshot,
  bookTitle: string,
  detailLevel: RecapDetailLevel,
  confidence: RecapConfidence,
): Recap {
  const characters = [...snapshot.characters]
    .sort((a, b) => b.lastSeenSegmentOrdinal - a.lastSeenSegmentOrdinal)
    .slice(0, CHARACTER_LIMIT[detailLevel])
    .map((character) => ({
      name: character.name,
      reminder: character.reminder,
      currentState: character.currentState,
      supportingSegmentIds: character.supportingSegmentIds,
    }));

  const currentSituation = [...snapshot.importantEvents]
    .sort((a, b) => b.segmentOrdinal - a.segmentOrdinal)
    .slice(0, EVENT_LIMIT[detailLevel])
    .map((event) => ({
      text: event.description,
      supportingSegmentIds: event.supportingSegmentIds,
    }));

  const unresolvedThreads = [...snapshot.openThreads]
    .slice(0, THREAD_LIMIT[detailLevel])
    .map((thread) => ({
      text: thread.description,
      supportingSegmentIds: thread.supportingSegmentIds,
    }));

  const summary =
    detailLevel === "quick"
      ? firstSentence(snapshot.cumulativeSummary)
      : snapshot.cumulativeSummary;

  return {
    bookTitle,
    boundaryLabel: snapshot.boundaryLabel,
    detailLevel,
    summary,
    characters,
    currentSituation,
    unresolvedThreads,
    confidence,
    confidenceReason:
      confidence === "high"
        ? `${snapshot.boundaryLabel} is a precisely supported boundary, so this recap's coverage is exact.`
        : `Your progress was mapped approximately to ${snapshot.boundaryLabel}, so an earlier, safely-supported boundary was used.`,
    spoilerWarning: `This recap only uses information through ${snapshot.boundaryLabel}. Nothing from later in the book was used to generate it.`,
  };
}
