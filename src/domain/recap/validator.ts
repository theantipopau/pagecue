import type { SegmentId, StorySnapshot } from "../story/types";
import { RecapSchema, type Recap, type ValidatedRecap } from "./schema";

export interface SegmentReference {
  id: SegmentId;
  sourceDocumentId: string;
  segmentOrdinal: number;
}

export interface RecapValidationContext {
  sourceDocumentId: string;
  boundarySegmentOrdinal: number;
  boundaryLabel: string;
  knownSegments: SegmentReference[];
  /**
   * Segment IDs that are legitimate evidence a thread was actually resolved at or before
   * the boundary (derived from the snapshot's own `resolvedThreads`). Used to catch a recap
   * that claims something is resolved while citing a segment that doesn't actually support that.
   */
  resolvedThreadEvidenceSegmentIds: SegmentId[];
}

export function buildValidationContext(
  snapshot: StorySnapshot,
  knownSegments: SegmentReference[],
): RecapValidationContext {
  return {
    sourceDocumentId: snapshot.sourceDocumentId,
    boundarySegmentOrdinal: snapshot.boundarySegmentOrdinal,
    boundaryLabel: snapshot.boundaryLabel,
    knownSegments,
    resolvedThreadEvidenceSegmentIds: snapshot.resolvedThreads.flatMap(
      (thread) => thread.supportingSegmentIds,
    ),
  };
}

export type RecapValidationFailureReason =
  | "SCHEMA_INVALID"
  | "UNKNOWN_SEGMENT"
  | "FUTURE_SEGMENT_REFERENCE"
  | "BOOK_MISMATCH"
  | "BOUNDARY_MISMATCH"
  | "UNSUPPORTED_CLAIM"
  | "UNSAFE_CONTENT";

export type RecapValidationResult =
  | { valid: true; recap: ValidatedRecap }
  | {
      valid: false;
      reason: RecapValidationFailureReason;
      safeMessage: string;
    };

const UNSAFE_MARKUP_PATTERN = /<\s*\/?\s*[a-z!][^>]*>/i;

/** Best-effort detection of forward-looking phrasing a grounded recap should never need. */
const FUTURE_ORIENTED_PHRASES = [
  "later turns out",
  "later revealed",
  "would later",
  "will later",
  "eventually reveals",
  "eventually turns out",
  "foreshadow",
  "secretly is",
  "is actually the",
  "unbeknownst to",
];

const PREMATURE_RESOLUTION_PHRASES = [
  "is now resolved",
  "has been resolved",
  "mystery is solved",
  "finally solved",
  "now know who",
  "no longer a mystery",
  "case is closed",
  "fully resolved",
];

function reject(
  reason: RecapValidationFailureReason,
  safeMessage: string,
): RecapValidationResult {
  return { valid: false, reason, safeMessage };
}

function collectTextFields(recap: Recap): string[] {
  return [
    recap.summary,
    recap.confidenceReason,
    recap.spoilerWarning,
    ...recap.characters.flatMap((c) => [c.reminder, c.currentState]),
    ...recap.currentSituation.map((s) => s.text),
    ...recap.unresolvedThreads.map((t) => t.text),
  ];
}

function collectClaims(
  recap: Recap,
): Array<{ text: string; supportingSegmentIds: SegmentId[] }> {
  return [
    ...recap.characters.map((c) => ({
      text: `${c.reminder} ${c.currentState}`,
      supportingSegmentIds: c.supportingSegmentIds,
    })),
    ...recap.currentSituation,
    ...recap.unresolvedThreads,
  ];
}

/**
 * Deterministically validates a recap before it may ever be shown to a user. Structured,
 * schema-valid model output is never treated as inherently safe - every claim's supporting
 * segments are independently re-checked against the confirmed boundary.
 */
export function validateRecap(
  rawRecap: unknown,
  context: RecapValidationContext,
): RecapValidationResult {
  const parsed = RecapSchema.safeParse(rawRecap);
  if (!parsed.success) {
    return reject(
      "SCHEMA_INVALID",
      "The recap could not be generated in a valid format. Please try again.",
    );
  }
  const recap = parsed.data;

  if (recap.boundaryLabel !== context.boundaryLabel) {
    return reject(
      "BOUNDARY_MISMATCH",
      "The recap did not match your confirmed spoiler boundary, so it was not shown.",
    );
  }

  const allText = collectTextFields(recap);
  if (allText.some((text) => UNSAFE_MARKUP_PATTERN.test(text))) {
    return reject(
      "UNSAFE_CONTENT",
      "The recap contained unsupported formatting and was not shown.",
    );
  }
  if (
    allText.some((text) =>
      FUTURE_ORIENTED_PHRASES.some((phrase) =>
        text.toLowerCase().includes(phrase),
      ),
    )
  ) {
    return reject(
      "UNSAFE_CONTENT",
      "The recap appeared to reference information beyond your spoiler boundary and was not shown.",
    );
  }

  const knownSegmentById = new Map(
    context.knownSegments.map((segment) => [segment.id, segment]),
  );

  for (const claim of collectClaims(recap)) {
    for (const segmentId of claim.supportingSegmentIds) {
      const segment = knownSegmentById.get(segmentId);
      if (!segment) {
        return reject(
          "UNKNOWN_SEGMENT",
          "The recap referenced content that could not be verified and was not shown.",
        );
      }
      if (segment.sourceDocumentId !== context.sourceDocumentId) {
        return reject(
          "BOOK_MISMATCH",
          "The recap referenced content from a different book and was not shown.",
        );
      }
      if (segment.segmentOrdinal > context.boundarySegmentOrdinal) {
        return reject(
          "FUTURE_SEGMENT_REFERENCE",
          "The recap referenced content beyond your spoiler boundary and was not shown.",
        );
      }
    }
  }

  const resolvedEvidence = new Set(context.resolvedThreadEvidenceSegmentIds);
  for (const situation of recap.currentSituation) {
    const claimsResolution = PREMATURE_RESOLUTION_PHRASES.some((phrase) =>
      situation.text.toLowerCase().includes(phrase),
    );
    if (!claimsResolution) continue;
    const hasRealEvidence = situation.supportingSegmentIds.some((id) =>
      resolvedEvidence.has(id),
    );
    if (!hasRealEvidence) {
      return reject(
        "UNSUPPORTED_CLAIM",
        "The recap claimed something was resolved without supporting evidence at your boundary, and was not shown.",
      );
    }
  }

  return { valid: true, recap: recap as ValidatedRecap };
}
