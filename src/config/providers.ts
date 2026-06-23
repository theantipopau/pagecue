import type { RecapProvider } from "@/domain/recap/provider";
import type { SegmentReference } from "@/domain/recap/validator";
import type { StorySourceRepository } from "@/domain/story/repository";
import { demoSegments } from "@/data/demo/segments";
import { MockRecapProvider } from "@/providers/recap/mock-recap-provider";
import { SyntheticStorySourceRepository } from "@/repositories/story-source/synthetic-story-source-repository";
import { appEnv } from "./env";

/** Server-only provider selection. Never import this from a Client Component. */
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
    case "openai":
    case "anthropic":
      throw new Error(
        `RECAP_PROVIDER=${appEnv.RECAP_PROVIDER} is not implemented yet (see docs/ROADMAP.md). Use 'mock'.`,
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
