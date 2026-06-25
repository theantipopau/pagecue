import type { RecapHistoryEntry } from "./history";
import type { Recap } from "./schema";

export interface RecapHistoryRepository {
  listHistory(libraryItemId: string): Promise<RecapHistoryEntry[]>;
  addHistoryEntry(
    libraryItemId: string,
    recap: Recap,
  ): Promise<RecapHistoryEntry>;
  clearHistory(libraryItemId: string): Promise<void>;
  clearAllHistory(): Promise<void>;
}
