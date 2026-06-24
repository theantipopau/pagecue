import { describe, expect, it } from "vitest";
import {
  classifyIsbn,
  convertIsbn10ToIsbn13,
  formatIsbnForDisplay,
  isValidIsbn10,
  isValidIsbn13,
  looksLikeIsbnShaped,
  normalizeIsbn,
} from "../isbn";
import { classifySearchInput } from "../classify-search-input";

describe("normalizeIsbn", () => {
  it("strips spaces and hyphens and upper-cases X", () => {
    expect(normalizeIsbn("0-8044-2957-x")).toBe("080442957X");
    expect(normalizeIsbn("978 0 306 40615 7")).toBe("9780306406157");
  });
});

describe("isValidIsbn10", () => {
  it("accepts a known valid ISBN-10", () => {
    expect(isValidIsbn10("0306406152")).toBe(true);
    expect(isValidIsbn10("0-306-40615-2")).toBe(true);
  });

  it("accepts a known valid ISBN-10 ending in X", () => {
    expect(isValidIsbn10("080442957X")).toBe(true);
  });

  it("rejects a bad checksum", () => {
    expect(isValidIsbn10("0306406151")).toBe(false);
  });

  it("rejects the wrong length", () => {
    expect(isValidIsbn10("030640615")).toBe(false);
  });
});

describe("isValidIsbn13", () => {
  it("accepts a known valid ISBN-13", () => {
    expect(isValidIsbn13("9780306406157")).toBe(true);
    expect(isValidIsbn13("978-0-306-40615-7")).toBe(true);
  });

  it("rejects a bad checksum", () => {
    expect(isValidIsbn13("9780306406158")).toBe(false);
  });

  it("rejects a 10-digit string", () => {
    expect(isValidIsbn13("0306406152")).toBe(false);
  });
});

describe("classifyIsbn", () => {
  it("classifies valid ISBN-10 and ISBN-13 correctly", () => {
    expect(classifyIsbn("0306406152")).toBe("isbn10");
    expect(classifyIsbn("9780306406157")).toBe("isbn13");
  });

  it("returns null for invalid or non-ISBN strings", () => {
    expect(classifyIsbn("0306406151")).toBeNull();
    expect(classifyIsbn("The Lanternkeeper's Atlas")).toBeNull();
  });
});

describe("looksLikeIsbnShaped", () => {
  it("flags right-length digit strings even when the checksum is wrong", () => {
    expect(looksLikeIsbnShaped("0306406151")).toBe(true);
    expect(looksLikeIsbnShaped("9780306406158")).toBe(true);
  });

  it("does not flag ordinary text or unrelated numbers", () => {
    expect(looksLikeIsbnShaped("The Lanternkeeper's Atlas")).toBe(false);
    expect(looksLikeIsbnShaped("12345")).toBe(false);
  });
});

describe("convertIsbn10ToIsbn13", () => {
  it("converts a known ISBN-10 to its matching ISBN-13", () => {
    expect(convertIsbn10ToIsbn13("0306406152")).toBe("9780306406157");
  });

  it("returns null for an invalid ISBN-10", () => {
    expect(convertIsbn10ToIsbn13("0306406151")).toBeNull();
  });
});

describe("formatIsbnForDisplay", () => {
  it("groups a 13-digit ISBN into five segments", () => {
    expect(formatIsbnForDisplay("9780306406157")).toBe("978-0-30640-615-7");
  });

  it("groups a 10-digit ISBN into four segments", () => {
    expect(formatIsbnForDisplay("0306406152")).toBe("0-30640-615-2");
  });
});

describe("classifySearchInput", () => {
  it("classifies a valid ISBN-13 query", () => {
    const result = classifySearchInput("978-0-306-40615-7");
    expect(result.kind).toBe("isbn13");
  });

  it("classifies a valid ISBN-10 query", () => {
    const result = classifySearchInput("0306406152");
    expect(result.kind).toBe("isbn10");
  });

  it("flags an ISBN-shaped query with a bad checksum", () => {
    const result = classifySearchInput("0306406151");
    expect(result.kind).toBe("invalid_isbn_shape");
  });

  it("treats ordinary title text as text", () => {
    const result = classifySearchInput("The Lanternkeeper's Atlas");
    expect(result.kind).toBe("text");
  });
});
