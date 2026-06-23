import type { StorySourceRepository } from "@/domain/story/repository";
import type {
  BookSupportStatus,
  StoryBoundary,
  StorySnapshot,
} from "@/domain/story/types";
import { DEMO_BOOK_ID, DEMO_SOURCE_DOCUMENT_ID } from "@/data/demo/book";
import { demoBoundaries } from "@/data/demo/boundaries";
import { demoSnapshots } from "@/data/demo/snapshots";

/**
 * Phase 1 story source: serves only the in-repo synthetic demonstration novel. Any other
 * book is honestly reported as unsupported rather than producing a fabricated recap.
 */
export class SyntheticStorySourceRepository implements StorySourceRepository {
  async getBookSupport(bookId: string): Promise<BookSupportStatus> {
    if (bookId === DEMO_BOOK_ID) {
      return {
        bookId,
        sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
        isSupported: true,
      };
    }
    return {
      bookId,
      sourceDocumentId: null,
      isSupported: false,
      reason:
        "No approved structured story source is available for this title yet.",
    };
  }

  async getSnapshotAtBoundary(
    sourceDocumentId: string,
    maximumSegmentOrdinal: number,
  ): Promise<StorySnapshot | null> {
    if (sourceDocumentId !== DEMO_SOURCE_DOCUMENT_ID) {
      return null;
    }
    const eligible = demoSnapshots.filter(
      (snapshot) => snapshot.boundarySegmentOrdinal <= maximumSegmentOrdinal,
    );
    if (eligible.length === 0) {
      return null;
    }
    return eligible.reduce((latest, candidate) =>
      candidate.boundarySegmentOrdinal > latest.boundarySegmentOrdinal
        ? candidate
        : latest,
    );
  }

  async listSupportedBoundaries(
    sourceDocumentId: string,
  ): Promise<StoryBoundary[]> {
    if (sourceDocumentId !== DEMO_SOURCE_DOCUMENT_ID) {
      return [];
    }
    return demoBoundaries;
  }
}
