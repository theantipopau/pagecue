import type { GenerateRecapInput } from "@/domain/recap/provider";

/**
 * Builds the exact, bounded payload sent to the model: book title, detail level, boundary
 * label, the structured snapshot (already limited to segments at or before the boundary by
 * `StorySourceRepository.getSnapshotAtBoundary`), and the explicit list of segment IDs the
 * model is allowed to cite. Nothing else - no full book text, no later snapshot, no general
 * "what happens in this book" framing.
 */
export function buildGeminiUserContent(input: GenerateRecapInput): string {
  const payload = {
    bookTitle: input.bookTitle,
    detailLevel: input.detailLevel,
    boundaryLabel: input.boundaryLabel,
    allowedSegmentIds: input.allowedSegmentIds,
    snapshot: input.snapshot,
  };

  return [
    "Generate a spoiler-safe recap using only the structured data below.",
    "Every supportingSegmentIds value you cite must come from allowedSegmentIds.",
    "Do not cite any segment ID that is not in allowedSegmentIds.",
    "",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}
