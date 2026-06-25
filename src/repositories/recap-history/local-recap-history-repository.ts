import type { RecapHistoryRepository } from "@/domain/recap/history-repository";
import type { RecapHistoryEntry } from "@/domain/recap/history";
import type { Recap } from "@/domain/recap/schema";
import { createId } from "@/lib/create-id";
import {
  MAX_HISTORY_ENTRIES_PER_ITEM,
  RECAP_HISTORY_STORAGE_KEY,
  StoredRecapHistoryV1Schema,
  type StoredRecapHistoryV1,
} from "./storage-schema";

function emptyHistory(): StoredRecapHistoryV1 {
  return { version: 1, entriesByLibraryItemId: {} };
}

/**
 * Local, validated recap history per shelf item - only ever populated from recaps that have
 * already passed `validateRecap` (see `RecapFlow`), so reading history back does not need to
 * re-validate. Capped per item so the stored payload stays modest (build prompt §23).
 */
export class LocalRecapHistoryRepository implements RecapHistoryRepository {
  private read(): StoredRecapHistoryV1 {
    if (typeof window === "undefined") {
      return emptyHistory();
    }

    const raw = window.localStorage.getItem(RECAP_HISTORY_STORAGE_KEY);
    if (raw === null) {
      return emptyHistory();
    }

    try {
      const parsedJson = JSON.parse(raw);
      const result = StoredRecapHistoryV1Schema.safeParse(parsedJson);
      if (!result.success) {
        console.warn(
          "pagecue: stored recap history failed validation and was reset.",
          { issueCount: result.error.issues.length },
        );
        return emptyHistory();
      }
      return result.data;
    } catch {
      console.warn(
        "pagecue: stored recap history was corrupt JSON and was reset.",
      );
      return emptyHistory();
    }
  }

  private write(history: StoredRecapHistoryV1): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      RECAP_HISTORY_STORAGE_KEY,
      JSON.stringify(history),
    );
  }

  async listHistory(libraryItemId: string): Promise<RecapHistoryEntry[]> {
    const history = this.read();
    return history.entriesByLibraryItemId[libraryItemId] ?? [];
  }

  async addHistoryEntry(
    libraryItemId: string,
    recap: Recap,
  ): Promise<RecapHistoryEntry> {
    const history = this.read();
    const entry: RecapHistoryEntry = {
      id: createId(),
      libraryItemId,
      recap,
      createdAt: new Date().toISOString(),
    };
    const existing = history.entriesByLibraryItemId[libraryItemId] ?? [];
    history.entriesByLibraryItemId[libraryItemId] = [entry, ...existing].slice(
      0,
      MAX_HISTORY_ENTRIES_PER_ITEM,
    );
    this.write(history);
    return entry;
  }

  async clearHistory(libraryItemId: string): Promise<void> {
    const history = this.read();
    delete history.entriesByLibraryItemId[libraryItemId];
    this.write(history);
  }
}

export const localRecapHistoryRepository = new LocalRecapHistoryRepository();
