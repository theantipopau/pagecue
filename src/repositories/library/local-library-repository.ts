import { demoBook, demoEdition } from "@/data/demo/book";
import { GUEST_PROFILE_ID } from "@/domain/library/guest-profile";
import type { LibraryRepository } from "@/domain/library/repository";
import type {
  AddLibraryItemInput,
  LibraryItem,
  UpdateLibraryItemInput,
} from "@/domain/library/types";
import {
  SHELF_STORAGE_KEY,
  StoredShelfV1Schema,
  type StoredShelfV1,
} from "./storage-schema";

export class LibraryItemNotFoundError extends Error {
  constructor(id: string) {
    super(`No library item exists with id "${id}".`);
    this.name = "LibraryItemNotFoundError";
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function seedShelf(): StoredShelfV1 {
  const timestamp = nowIso();
  const seededItem: LibraryItem = {
    id: createId(),
    profileId: GUEST_PROFILE_ID,
    book: demoBook,
    edition: demoEdition,
    status: "reading",
    progress: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return { version: 1, items: [seededItem] };
}

/**
 * Phase 1 guest shelf: stores everything in the browser's `localStorage` under a single
 * versioned key. Every read is validated; corrupt or unreadable data recovers to a freshly
 * seeded shelf instead of throwing, per docs/SECURITY_AND_PRIVACY.md and build prompt §23.
 */
export class LocalLibraryRepository implements LibraryRepository {
  private readShelf(): StoredShelfV1 {
    if (typeof window === "undefined") {
      return { version: 1, items: [] };
    }

    const raw = window.localStorage.getItem(SHELF_STORAGE_KEY);
    if (raw === null) {
      const seeded = seedShelf();
      this.writeShelf(seeded);
      return seeded;
    }

    try {
      const parsedJson = JSON.parse(raw);
      const result = StoredShelfV1Schema.safeParse(parsedJson);
      if (!result.success) {
        console.warn(
          "pagecue: stored guest shelf failed validation and was reset.",
          { issueCount: result.error.issues.length },
        );
        const seeded = seedShelf();
        this.writeShelf(seeded);
        return seeded;
      }
      return result.data;
    } catch {
      console.warn(
        "pagecue: stored guest shelf was corrupt JSON and was reset.",
      );
      const seeded = seedShelf();
      this.writeShelf(seeded);
      return seeded;
    }
  }

  private writeShelf(shelf: StoredShelfV1): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SHELF_STORAGE_KEY, JSON.stringify(shelf));
  }

  async listLibraryItems(profileId: string): Promise<LibraryItem[]> {
    return this.readShelf().items.filter(
      (item) => item.profileId === profileId,
    );
  }

  async getLibraryItem(id: string): Promise<LibraryItem | null> {
    return this.readShelf().items.find((item) => item.id === id) ?? null;
  }

  async addLibraryItem(input: AddLibraryItemInput): Promise<LibraryItem> {
    const shelf = this.readShelf();
    const timestamp = nowIso();
    const item: LibraryItem = {
      id: createId(),
      profileId: input.profileId,
      book: input.book,
      edition: input.edition,
      status: input.status,
      progress: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    shelf.items.push(item);
    this.writeShelf(shelf);
    return item;
  }

  async updateLibraryItem(
    id: string,
    input: UpdateLibraryItemInput,
  ): Promise<LibraryItem> {
    const shelf = this.readShelf();
    const index = shelf.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new LibraryItemNotFoundError(id);
    }
    const existing = shelf.items[index];
    const updated: LibraryItem = {
      ...existing,
      status: input.status ?? existing.status,
      progress: input.progress ?? existing.progress,
      updatedAt: nowIso(),
    };
    shelf.items[index] = updated;
    this.writeShelf(shelf);
    return updated;
  }

  async removeLibraryItem(id: string): Promise<void> {
    const shelf = this.readShelf();
    shelf.items = shelf.items.filter((item) => item.id !== id);
    this.writeShelf(shelf);
  }

  /** Clears all guest data and reseeds the demonstration book - used by the "reset demo data" settings action. */
  async resetToDemo(): Promise<void> {
    this.writeShelf(seedShelf());
  }
}

export const localLibraryRepository = new LocalLibraryRepository();
