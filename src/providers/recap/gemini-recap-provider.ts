import type {
  GenerateRecapInput,
  RecapProvider,
} from "@/domain/recap/provider";
import { RecapProviderError } from "@/domain/recap/errors";
import { RECAP_SYSTEM_INSTRUCTION } from "@/domain/recap/prompt-version";
import type { Recap } from "@/domain/recap/schema";
import { buildGeminiUserContent } from "./build-gemini-user-content";
import { GEMINI_RECAP_RESPONSE_SCHEMA } from "./gemini-response-schema";
import { GeminiResponseEnvelopeSchema } from "./gemini-response-envelope-schema";

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Real recap generation via Google's Gemini API, chosen specifically because it has a
 * genuinely free usage tier (see docs/DECISIONS.md) - PageCue must remain a free product to
 * run, not just free to develop against. This class is server-only; it is constructed in
 * `src/config/providers.ts` and the API key never reaches the browser.
 *
 * The model receives only what `buildGeminiUserContent` assembles - the structured snapshot
 * and the allowed segment IDs - plus the fixed system instruction. Its output is never
 * trusted directly: the caller (`generateValidatedRecap`) always re-validates it with
 * `validateRecap` before display, exactly as it does for the mock provider.
 */
export class GeminiRecapProvider implements RecapProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = "gemini-2.5-flash",
  ) {}

  async generateRecap(input: GenerateRecapInput): Promise<Recap> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: RECAP_SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: buildGeminiUserContent(input) }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: GEMINI_RECAP_RESPONSE_SCHEMA,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } catch {
      throw new RecapProviderError("The Gemini request failed or timed out.");
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 429) {
      throw new RecapProviderError("Gemini rate limit exceeded.");
    }
    if (!response.ok) {
      throw new RecapProviderError(
        `Gemini returned an unexpected status (${response.status}).`,
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await response.json();
    } catch {
      throw new RecapProviderError(
        "Gemini returned a response that could not be parsed.",
      );
    }

    const envelope = GeminiResponseEnvelopeSchema.safeParse(rawBody);
    if (!envelope.success) {
      throw new RecapProviderError(
        "Gemini returned an unrecognized response shape.",
      );
    }
    if (envelope.data.error) {
      throw new RecapProviderError(
        `Gemini returned an error: ${envelope.data.error.message ?? "unknown error"}.`,
      );
    }

    const candidate = envelope.data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    if (!text) {
      throw new RecapProviderError(
        `Gemini returned no usable output (finishReason: ${candidate?.finishReason ?? "unknown"}).`,
      );
    }

    try {
      return JSON.parse(text) as Recap;
    } catch {
      throw new RecapProviderError("Gemini's output was not valid JSON.");
    }
  }
}
