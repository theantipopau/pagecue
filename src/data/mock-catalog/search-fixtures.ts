import type { BookSearchResultItem } from "@/domain/books/provider";
import { demoBook, demoEdition } from "@/data/demo/book";

/**
 * Deterministic fixtures for `MockBookSearchProvider`. Only the demo book
 * (`isSyntheticDemo: true`) has recap support - the rest exercise honest "track but no recap"
 * handling, missing-metadata fallbacks, and duplicate-edition warnings, without claiming
 * PageCue can summarize any real commercial title.
 */
export const mockCatalogResults: BookSearchResultItem[] = [
  {
    book: demoBook,
    edition: demoEdition,
  },
  {
    book: {
      id: "book-cartographers-silence",
      title: "The Cartographer's Silence",
      authors: ["Anya Petrov (fictional author)"],
      description:
        "A fictional catalogue fixture used to demonstrate tracking a book that has no approved structured story source.",
      language: "en",
      coverUrl: undefined,
      metadataProvider: "mock",
      isSyntheticDemo: false,
    },
    edition: {
      id: "edition-cartographers-silence-hc1",
      bookId: "book-cartographers-silence",
      isbn10: "0306406152",
      isbn13: "9780306406157",
      publisher: "Fictional Harbor Press",
      publicationDate: "2019-04-02",
      pageCount: 312,
      format: "hardcover",
      language: "en",
      hasExactPageMap: false,
    },
  },
  {
    book: {
      id: "book-salt-marsh",
      title: "Letters from the Salt Marsh",
      authors: ["Dorian Achebe (fictional author)"],
      language: "en",
      metadataProvider: "mock",
      isSyntheticDemo: false,
    },
    edition: {
      id: "edition-salt-marsh-eb1",
      bookId: "book-salt-marsh",
      isbn13: "9780486282114",
      publisher: "Fictional Harbor Press",
      publicationDate: "2021-11-15",
      format: "ebook",
      language: "en",
      hasExactPageMap: false,
    },
  },
  {
    book: {
      id: "book-forgotten-towns",
      title: "A Brief History of Nearly Forgotten Towns",
      authors: ["R. T. Whitfield (fictional author)"],
      language: "en",
      metadataProvider: "mock",
      isSyntheticDemo: false,
    },
    edition: {
      id: "edition-forgotten-towns-ab1",
      bookId: "book-forgotten-towns",
      publisher: "Fictional Harbor Press",
      publicationDate: "2022-06-01",
      format: "audiobook",
      language: "en",
      hasExactPageMap: false,
    },
  },
  {
    book: {
      id: "book-quiet-algorithm",
      title: "The Quiet Algorithm",
      subtitle: "A Novel",
      authors: ["Priya Nandakumar (fictional author)"],
      language: "en",
      metadataProvider: "mock",
      isSyntheticDemo: false,
    },
    edition: {
      id: "edition-quiet-algorithm-pb1",
      bookId: "book-quiet-algorithm",
      isbn13: "9780262033848",
      publisher: "Fictional Harbor Press",
      publicationDate: "2020-09-10",
      pageCount: 288,
      format: "paperback",
      language: "en",
      hasExactPageMap: false,
    },
    hasMultipleEditions: true,
  },
  {
    book: {
      id: "book-quiet-algorithm",
      title: "The Quiet Algorithm",
      subtitle: "A Novel",
      authors: ["Priya Nandakumar (fictional author)"],
      language: "en",
      metadataProvider: "mock",
      isSyntheticDemo: false,
    },
    edition: {
      id: "edition-quiet-algorithm-eb1",
      bookId: "book-quiet-algorithm",
      isbn13: "9780262517478",
      publisher: "Fictional Harbor Press",
      publicationDate: "2020-09-10",
      format: "ebook",
      language: "en",
      hasExactPageMap: false,
    },
    hasMultipleEditions: true,
  },
];
