/**
 * Gemini "responseSchema" (an OpenAPI-3.0 subset) mirroring `RecapSchema`, passed in
 * `generationConfig` to constrain the model's JSON output. This is a reliability aid, not a
 * trust boundary - `validateRecap` still re-checks every claim's segment provenance
 * independently before anything reaches the UI, exactly as it does for the mock provider.
 */
export const GEMINI_RECAP_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    bookTitle: { type: "STRING" },
    boundaryLabel: { type: "STRING" },
    detailLevel: { type: "STRING", enum: ["quick", "standard", "detailed"] },
    summary: { type: "STRING" },
    characters: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          reminder: { type: "STRING" },
          currentState: { type: "STRING" },
          supportingSegmentIds: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["name", "reminder", "currentState", "supportingSegmentIds"],
      },
    },
    currentSituation: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          text: { type: "STRING" },
          supportingSegmentIds: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["text", "supportingSegmentIds"],
      },
    },
    unresolvedThreads: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          text: { type: "STRING" },
          supportingSegmentIds: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["text", "supportingSegmentIds"],
      },
    },
    confidence: { type: "STRING", enum: ["high", "medium", "low"] },
    confidenceReason: { type: "STRING" },
    spoilerWarning: { type: "STRING" },
  },
  required: [
    "bookTitle",
    "boundaryLabel",
    "detailLevel",
    "summary",
    "characters",
    "currentSituation",
    "unresolvedThreads",
    "confidence",
    "confidenceReason",
    "spoilerWarning",
  ],
} as const;
