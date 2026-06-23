import type { StoryBoundary } from "../story/types";
import type { MappingConfidence, ProgressType } from "./types";

export interface BoundaryMappingInput {
  type: ProgressType;
  value: number;
  /** Total page count for the edition, when known. Required for page-based mapping. */
  editionPageCount?: number;
  /** Whether the edition has an exact chapter-to-page map. Page mapping is always approximate without one. */
  hasExactPageMap?: boolean;
}

export interface BoundaryMappingResult {
  boundary: StoryBoundary;
  confidence: MappingConfidence;
  explanation: string;
}

/**
 * Maps reader-entered progress to the latest supported boundary that does not exceed
 * that position. Never selects a boundary later than the reader has actually reached -
 * when progress falls between two supported boundaries, the earlier one is chosen.
 */
export function selectSafeBoundary(
  input: BoundaryMappingInput,
  supportedBoundaries: StoryBoundary[],
): BoundaryMappingResult | null {
  if (supportedBoundaries.length === 0) {
    return null;
  }

  const ordered = [...supportedBoundaries].sort(
    (a, b) => a.segmentOrdinal - b.segmentOrdinal,
  );

  switch (input.type) {
    case "chapter": {
      const target = ordered.filter((b) => b.chapterOrdinal <= input.value);
      const boundary = target.at(-1) ?? null;
      if (!boundary) return null;
      const isExactChapterEnd = boundary.chapterOrdinal === input.value;
      return {
        boundary,
        confidence: isExactChapterEnd ? "exact" : "high",
        explanation: isExactChapterEnd
          ? `Chapter ${input.value} ends exactly at a supported boundary.`
          : `Chapter ${input.value} is not itself a supported boundary; the recap will use the latest supported boundary at or before it, the end of Chapter ${boundary.chapterOrdinal}.`,
      };
    }

    case "percentage": {
      const lastOrdinal = ordered.at(-1)!.segmentOrdinal;
      const targetOrdinal = (input.value / 100) * lastOrdinal;
      const eligible = ordered.filter((b) => b.segmentOrdinal <= targetOrdinal);
      const boundary = eligible.at(-1) ?? null;
      if (!boundary) return null;
      return {
        boundary,
        confidence: "medium",
        explanation: `${input.value}% maps approximately to ${boundary.label}. Percentage-based mapping is never exact, so the earlier safe boundary was chosen.`,
      };
    }

    case "page": {
      if (!input.editionPageCount || input.editionPageCount <= 0) {
        return null;
      }
      const lastOrdinal = ordered.at(-1)!.segmentOrdinal;
      const fraction = Math.min(input.value / input.editionPageCount, 1);
      const targetOrdinal = fraction * lastOrdinal;
      const eligible = ordered.filter((b) => b.segmentOrdinal <= targetOrdinal);
      const boundary = eligible.at(-1) ?? null;
      if (!boundary) return null;
      const confidence: MappingConfidence = input.hasExactPageMap
        ? "high"
        : "low";
      return {
        boundary,
        confidence,
        explanation: input.hasExactPageMap
          ? `Page ${input.value} maps to ${boundary.label} using this edition's exact page map.`
          : `Page ${input.value} appears to fall near ${boundary.label}, but this edition has no exact page map, so the mapping is approximate. The earlier safe boundary was chosen.`,
      };
    }

    default:
      return null;
  }
}
