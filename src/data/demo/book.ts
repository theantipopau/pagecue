import type { BookEdition, BookSummary } from "@/domain/books/types";

export const DEMO_SOURCE_DOCUMENT_ID = "demo-novel";
export const DEMO_BOOK_ID = "book-lanternkeepers-atlas";
export const DEMO_EDITION_ID = "edition-lanternkeepers-atlas-pb1";

export const demoBook: BookSummary = {
  id: DEMO_BOOK_ID,
  title: "The Lanternkeeper's Atlas",
  authors: ["Mirela Voss (fictional author, written for PageCue)"],
  description:
    "A gentle coastal mystery written specifically as PageCue's spoiler-safe demonstration novel. An archivist's apprentice catalogs a dead lighthouse keeper's papers and finds his personal atlas of the coastline missing several pages.",
  language: "en",
  metadataProvider: "synthetic",
  isSyntheticDemo: true,
};

export const demoEdition: BookEdition = {
  id: DEMO_EDITION_ID,
  bookId: DEMO_BOOK_ID,
  publisher: "PageCue Demonstration Press",
  publicationDate: "2026-01-01",
  pageCount: 192,
  format: "paperback",
  language: "en",
  hasExactPageMap: false,
};
