import type {
  BookSearchProvider,
  BookSearchQuery,
  BookSearchResponse,
} from "@/domain/books/provider";
import { mockCatalogResults } from "@/data/mock-catalog/search-fixtures";
import { classifySearchInput } from "@/lib/isbn/classify-search-input";
import { convertIsbn10ToIsbn13 } from "@/lib/isbn/isbn";

/**
 * Deterministic, zero-credential book search. Matches by exact ISBN-10/13 (including the
 * ISBN-13 a matching ISBN-10 would convert to) or by case-insensitive title/author substring.
 */
export class MockBookSearchProvider implements BookSearchProvider {
  async search(query: BookSearchQuery): Promise<BookSearchResponse> {
    const trimmed = query.text.trim();
    if (!trimmed) {
      return { query, results: [] };
    }

    const classification = classifySearchInput(trimmed);

    if (classification.kind === "isbn10" || classification.kind === "isbn13") {
      const isbn13Equivalent =
        classification.kind === "isbn10"
          ? convertIsbn10ToIsbn13(classification.normalized)
          : null;
      const results = mockCatalogResults.filter(
        (item) =>
          item.edition.isbn10 === classification.normalized ||
          item.edition.isbn13 === classification.normalized ||
          (isbn13Equivalent && item.edition.isbn13 === isbn13Equivalent),
      );
      return { query, results };
    }

    if (classification.kind === "invalid_isbn_shape") {
      return { query, results: [] };
    }

    const needle = trimmed.toLowerCase();
    const results = mockCatalogResults.filter(
      (item) =>
        item.book.title.toLowerCase().includes(needle) ||
        item.book.authors.some((author) =>
          author.toLowerCase().includes(needle),
        ),
    );
    return { query, results };
  }
}
