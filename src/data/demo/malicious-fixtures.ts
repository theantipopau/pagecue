import type { SegmentReference } from "@/domain/recap/validator";
import type { Recap } from "@/domain/recap/schema";
import { DEMO_SOURCE_DOCUMENT_ID, demoBook } from "./book";
import { demoBoundaries } from "./boundaries";
import { demoSegments } from "./segments";

/**
 * Adversarial recap payloads used only in tests to prove the spoiler-safety validator rejects
 * every category of unsafe output described in docs/SPOILER_SAFETY.md, evaluated against a
 * reader who has only reached the end of Chapter 3 (boundary ordinal 3).
 */
export const FIXTURE_BOUNDARY_ORDINAL = 3;
export const FIXTURE_BOUNDARY_LABEL = demoBoundaries[2].label;

const FOREIGN_SOURCE_DOCUMENT_ID = "other-book-source";
const FOREIGN_SEGMENT_ID = "seg-other-book-1";

/** Known-segment index used by fixtures: the real demo segments plus one decoy from a different book. */
export const fixtureKnownSegments: SegmentReference[] = [
  ...demoSegments.map((segment) => ({
    id: segment.id,
    sourceDocumentId: segment.sourceDocumentId,
    segmentOrdinal: segment.segmentOrdinal,
  })),
  {
    id: FOREIGN_SEGMENT_ID,
    sourceDocumentId: FOREIGN_SOURCE_DOCUMENT_ID,
    segmentOrdinal: 1,
  },
];

function baseRecap(overrides: Partial<Recap> = {}): Recap {
  return {
    bookTitle: demoBook.title,
    boundaryLabel: FIXTURE_BOUNDARY_LABEL,
    detailLevel: "standard",
    summary:
      "Wren continues investigating the missing atlas pages in Saltgrave Harbor.",
    characters: [
      {
        name: "Wren Calder",
        reminder: "An archivist's apprentice cataloguing Fenn's papers.",
        currentState: "Investigating the missing atlas pages.",
        supportingSegmentIds: ["seg-1"],
      },
    ],
    currentSituation: [
      {
        text: "Wren is continuing to investigate despite Constable Dray's warning.",
        supportingSegmentIds: ["seg-3"],
      },
    ],
    unresolvedThreads: [
      {
        text: "Where are the torn-out atlas pages?",
        supportingSegmentIds: ["seg-1"],
      },
    ],
    confidence: "high",
    confidenceReason: "End of Chapter 3 is a precisely supported boundary.",
    spoilerWarning:
      "This recap only uses information through the end of Chapter 3.",
    ...overrides,
  };
}

/** Cites a real segment from beyond the confirmed boundary -> expect FUTURE_SEGMENT_REFERENCE. */
export const futureSegmentRecap: Recap = baseRecap({
  currentSituation: [
    {
      text: "Dray finally reveals he was protecting the cove from old smuggling dangers.",
      supportingSegmentIds: ["seg-6"],
    },
  ],
});

/** Cites a segment ID that does not exist anywhere -> expect UNKNOWN_SEGMENT. */
export const unknownSegmentRecap: Recap = baseRecap({
  currentSituation: [
    {
      text: "Wren makes an unexplained discovery.",
      supportingSegmentIds: ["seg-does-not-exist"],
    },
  ],
});

/** Cites a real segment ID that belongs to a different book -> expect BOOK_MISMATCH. */
export const wrongBookSegmentRecap: Recap = baseRecap({
  currentSituation: [
    {
      text: "Wren makes a discovery shared with another story entirely.",
      supportingSegmentIds: [FOREIGN_SEGMENT_ID],
    },
  ],
});

/**
 * Claims a thread is fully resolved at a boundary where the snapshot has no resolved-thread
 * evidence at all -> expect UNSUPPORTED_CLAIM.
 */
export const prematurelyResolvedThreadRecap: Recap = baseRecap({
  currentSituation: [
    {
      text: "The mystery of Constable Dray's motives is now resolved.",
      supportingSegmentIds: ["seg-3"],
    },
  ],
});

/** Declares a boundary label that does not match the confirmed boundary -> expect BOUNDARY_MISMATCH. */
export const boundaryLabelMismatchRecap: Recap = baseRecap({
  boundaryLabel: demoBoundaries[5].label,
});

/** Violates the schema itself (empty supporting-segment list) -> expect SCHEMA_INVALID. */
export const noEvidenceRecap: unknown = {
  ...baseRecap(),
  currentSituation: [
    {
      text: "Wren makes a claim with no cited evidence at all.",
      supportingSegmentIds: [],
    },
  ],
};

export { DEMO_SOURCE_DOCUMENT_ID };
