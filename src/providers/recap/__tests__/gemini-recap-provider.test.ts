import { afterEach, describe, expect, it, vi } from "vitest";
import { RecapProviderError } from "@/domain/recap/errors";
import type { GenerateRecapInput } from "@/domain/recap/provider";
import {
  buildValidationContext,
  validateRecap,
} from "@/domain/recap/validator";
import type { StorySnapshot } from "@/domain/story/types";
import { GeminiRecapProvider } from "../gemini-recap-provider";

const snapshot: StorySnapshot = {
  sourceDocumentId: "demo-novel",
  boundarySegmentOrdinal: 2,
  boundaryLabel: "End of Chapter 2",
  cumulativeSummary: "Wren arrives in town and finds a torn notebook.",
  characters: [
    {
      id: "char-wren",
      name: "Wren Calder",
      aliases: ["Wren"],
      reminder: "An archivist's apprentice.",
      currentState: "Investigating the notebook.",
      knownRelationships: [],
      firstSeenSegmentOrdinal: 1,
      lastSeenSegmentOrdinal: 2,
      supportingSegmentIds: ["seg-1", "seg-2"],
    },
  ],
  importantEvents: [
    {
      id: "ev-1",
      description: "Wren finds a torn notebook.",
      segmentOrdinal: 2,
      supportingSegmentIds: ["seg-2"],
    },
  ],
  openThreads: [
    {
      id: "thread-1",
      description: "Where are the missing pages?",
      status: "open",
      introducedSegmentOrdinal: 2,
      supportingSegmentIds: ["seg-2"],
    },
  ],
  resolvedThreads: [],
  locations: [],
  supportingSegmentIds: ["seg-1", "seg-2"],
};

const baseInput: GenerateRecapInput = {
  bookTitle: "The Lanternkeeper's Atlas",
  detailLevel: "standard",
  boundaryLabel: "End of Chapter 2",
  snapshot,
  allowedSegmentIds: ["seg-1", "seg-2"],
};

function geminiSuccessBody(recapObject: unknown) {
  return {
    candidates: [
      {
        content: { parts: [{ text: JSON.stringify(recapObject) }] },
        finishReason: "STOP",
      },
    ],
  };
}

const validRecap = {
  bookTitle: "The Lanternkeeper's Atlas",
  boundaryLabel: "End of Chapter 2",
  detailLevel: "standard",
  summary: "Wren arrives in town and finds a torn notebook.",
  characters: [
    {
      name: "Wren Calder",
      reminder: "An archivist's apprentice.",
      currentState: "Investigating the notebook.",
      supportingSegmentIds: ["seg-1"],
    },
  ],
  currentSituation: [
    { text: "Wren finds a torn notebook.", supportingSegmentIds: ["seg-2"] },
  ],
  unresolvedThreads: [
    { text: "Where are the missing pages?", supportingSegmentIds: ["seg-2"] },
  ],
  confidence: "high",
  confidenceReason: "Exact boundary.",
  spoilerWarning: "Nothing beyond Chapter 2 was used.",
};

describe("GeminiRecapProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the system instruction, user content, and response schema to the correct endpoint", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => geminiSuccessBody(validRecap),
    });
    vi.stubGlobal("fetch", fetchSpy);

    const provider = new GeminiRecapProvider("test-key", "gemini-2.0-flash");
    await provider.generateRecap(baseInput);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    );
    expect(init.headers["x-goog-api-key"]).toBe("test-key");
    const body = JSON.parse(init.body);
    expect(body.systemInstruction.parts[0].text).toContain("spoiler-safe");
    expect(body.contents[0].parts[0].text).toContain("seg-1");
    expect(body.contents[0].parts[0].text).toContain("seg-2");
    expect(body.generationConfig.responseSchema.type).toBe("OBJECT");
  });

  it("parses a successful response into a recap object", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => geminiSuccessBody(validRecap),
      }),
    );
    const provider = new GeminiRecapProvider("test-key");
    const recap = await provider.generateRecap(baseInput);
    expect(recap.bookTitle).toBe("The Lanternkeeper's Atlas");
    expect(recap.summary).toContain("torn notebook");
  });

  it("throws RecapProviderError on a non-OK HTTP status", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );
    const provider = new GeminiRecapProvider("test-key");
    await expect(provider.generateRecap(baseInput)).rejects.toBeInstanceOf(
      RecapProviderError,
    );
  });

  it("throws RecapProviderError on a 429 rate limit", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: false, status: 429, json: async () => ({}) }),
    );
    const provider = new GeminiRecapProvider("test-key");
    await expect(provider.generateRecap(baseInput)).rejects.toBeInstanceOf(
      RecapProviderError,
    );
  });

  it("throws RecapProviderError when fetch rejects (network failure or timeout)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );
    const provider = new GeminiRecapProvider("test-key");
    await expect(provider.generateRecap(baseInput)).rejects.toBeInstanceOf(
      RecapProviderError,
    );
  });

  it("throws RecapProviderError when the response contains an error envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ error: { message: "quota exceeded", code: 8 } }),
      }),
    );
    const provider = new GeminiRecapProvider("test-key");
    await expect(provider.generateRecap(baseInput)).rejects.toBeInstanceOf(
      RecapProviderError,
    );
  });

  it("throws RecapProviderError when no candidate text is present (e.g. blocked by safety filters)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ candidates: [{ finishReason: "SAFETY" }] }),
      }),
    );
    const provider = new GeminiRecapProvider("test-key");
    await expect(provider.generateRecap(baseInput)).rejects.toBeInstanceOf(
      RecapProviderError,
    );
  });

  it("throws RecapProviderError when the candidate text is not valid JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: { parts: [{ text: "not valid json {{{" }] },
              finishReason: "STOP",
            },
          ],
        }),
      }),
    );
    const provider = new GeminiRecapProvider("test-key");
    await expect(provider.generateRecap(baseInput)).rejects.toBeInstanceOf(
      RecapProviderError,
    );
  });

  it("defense in depth: a malicious Gemini output is still rejected by validateRecap", async () => {
    const maliciousRecap = {
      ...validRecap,
      currentSituation: [
        {
          text: "Wren discovers who the antagonist really is.",
          // seg-99 does not exist at all in the known segment index.
          supportingSegmentIds: ["seg-99"],
        },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => geminiSuccessBody(maliciousRecap),
      }),
    );
    const provider = new GeminiRecapProvider("test-key");
    const rawRecap = await provider.generateRecap(baseInput);

    const context = buildValidationContext(snapshot, [
      { id: "seg-1", sourceDocumentId: "demo-novel", segmentOrdinal: 1 },
      { id: "seg-2", sourceDocumentId: "demo-novel", segmentOrdinal: 2 },
    ]);
    const result = validateRecap(rawRecap, context);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("UNKNOWN_SEGMENT");
    }
  });
});
