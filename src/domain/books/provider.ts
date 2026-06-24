import type { BookEdition, BookSummary } from "./types";

export interface BookSearchQuery {
  text: string;
}

export interface BookSearchResultItem {
  book: BookSummary;
  edition: BookEdition;
  /** Set when a query matched multiple editions of the same book, so the UI can warn the reader to pick carefully. */
  hasMultipleEditions?: boolean;
}

export interface BookSearchResponse {
  query: BookSearchQuery;
  results: BookSearchResultItem[];
}

export interface BookSearchProvider {
  search(query: BookSearchQuery): Promise<BookSearchResponse>;
  getEdition?(id: string): Promise<BookEdition | null>;
}
