import { classifyIsbn, looksLikeIsbnShaped, normalizeIsbn } from "./isbn";

export type SearchInputClassification =
  | { kind: "isbn10" | "isbn13"; normalized: string }
  | { kind: "invalid_isbn_shape"; normalized: string }
  | { kind: "text" };

/**
 * Classifies a raw search box value so callers can route it to ISBN lookup vs free-text
 * search, and distinguish "this is shaped like an ISBN but the checksum is wrong" from an
 * ordinary 10-13 character title (e.g. a query that happens to be all digits).
 */
export function classifySearchInput(
  rawQuery: string,
): SearchInputClassification {
  const trimmed = rawQuery.trim();
  const normalized = normalizeIsbn(trimmed);
  const isbnKind = classifyIsbn(normalized);
  if (isbnKind) {
    return { kind: isbnKind, normalized };
  }
  if (looksLikeIsbnShaped(trimmed)) {
    return { kind: "invalid_isbn_shape", normalized };
  }
  return { kind: "text" };
}
