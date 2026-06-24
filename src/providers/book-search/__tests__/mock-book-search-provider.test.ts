import { describe, expect, it } from "vitest";
import { MockBookSearchProvider } from "../mock-book-search-provider";

describe("MockBookSearchProvider", () => {
  const provider = new MockBookSearchProvider();

  it("returns no results for an empty query", async () => {
    const response = await provider.search({ text: "   " });
    expect(response.results).toHaveLength(0);
  });

  it("matches by title substring, case-insensitively", async () => {
    const response = await provider.search({ text: "lanternkeeper" });
    expect(response.results).toHaveLength(1);
    expect(response.results[0].book.title).toBe("The Lanternkeeper's Atlas");
  });

  it("matches by author substring", async () => {
    const response = await provider.search({ text: "petrov" });
    expect(response.results).toHaveLength(1);
    expect(response.results[0].book.title).toBe("The Cartographer's Silence");
  });

  it("matches an exact ISBN-13", async () => {
    const response = await provider.search({ text: "978-0-306-40615-7" });
    expect(response.results).toHaveLength(1);
    expect(response.results[0].book.title).toBe("The Cartographer's Silence");
  });

  it("matches an ISBN-10 against a record stored only by ISBN-13", async () => {
    const response = await provider.search({ text: "0306406152" });
    expect(response.results).toHaveLength(1);
    expect(response.results[0].edition.isbn13).toBe("9780306406157");
  });

  it("returns no results for an ISBN-shaped query with a bad checksum", async () => {
    const response = await provider.search({ text: "0306406151" });
    expect(response.results).toHaveLength(0);
  });

  it("returns no results for a query that matches nothing", async () => {
    const response = await provider.search({ text: "nonexistent title xyz" });
    expect(response.results).toHaveLength(0);
  });

  it("returns every edition of a multi-edition book, flagged accordingly", async () => {
    const response = await provider.search({ text: "the quiet algorithm" });
    expect(response.results).toHaveLength(2);
    expect(response.results.every((r) => r.hasMultipleEditions)).toBe(true);
    const formats = response.results.map((r) => r.edition.format);
    expect(formats).toContain("paperback");
    expect(formats).toContain("ebook");
  });

  it("includes the demo book, which has recap support", async () => {
    const response = await provider.search({ text: "lanternkeeper" });
    expect(response.results[0].book.isSyntheticDemo).toBe(true);
  });

  it("handles a result with no cover, page count, or ISBN gracefully", async () => {
    const response = await provider.search({ text: "forgotten towns" });
    expect(response.results).toHaveLength(1);
    const [result] = response.results;
    expect(result.book.coverUrl).toBeUndefined();
    expect(result.edition.pageCount).toBeUndefined();
    expect(result.edition.isbn10).toBeUndefined();
    expect(result.edition.isbn13).toBeUndefined();
  });
});
