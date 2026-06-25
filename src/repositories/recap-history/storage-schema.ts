import { z } from "zod";
import { RecapSchema } from "@/domain/recap/schema";

const RecapHistoryEntrySchema = z.object({
  id: z.string().min(1),
  libraryItemId: z.string().min(1),
  recap: RecapSchema,
  createdAt: z.string(),
});

export const StoredRecapHistoryV1Schema = z.object({
  version: z.literal(1),
  entriesByLibraryItemId: z.record(
    z.string(),
    z.array(RecapHistoryEntrySchema),
  ),
});

export type StoredRecapHistoryV1 = z.infer<typeof StoredRecapHistoryV1Schema>;

export const RECAP_HISTORY_STORAGE_KEY = "pagecue.recapHistory.v1";

/** Caps stored history per item so the payload stays modest (build prompt §23). */
export const MAX_HISTORY_ENTRIES_PER_ITEM = 20;
