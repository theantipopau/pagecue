import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GUEST_PROFILE_ID } from "@/domain/library/guest-profile";
import { demoBook, demoEdition } from "@/data/demo/book";
import { SHELF_STORAGE_KEY } from "../storage-schema";

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

describe("LocalLibraryRepository", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: new MemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("seeds the demonstration book on first read", async () => {
    const { LocalLibraryRepository } =
      await import("../local-library-repository");
    const repo = new LocalLibraryRepository();
    const items = await repo.listLibraryItems(GUEST_PROFILE_ID);
    expect(items).toHaveLength(1);
    expect(items[0].book.id).toBe(demoBook.id);
  });

  it("adds, updates, and removes a library item", async () => {
    const { LocalLibraryRepository } =
      await import("../local-library-repository");
    const repo = new LocalLibraryRepository();
    await repo.listLibraryItems(GUEST_PROFILE_ID); // triggers seed

    const added = await repo.addLibraryItem({
      profileId: GUEST_PROFILE_ID,
      book: { ...demoBook, id: "book-other", isSyntheticDemo: false },
      edition: { ...demoEdition, id: "edition-other", bookId: "book-other" },
      status: "want_to_read",
    });
    expect(added.status).toBe("want_to_read");

    const updated = await repo.updateLibraryItem(added.id, {
      status: "reading",
    });
    expect(updated.status).toBe("reading");

    await repo.removeLibraryItem(added.id);
    const remaining = await repo.getLibraryItem(added.id);
    expect(remaining).toBeNull();
  });

  it("rejects updates to a missing item", async () => {
    const { LocalLibraryRepository, LibraryItemNotFoundError } =
      await import("../local-library-repository");
    const repo = new LocalLibraryRepository();
    await expect(
      repo.updateLibraryItem("missing-id", { status: "finished" }),
    ).rejects.toBeInstanceOf(LibraryItemNotFoundError);
  });

  it("recovers from corrupt JSON instead of throwing", async () => {
    window.localStorage.setItem(SHELF_STORAGE_KEY, "{not valid json");
    const { LocalLibraryRepository } =
      await import("../local-library-repository");
    const repo = new LocalLibraryRepository();
    const items = await repo.listLibraryItems(GUEST_PROFILE_ID);
    expect(items).toHaveLength(1);
  });

  it("recovers from data that fails schema validation", async () => {
    window.localStorage.setItem(
      SHELF_STORAGE_KEY,
      JSON.stringify({ version: 1, items: [{ unexpected: true }] }),
    );
    const { LocalLibraryRepository } =
      await import("../local-library-repository");
    const repo = new LocalLibraryRepository();
    const items = await repo.listLibraryItems(GUEST_PROFILE_ID);
    expect(items).toHaveLength(1);
    expect(items[0].book.id).toBe(demoBook.id);
  });
});
