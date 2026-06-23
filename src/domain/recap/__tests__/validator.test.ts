import { describe, expect, it } from "vitest";
import {
  FIXTURE_BOUNDARY_LABEL,
  FIXTURE_BOUNDARY_ORDINAL,
  boundaryLabelMismatchRecap,
  fixtureKnownSegments,
  futureSegmentRecap,
  noEvidenceRecap,
  prematurelyResolvedThreadRecap,
  unknownSegmentRecap,
  wrongBookSegmentRecap,
} from "@/data/demo/malicious-fixtures";
import { DEMO_SOURCE_DOCUMENT_ID } from "@/data/demo/book";
import { demoMockRecaps } from "@/data/demo/mock-recaps";
import { demoSnapshots } from "@/data/demo/snapshots";
import { buildValidationContext, validateRecap } from "../validator";

function contextAtFixtureBoundary() {
  return {
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    boundarySegmentOrdinal: FIXTURE_BOUNDARY_ORDINAL,
    boundaryLabel: FIXTURE_BOUNDARY_LABEL,
    knownSegments: fixtureKnownSegments,
    resolvedThreadEvidenceSegmentIds: [],
  };
}

describe("validateRecap - malicious fixtures", () => {
  it("rejects a recap citing a segment beyond the confirmed boundary", () => {
    const result = validateRecap(
      futureSegmentRecap,
      contextAtFixtureBoundary(),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe("FUTURE_SEGMENT_REFERENCE");
  });

  it("rejects a recap citing a segment that does not exist", () => {
    const result = validateRecap(
      unknownSegmentRecap,
      contextAtFixtureBoundary(),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe("UNKNOWN_SEGMENT");
  });

  it("rejects a recap citing a segment from a different book", () => {
    const result = validateRecap(
      wrongBookSegmentRecap,
      contextAtFixtureBoundary(),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe("BOOK_MISMATCH");
  });

  it("rejects a recap that claims a thread is resolved with no resolution evidence", () => {
    const result = validateRecap(
      prematurelyResolvedThreadRecap,
      contextAtFixtureBoundary(),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe("UNSUPPORTED_CLAIM");
  });

  it("rejects a recap whose boundary label does not match the confirmed boundary", () => {
    const result = validateRecap(
      boundaryLabelMismatchRecap,
      contextAtFixtureBoundary(),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe("BOUNDARY_MISMATCH");
  });

  it("rejects a recap with a claim that has no supporting evidence at all", () => {
    const result = validateRecap(noEvidenceRecap, contextAtFixtureBoundary());
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe("SCHEMA_INVALID");
  });

  it("rejects a recap containing HTML-like markup", () => {
    const result = validateRecap(
      {
        ...prematurelyResolvedThreadRecap,
        summary: "<script>alert(1)</script> Wren keeps investigating.",
        currentSituation: [
          {
            text: "Wren keeps investigating quietly.",
            supportingSegmentIds: ["seg-3"],
          },
        ],
      },
      contextAtFixtureBoundary(),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe("UNSAFE_CONTENT");
  });
});

describe("validateRecap - legitimate demo recaps", () => {
  const knownSegments = fixtureKnownSegments.filter(
    (segment) => segment.sourceDocumentId === DEMO_SOURCE_DOCUMENT_ID,
  );

  for (const snapshot of demoSnapshots) {
    for (const detailLevel of ["quick", "standard", "detailed"] as const) {
      it(`accepts the ${detailLevel} mock recap for boundary ${snapshot.boundarySegmentOrdinal}`, () => {
        const recap = demoMockRecaps.get(
          `${snapshot.boundarySegmentOrdinal}:${detailLevel}`,
        );
        expect(recap).toBeDefined();

        const context = buildValidationContext(snapshot, knownSegments);
        const result = validateRecap(recap, context);
        expect(result.valid).toBe(true);
      });
    }
  }
});
