import type { BookSupportStatus, StoryBoundary, StorySnapshot } from "./types";

export interface StorySourceRepository {
  getBookSupport(bookId: string): Promise<BookSupportStatus>;
  getSnapshotAtBoundary(
    sourceDocumentId: string,
    maximumSegmentOrdinal: number,
  ): Promise<StorySnapshot | null>;
  listSupportedBoundaries(sourceDocumentId: string): Promise<StoryBoundary[]>;
}
