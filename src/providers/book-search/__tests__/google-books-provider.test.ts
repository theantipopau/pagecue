import { afterEach, describe, expect, it, vi } from "vitest";
import { BookSearchProviderError } from "@/domain/books/errors";
import { GoogleBooksProvider } from "../google-books-provider";

function mockFetchOnce(body: unknown, init: { status?: number } = {}) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: (init.status ?? 200) < 300,
      status: init.status ?? 200,
      json: async () => body,
    }),
  );
}

describe("GoogleBooksProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns no results for an empty query without calling fetch", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const provider = new GoogleBooksProvider("test-key");
    const response = await provider.search({ text: "   " });
    expect(response.results).toHaveLength(0);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("normalizes a typical volume response", async () => {
    mockFetchOnce({
      items: [
        {
          id: "abc123",
          volumeInfo: {
            title: "Sample Title",
            subtitle: "A Subtitle",
            authors: ["Jane Doe"],
            publisher: "Sample Press",
            publishedDate: "2020-05-01",
            description: "A description.",
            industryIdentifiers: [
              { type: "ISBN_10", identifier: "0306406152" },
              { type: "ISBN_13", identifier: "9780306406157" },
            ],
            pageCount: 250,
            language: "en",
            imageLinks: { thumbnail: "http://books.google.com/cover.jpg" },
          },
        },
      ],
    });

    const provider = new GoogleBooksProvider("test-key");
    const response = await provider.search({ text: "sample title" });
    expect(response.results).toHaveLength(1);
    const [result] = response.results;
    expect(result.book.title).toBe("Sample Title");
    expect(result.book.metadataProvider).toBe("google");
    expect(result.book.isSyntheticDemo).toBe(false);
    expect(result.book.coverUrl).toBe("https://books.google.com/cover.jpg");
    expect(result.edition.isbn10).toBe("0306406152");
    expect(result.edition.isbn13).toBe("9780306406157");
    expect(result.edition.pageCount).toBe(250);
  });

  it("skips a volume with no title", async () => {
    mockFetchOnce({
      items: [{ id: "no-title", volumeInfo: { authors: ["X"] } }],
    });
    const provider = new GoogleBooksProvider("test-key");
    const response = await provider.search({ text: "anything" });
    expect(response.results).toHaveLength(0);
  });

  it("handles a volume missing cover, description, page count, and ISBNs", async () => {
    mockFetchOnce({
      items: [
        {
          id: "sparse",
          volumeInfo: { title: "Sparse Book", authors: ["A. Author"] },
        },
      ],
    });
    const provider = new GoogleBooksProvider("test-key");
    const response = await provider.search({ text: "sparse book" });
    expect(response.results).toHaveLength(1);
    const [result] = response.results;
    expect(result.book.coverUrl).toBeUndefined();
    expect(result.book.description).toBeUndefined();
    expect(result.edition.pageCount).toBeUndefined();
    expect(result.edition.isbn10).toBeUndefined();
    expect(result.edition.isbn13).toBeUndefined();
  });

  it("deduplicates the same volume ID appearing twice", async () => {
    const volume = {
      id: "dup-1",
      volumeInfo: { title: "Duplicate", authors: ["A"] },
    };
    mockFetchOnce({ items: [volume, volume] });
    const provider = new GoogleBooksProvider("test-key");
    const response = await provider.search({ text: "duplicate" });
    expect(response.results).toHaveLength(1);
  });

  it("flags multiple editions of the same work", async () => {
    mockFetchOnce({
      items: [
        {
          id: "ed-1",
          volumeInfo: {
            title: "Same Work",
            authors: ["Same Author"],
            publisher: "P1",
          },
        },
        {
          id: "ed-2",
          volumeInfo: {
            title: "Same Work",
            authors: ["Same Author"],
            publisher: "P2",
          },
        },
      ],
    });
    const provider = new GoogleBooksProvider("test-key");
    const response = await provider.search({ text: "same work" });
    expect(response.results).toHaveLength(2);
    expect(response.results.every((r) => r.hasMultipleEditions)).toBe(true);
  });

  it("sends an isbn: prefixed query for a valid ISBN search", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });
    vi.stubGlobal("fetch", fetchSpy);
    const provider = new GoogleBooksProvider("test-key");
    await provider.search({ text: "978-0-306-40615-7" });
    const calledUrl = new URL(fetchSpy.mock.calls[0][0]);
    expect(calledUrl.searchParams.get("q")).toBe("isbn:9780306406157");
  });

  it("throws BookSearchProviderError on a non-OK HTTP status", async () => {
    mockFetchOnce({}, { status: 500 });
    const provider = new GoogleBooksProvider("test-key");
    await expect(provider.search({ text: "anything" })).rejects.toBeInstanceOf(
      BookSearchProviderError,
    );
  });

  it("throws BookSearchProviderError when fetch rejects (network failure or timeout)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );
    const provider = new GoogleBooksProvider("test-key");
    await expect(provider.search({ text: "anything" })).rejects.toBeInstanceOf(
      BookSearchProviderError,
    );
  });

  it("returns empty results rather than throwing on a malformed response shape", async () => {
    mockFetchOnce({ totalItems: "not-a-number", items: "also-wrong" });
    const provider = new GoogleBooksProvider("test-key");
    const response = await provider.search({ text: "anything" });
    expect(response.results).toHaveLength(0);
  });
});
