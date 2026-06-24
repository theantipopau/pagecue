import { z } from "zod";

const GoogleVolumeInfoSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  authors: z.array(z.string()).optional(),
  publisher: z.string().optional(),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
  industryIdentifiers: z
    .array(z.object({ type: z.string(), identifier: z.string() }))
    .optional(),
  pageCount: z.number().optional(),
  language: z.string().optional(),
  imageLinks: z
    .object({
      smallThumbnail: z.string().optional(),
      thumbnail: z.string().optional(),
    })
    .optional(),
});

const GoogleVolumeSchema = z.object({
  id: z.string(),
  volumeInfo: GoogleVolumeInfoSchema.optional(),
});

export const GoogleBooksResponseSchema = z.object({
  items: z.array(GoogleVolumeSchema).optional(),
  totalItems: z.number().optional(),
});

export type GoogleVolume = z.infer<typeof GoogleVolumeSchema>;
export type GoogleBooksResponse = z.infer<typeof GoogleBooksResponseSchema>;
