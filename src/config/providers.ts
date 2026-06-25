import type { BookSearchProvider } from "@/domain/books/provider";
import type { RecapProvider } from "@/domain/recap/provider";
import type { SegmentReference } from "@/domain/recap/validator";
import type { StorySourceRepository } from "@/domain/story/repository";
import { demoSegments } from "@/data/demo/segments";
import { GoogleBooksProvider } from "@/providers/book-search/google-books-provider";
import { MockBookSearchProvider } from "@/providers/book-search/mock-book-search-provider";
import { GeminiRecapProvider } from "@/providers/recap/gemini-recap-provider";
import { MockRecapProvider } from "@/providers/recap/mock-recap-provider";
import { SyntheticStorySourceRepository } from "@/repositories/story-source/synthetic-story-source-repository";
import { appEnv } from "./env";

/** Server-only provider selection. Never import this from a Client Component. */
export function getBookSearchProvider(): BookSearchProvider {
  switch (appEnv.BOOK_SEARCH_PROVIDER) {
    case "mock":
      return new MockBookSearchProvider();
    case "google": {
      const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
      if (!apiKey) {
        // Build prompt §4.4/§10: the default local mode must work with no metadata key. Rather
        // than erroring out when google is requested but unconfigured, fall back to mock so the
        // app stays usable - this is a deliberately silent, documented fallback, not a hidden one.
        console.warn(
          "BOOK_SEARCH_PROVIDER=google but GOOGLE_BOOKS_API_KEY is not set; falling back to the mock book search provider.",
        );
        return new MockBookSearchProvider();
      }
      return new GoogleBooksProvider(apiKey);
    }
  }
}

export function getStorySourceRepository(): StorySourceRepository {
  switch (appEnv.STORY_SOURCE_REPOSITORY) {
    case "synthetic":
      return new SyntheticStorySourceRepository();
    case "d1":
      throw new Error(
        "STORY_SOURCE_REPOSITORY=d1 is not implemented yet (see docs/ROADMAP.md). Use 'synthetic'.",
      );
  }
}

export function getRecapProvider(): RecapProvider {
  switch (appEnv.RECAP_PROVIDER) {
    case "mock":
      return new MockRecapProvider();
    case "gemini": {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Same fallback philosophy as getBookSearchProvider(): never let a configured-but-
        // unconfigured provider break the app. PageCue must stay free and credential-free by
        // default (build prompt §4.4) even when an optional real provider is requested.
        console.warn(
          "RECAP_PROVIDER=gemini but GEMINI_API_KEY is not set; falling back to the mock recap provider.",
        );
        return new MockRecapProvider();
      }
      return new GeminiRecapProvider(apiKey, process.env.GEMINI_MODEL);
    }
    case "openai":
    case "anthropic":
      throw new Error(
        `RECAP_PROVIDER=${appEnv.RECAP_PROVIDER} is not implemented yet (see docs/ROADMAP.md). Use 'mock' or 'gemini'.`,
      );
  }
}

/**
 * Global index of segment provenance (id -> book + ordinal) the spoiler validator checks
 * every recap claim against. Currently sourced only from the synthetic demo novel; a future
 * source (D1-backed) would aggregate across all ingested books here.
 */
export function getKnownSegments(): SegmentReference[] {
  return demoSegments.map((segment) => ({
    id: segment.id,
    sourceDocumentId: segment.sourceDocumentId,
    segmentOrdinal: segment.segmentOrdinal,
  }));
}
