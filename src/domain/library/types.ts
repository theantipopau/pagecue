import type { BookEdition, BookSummary } from "../books/types";
import type { ReadingProgress } from "../progress/types";

export type ReadingStatus = "want_to_read" | "reading" | "paused" | "finished";

export interface LibraryItem {
  id: string;
  profileId: string;
  book: BookSummary;
  edition: BookEdition;
  status: ReadingStatus;
  progress: ReadingProgress | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddLibraryItemInput {
  profileId: string;
  book: BookSummary;
  edition: BookEdition;
  status: ReadingStatus;
}

export interface UpdateLibraryItemInput {
  status?: ReadingStatus;
  progress?: ReadingProgress;
}
