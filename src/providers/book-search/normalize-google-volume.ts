import type { BookSearchResultItem } from "@/domain/books/provider";
import type { GoogleVolume } from "./google-books-response-schema";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/**
 * Maps a single Google Books volume into PageCue's internal book/edition shape, independent
 * of Google's response format. Returns null for a volume with no title - there is nothing
 * usable to show. Google Books has no stable "work" identifier shared across editions, so a
 * deterministic slug of title+first author stands in for `book.id`, letting multiple volumes
 * of the same work be grouped (see `groupAndDedupeVolumes`).
 */
export function normalizeGoogleVolume(
  volume: GoogleVolume,
): BookSearchResultItem | null {
  const info = volume.volumeInfo;
  if (!info?.title) {
    return null;
  }

  const authors =
    info.authors && info.authors.length > 0 ? info.authors : ["Unknown author"];
  const workKey = slugify(`${info.title}-${authors[0]}`);
  const bookId = `google-work-${workKey}`;

  const isbn10 = info.industryIdentifiers?.find(
    (id) => id.type === "ISBN_10",
  )?.identifier;
  const isbn13 = info.industryIdentifiers?.find(
    (id) => id.type === "ISBN_13",
  )?.identifier;
  const coverUrl = info.imageLinks?.thumbnail?.replace(/^http:/, "https:");

  return {
    book: {
      id: bookId,
      title: info.title,
      subtitle: info.subtitle,
      authors,
      description: info.description,
      language: info.language,
      coverUrl,
      metadataProvider: "google",
      isSyntheticDemo: false,
    },
    edition: {
      id: `google-volume-${volume.id}`,
      bookId,
      isbn10,
      isbn13,
      publisher: info.publisher,
      publicationDate: info.publishedDate,
      pageCount: info.pageCount,
      language: info.language,
      hasExactPageMap: false,
    },
  };
}

/**
 * De-duplicates volumes Google returned more than once (same volume ID) and flags every result
 * whose book ID appears more than once - i.e. multiple distinct editions of the same work - so
 * the UI can warn the reader to pick carefully, the same way the mock provider does.
 */
export function groupAndDedupeVolumes(
  volumes: GoogleVolume[],
): BookSearchResultItem[] {
  const byEditionId = new Map<string, BookSearchResultItem>();
  for (const volume of volumes) {
    const normalized = normalizeGoogleVolume(volume);
    if (!normalized) continue;
    if (!byEditionId.has(normalized.edition.id)) {
      byEditionId.set(normalized.edition.id, normalized);
    }
  }

  const results = [...byEditionId.values()];
  const countByBookId = new Map<string, number>();
  for (const result of results) {
    countByBookId.set(
      result.book.id,
      (countByBookId.get(result.book.id) ?? 0) + 1,
    );
  }

  return results.map((result) => ({
    ...result,
    hasMultipleEditions: (countByBookId.get(result.book.id) ?? 0) > 1,
  }));
}
