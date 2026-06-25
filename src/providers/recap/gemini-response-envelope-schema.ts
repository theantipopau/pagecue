import { z } from "zod";

export const GeminiResponseEnvelopeSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z
          .object({
            parts: z
              .array(z.object({ text: z.string().optional() }))
              .optional(),
          })
          .optional(),
        finishReason: z.string().optional(),
      }),
    )
    .optional(),
  error: z
    .object({
      message: z.string().optional(),
      code: z.number().optional(),
    })
    .optional(),
});

export type GeminiResponseEnvelope = z.infer<
  typeof GeminiResponseEnvelopeSchema
>;
