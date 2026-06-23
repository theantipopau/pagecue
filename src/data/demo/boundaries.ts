import type { StoryBoundary } from "@/domain/story/types";
import { DEMO_SOURCE_DOCUMENT_ID } from "./book";
import { demoChapters } from "./chapters";

export const demoBoundaries: StoryBoundary[] = demoChapters.map((chapter) => ({
  sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
  segmentOrdinal: chapter.ordinal,
  chapterOrdinal: chapter.ordinal,
  label: `End of Chapter ${chapter.ordinal}: "${chapter.title}"`,
  isExact: true,
}));
