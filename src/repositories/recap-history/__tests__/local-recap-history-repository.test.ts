import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Recap } from "@/domain/recap/schema";
import { RECAP_HISTORY_STORAGE_KEY } from "../storage-schema";

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

const sampleRecap: Recap = {
  bookTitle: "The Lanternkeeper's Atlas",
  boundaryLabel: "End of Chapter 2",
  detailLevel: "standard",
  summary: "Wren arrives in town and finds a torn notebook.",
  characters: [
    {
      name: "Wren Calder",
      reminder: "An archivist's apprentice.",
      currentState: "Investigating the notebook.",
      supportingSegmentIds: ["seg-1"],
    },
  ],
  currentSituation: [
    { text: "Wren finds a torn notebook.", supportingSegmentIds: ["seg-2"] },
  ],
  unresolvedThreads: [
    { text: "Where are the missing pages?", supportingSegmentIds: ["seg-2"] },
  ],
  confidence: "high",
  confidenceReason: "Exact boundary.",
  spoilerWarning: "Nothing beyond Chapter 2 was used.",
};

describe("LocalRecapHistoryRepository", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: new MemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("returns an empty list when nothing has been saved", async () => {
    const { LocalRecapHistoryRepository } =
      await import("../local-recap-history-repository");
    const repo = new LocalRecapHistoryRepository();
    expect(await repo.listHistory("item-1")).toEqual([]);
  });

  it("adds an entry and lists it back, newest first", async () => {
    const { LocalRecapHistoryRepository } =
      await import("../local-recap-history-repository");
    const repo = new LocalRecapHistoryRepository();
    await repo.addHistoryEntry("item-1", sampleRecap);
    await repo.addHistoryEntry("item-1", {
      ...sampleRecap,
      detailLevel: "quick",
    });

    const entries = await repo.listHistory("item-1");
    expect(entries).toHaveLength(2);
    expect(entries[0].recap.detailLevel).toBe("quick");
    expect(entries[1].recap.detailLevel).toBe("standard");
  });

  it("keeps history scoped per library item", async () => {
    const { LocalRecapHistoryRepository } =
      await import("../local-recap-history-repository");
    const repo = new LocalRecapHistoryRepository();
    await repo.addHistoryEntry("item-1", sampleRecap);
    await repo.addHistoryEntry("item-2", sampleRecap);

    expect(await repo.listHistory("item-1")).toHaveLength(1);
    expect(await repo.listHistory("item-2")).toHaveLength(1);
  });

  it("caps stored entries per item", async () => {
    const { LocalRecapHistoryRepository } =
      await import("../local-recap-history-repository");
    const { MAX_HISTORY_ENTRIES_PER_ITEM } = await import("../storage-schema");
    const repo = new LocalRecapHistoryRepository();
    for (let i = 0; i < MAX_HISTORY_ENTRIES_PER_ITEM + 5; i++) {
      await repo.addHistoryEntry("item-1", sampleRecap);
    }
    expect(await repo.listHistory("item-1")).toHaveLength(
      MAX_HISTORY_ENTRIES_PER_ITEM,
    );
  });

  it("clears history for a specific item only", async () => {
    const { LocalRecapHistoryRepository } =
      await import("../local-recap-history-repository");
    const repo = new LocalRecapHistoryRepository();
    await repo.addHistoryEntry("item-1", sampleRecap);
    await repo.addHistoryEntry("item-2", sampleRecap);

    await repo.clearHistory("item-1");

    expect(await repo.listHistory("item-1")).toHaveLength(0);
    expect(await repo.listHistory("item-2")).toHaveLength(1);
  });

  it("recovers from corrupt JSON instead of throwing", async () => {
    window.localStorage.setItem(RECAP_HISTORY_STORAGE_KEY, "{not valid json");
    const { LocalRecapHistoryRepository } =
      await import("../local-recap-history-repository");
    const repo = new LocalRecapHistoryRepository();
    expect(await repo.listHistory("item-1")).toEqual([]);
  });

  it("recovers from data that fails schema validation", async () => {
    window.localStorage.setItem(
      RECAP_HISTORY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        entriesByLibraryItemId: { "item-1": [{ bad: true }] },
      }),
    );
    const { LocalRecapHistoryRepository } =
      await import("../local-recap-history-repository");
    const repo = new LocalRecapHistoryRepository();
    expect(await repo.listHistory("item-1")).toEqual([]);
  });
});
