import type { StorySourceRepository } from "../story/repository";
import { RecapProviderError } from "./errors";
import type { RecapProvider } from "./provider";
import type { RecapDetailLevel } from "./schema";
import {
  buildValidationContext,
  validateRecap,
  type RecapValidationFailureReason,
  type SegmentReference,
} from "./validator";

export interface GenerateValidatedRecapDeps {
  storySourceRepository: StorySourceRepository;
  recapProvider: RecapProvider;
  knownSegments: SegmentReference[];
}

export interface GenerateValidatedRecapInput {
  bookId: string;
  bookTitle: string;
  boundarySegmentOrdinal: number;
  detailLevel: RecapDetailLevel;
}

export type GenerateRecapOutcome =
  | { status: "ok"; recap: import("./schema").ValidatedRecap }
  | { status: "unsupported_book"; message: string }
  | { status: "boundary_unavailable"; message: string }
  | { status: "provider_error"; message: string }
  | {
      status: "validation_failed";
      reason: RecapValidationFailureReason;
      message: string;
    };

/**
 * Orchestrates the full recap pipeline (book-support check -> safe snapshot retrieval ->
 * generation -> deterministic validation) and reports a distinct, honest outcome for every
 * way it can fail, instead of collapsing them into one generic error.
 */
export async function generateValidatedRecap(
  input: GenerateValidatedRecapInput,
  deps: GenerateValidatedRecapDeps,
): Promise<GenerateRecapOutcome> {
  const support = await deps.storySourceRepository.getBookSupport(input.bookId);
  if (!support.isSupported || !support.sourceDocumentId) {
    return {
      status: "unsupported_book",
      message:
        support.reason ?? "Recap is not available for this title or edition.",
    };
  }

  const snapshot = await deps.storySourceRepository.getSnapshotAtBoundary(
    support.sourceDocumentId,
    input.boundarySegmentOrdinal,
  );
  if (!snapshot) {
    return {
      status: "boundary_unavailable",
      message:
        "No supported story boundary was found at or before your progress.",
    };
  }

  let rawRecap: unknown;
  try {
    rawRecap = await deps.recapProvider.generateRecap({
      bookTitle: input.bookTitle,
      detailLevel: input.detailLevel,
      boundaryLabel: snapshot.boundaryLabel,
      snapshot,
      allowedSegmentIds: snapshot.supportingSegmentIds,
    });
  } catch (error) {
    const reason =
      error instanceof RecapProviderError
        ? error.message
        : "unexpected provider error";
    console.error("recap_provider_error", { reason });
    return {
      status: "provider_error",
      message: "We couldn't generate a recap right now. Please try again.",
    };
  }

  const context = buildValidationContext(snapshot, deps.knownSegments);
  const result = validateRecap(rawRecap, context);
  if (!result.valid) {
    console.error("recap_validation_failed", {
      reason: result.reason,
      sourceDocumentId: support.sourceDocumentId,
      boundarySegmentOrdinal: input.boundarySegmentOrdinal,
    });
    return {
      status: "validation_failed",
      reason: result.reason,
      message: result.safeMessage,
    };
  }

  return { status: "ok", recap: result.recap };
}
