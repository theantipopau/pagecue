export type IsbnKind = "isbn10" | "isbn13";

/** Removes spaces and hyphens and upper-cases any trailing ISBN-10 check character. */
export function normalizeIsbn(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

export function isValidIsbn10(input: string): boolean {
  const isbn = normalizeIsbn(input);
  if (!/^\d{9}[\dX]$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * Number(isbn[i]);
  }
  const last = isbn[9] === "X" ? 10 : Number(isbn[9]);
  sum += last;
  return sum % 11 === 0;
}

export function isValidIsbn13(input: string): boolean {
  const isbn = normalizeIsbn(input);
  if (!/^\d{13}$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * Number(isbn[i]);
  }
  return sum % 10 === 0;
}

/** Returns which ISBN format a normalized string validates as, or null if neither. */
export function classifyIsbn(input: string): IsbnKind | null {
  const isbn = normalizeIsbn(input);
  if (isbn.length === 10 && isValidIsbn10(isbn)) return "isbn10";
  if (isbn.length === 13 && isValidIsbn13(isbn)) return "isbn13";
  return null;
}

/**
 * Distinguishes a search box entry that *looks like* an ISBN (right length, digits/X) but
 * fails its checksum from ordinary free-text search - the former should surface a "that
 * doesn't look like a valid ISBN" hint instead of being treated as a title/author query.
 */
export function looksLikeIsbnShaped(input: string): boolean {
  const isbn = normalizeIsbn(input);
  return /^\d{9}[\dX]$/.test(isbn) || /^\d{13}$/.test(isbn);
}

export function convertIsbn10ToIsbn13(input: string): string | null {
  if (!isValidIsbn10(input)) return null;
  const isbn10 = normalizeIsbn(input);
  const core = `978${isbn10.slice(0, 9)}`;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * Number(core[i]);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return `${core}${checkDigit}`;
}

/**
 * Simplified display grouping (not registrant-range-aware - real ISBN hyphenation depends on
 * an external agency table). Good enough for readable display, not for re-deriving a valid ISBN.
 */
export function formatIsbnForDisplay(input: string): string {
  const isbn = normalizeIsbn(input);
  if (isbn.length === 13) {
    return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 9)}-${isbn.slice(9, 12)}-${isbn.slice(12)}`;
  }
  if (isbn.length === 10) {
    return `${isbn.slice(0, 1)}-${isbn.slice(1, 6)}-${isbn.slice(6, 9)}-${isbn.slice(9)}`;
  }
  return isbn;
}
