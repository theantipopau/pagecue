import type { Recap } from "./schema";

export interface RecapHistoryEntry {
  id: string;
  libraryItemId: string;
  recap: Recap;
  createdAt: string;
}
