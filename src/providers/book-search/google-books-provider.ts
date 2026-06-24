import type {
  BookSearchProvider,
  BookSearchQuery,
  BookSearchResponse,
} from "@/domain/books/provider";
import { BookSearchProviderError } from "@/domain/books/errors";
import { classifySearchInput } from "@/lib/isbn/classify-search-input";
import { GoogleBooksResponseSchema } from "./google-books-response-schema";
import { groupAndDedupeVolumes } from "./normalize-google-volume";

const GOOGLE_BOOKS_ENDPOINT = "https://www.googleapis.com/books/v1/volumes";
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Server-only adapter over the real Google Books API. Never exposes the API key to the
 * browser - this class is only ever constructed in `src/config/providers.ts`, which runs
 * server-side. Catalogue description text from Google is metadata only and is never used as
 * a recap source (build prompt §20).
 */
export class GoogleBooksProvider implements BookSearchProvider {
  constructor(private readonly apiKey: string) {}

  async search(query: BookSearchQuery): Promise<BookSearchResponse> {
    const trimmed = query.text.trim();
    if (!trimmed) {
      return { query, results: [] };
    }

    const classification = classifySearchInput(trimmed);
    const searchTerm =
      classification.kind === "isbn10" || classification.kind === "isbn13"
        ? `isbn:${classification.normalized}`
        : trimmed;

    const url = new URL(GOOGLE_BOOKS_ENDPOINT);
    url.searchParams.set("q", searchTerm);
    url.searchParams.set("maxResults", "20");
    url.searchParams.set("key", this.apiKey);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } catch {
      throw new BookSearchProviderError(
        "The Google Books request failed or timed out.",
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 429) {
      throw new BookSearchProviderError("Google Books rate limit exceeded.");
    }
    if (!response.ok) {
      throw new BookSearchProviderError(
        `Google Books returned an unexpected status (${response.status}).`,
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await response.json();
    } catch {
      throw new BookSearchProviderError(
        "Google Books returned a response that could not be parsed.",
      );
    }

    const parsed = GoogleBooksResponseSchema.safeParse(rawBody);
    if (!parsed.success) {
      // An unrecognized response shape is treated as "no results" rather than an error - the
      // search itself may still be valid, and a malformed Google response shouldn't surface as
      // a scary failure to the reader.
      return { query, results: [] };
    }

    const results = groupAndDedupeVolumes(parsed.data.items ?? []);
    return { query, results };
  }
}
