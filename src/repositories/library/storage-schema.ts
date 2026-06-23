import { z } from "zod";

const BookSummarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  authors: z.array(z.string()),
  description: z.string().optional(),
  language: z.string().optional(),
  coverUrl: z.string().optional(),
  metadataProvider: z.enum(["mock", "google", "synthetic"]),
  isSyntheticDemo: z.boolean(),
});

const BookEditionSchema = z.object({
  id: z.string().min(1),
  bookId: z.string().min(1),
  isbn10: z.string().optional(),
  isbn13: z.string().optional(),
  publisher: z.string().optional(),
  publicationDate: z.string().optional(),
  pageCount: z.number().optional(),
  format: z.enum(["hardcover", "paperback", "ebook", "audiobook"]).optional(),
  language: z.string().optional(),
  hasExactPageMap: z.boolean(),
});

const ReadingProgressSchema = z.object({
  type: z.enum(["chapter", "percentage", "page"]),
  value: z.number(),
  chapterOrdinal: z.number().optional(),
  chapterLabel: z.string().optional(),
  pageNumber: z.number().optional(),
  percentage: z.number().optional(),
  mappedBoundarySegmentOrdinal: z.number().optional(),
  mappedBoundaryLabel: z.string().optional(),
  mappingConfidence: z.enum(["exact", "high", "medium", "low"]).optional(),
  mappingExplanation: z.string().optional(),
  updatedAt: z.string(),
});

const LibraryItemSchema = z.object({
  id: z.string().min(1),
  profileId: z.string().min(1),
  book: BookSummarySchema,
  edition: BookEditionSchema,
  status: z.enum(["want_to_read", "reading", "paused", "finished"]),
  progress: ReadingProgressSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const StoredShelfV1Schema = z.object({
  version: z.literal(1),
  items: z.array(LibraryItemSchema),
});

export type StoredShelfV1 = z.infer<typeof StoredShelfV1Schema>;

export const SHELF_STORAGE_KEY = "pagecue.shelf.v1";
