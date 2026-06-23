export type MetadataProvider = "mock" | "google" | "synthetic";

export interface BookSummary {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  language?: string;
  coverUrl?: string;
  metadataProvider: MetadataProvider;
  /** Marks the in-repo synthetic demonstration novel, which is the only title with recap support in Phase 1. */
  isSyntheticDemo: boolean;
}

export interface BookEdition {
  id: string;
  bookId: string;
  isbn10?: string;
  isbn13?: string;
  publisher?: string;
  publicationDate?: string;
  pageCount?: number;
  format?: "hardcover" | "paperback" | "ebook" | "audiobook";
  language?: string;
  /** Set only when this edition has an exact chapter/segment-to-page map; otherwise page progress is approximate. */
  hasExactPageMap: boolean;
}
