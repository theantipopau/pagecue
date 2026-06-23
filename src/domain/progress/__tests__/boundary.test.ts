import { describe, expect, it } from "vitest";
import { demoBoundaries } from "@/data/demo/boundaries";
import { selectSafeBoundary } from "../boundary";

describe("selectSafeBoundary", () => {
  it("maps an exact chapter number to the matching boundary", () => {
    const result = selectSafeBoundary(
      { type: "chapter", value: 3 },
      demoBoundaries,
    );
    expect(result?.boundary.chapterOrdinal).toBe(3);
    expect(result?.confidence).toBe("exact");
  });

  it("falls back to the latest boundary at or before an out-of-range chapter", () => {
    const result = selectSafeBoundary(
      { type: "chapter", value: 4.5 },
      demoBoundaries,
    );
    expect(result?.boundary.chapterOrdinal).toBe(4);
    expect(result?.confidence).toBe("high");
  });

  it("never selects a boundary beyond the entered chapter", () => {
    const result = selectSafeBoundary(
      { type: "chapter", value: 1 },
      demoBoundaries,
    );
    expect(result?.boundary.chapterOrdinal).toBe(1);
  });

  it("maps percentage progress to an earlier, approximate boundary", () => {
    const result = selectSafeBoundary(
      { type: "percentage", value: 50 },
      demoBoundaries,
    );
    expect(result).not.toBeNull();
    expect(result!.boundary.chapterOrdinal).toBeLessThanOrEqual(3);
    expect(result!.confidence).toBe("medium");
  });

  it("treats page progress without an exact page map as low confidence", () => {
    const result = selectSafeBoundary(
      {
        type: "page",
        value: 100,
        editionPageCount: 192,
        hasExactPageMap: false,
      },
      demoBoundaries,
    );
    expect(result).not.toBeNull();
    expect(result!.confidence).toBe("low");
  });

  it("treats page progress with an exact page map as high confidence", () => {
    const result = selectSafeBoundary(
      {
        type: "page",
        value: 100,
        editionPageCount: 192,
        hasExactPageMap: true,
      },
      demoBoundaries,
    );
    expect(result).not.toBeNull();
    expect(result!.confidence).toBe("high");
  });

  it("returns null for page progress with no known page count", () => {
    const result = selectSafeBoundary(
      { type: "page", value: 100 },
      demoBoundaries,
    );
    expect(result).toBeNull();
  });

  it("returns null when no boundaries are supported", () => {
    const result = selectSafeBoundary({ type: "chapter", value: 1 }, []);
    expect(result).toBeNull();
  });
});
