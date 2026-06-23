import { z } from "zod";

export const RecapDetailLevelSchema = z.enum(["quick", "standard", "detailed"]);
export type RecapDetailLevel = z.infer<typeof RecapDetailLevelSchema>;

export const RecapConfidenceSchema = z.enum(["high", "medium", "low"]);
export type RecapConfidence = z.infer<typeof RecapConfidenceSchema>;

export const RecapSchema = z.object({
  bookTitle: z.string().min(1),
  boundaryLabel: z.string().min(1),
  detailLevel: RecapDetailLevelSchema,
  summary: z.string().min(1),
  characters: z.array(
    z.object({
      name: z.string().min(1),
      reminder: z.string().min(1),
      currentState: z.string().min(1),
      supportingSegmentIds: z.array(z.string().min(1)).min(1),
    }),
  ),
  currentSituation: z.array(
    z.object({
      text: z.string().min(1),
      supportingSegmentIds: z.array(z.string().min(1)).min(1),
    }),
  ),
  unresolvedThreads: z.array(
    z.object({
      text: z.string().min(1),
      supportingSegmentIds: z.array(z.string().min(1)).min(1),
    }),
  ),
  confidence: RecapConfidenceSchema,
  confidenceReason: z.string().min(1),
  spoilerWarning: z.string().min(1),
});

export type Recap = z.infer<typeof RecapSchema>;

/** A recap that has passed `validateRecap`. Carries the same shape, marked nominally to prevent accidental display of unvalidated output. */
export type ValidatedRecap = Recap & { readonly __validated: true };
