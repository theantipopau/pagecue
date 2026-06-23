import type {
  AddLibraryItemInput,
  LibraryItem,
  UpdateLibraryItemInput,
} from "./types";

export interface LibraryRepository {
  listLibraryItems(profileId: string): Promise<LibraryItem[]>;
  getLibraryItem(id: string): Promise<LibraryItem | null>;
  addLibraryItem(input: AddLibraryItemInput): Promise<LibraryItem>;
  updateLibraryItem(
    id: string,
    input: UpdateLibraryItemInput,
  ): Promise<LibraryItem>;
  removeLibraryItem(id: string): Promise<void>;
}
