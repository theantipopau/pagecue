# PageCue — Data Model

## Phase 1 runtime model (TypeScript types)

Defined in `src/domain/*`. Core shapes:

- `BookSummary`, `BookEdition` — `src/domain/books/types.ts`
- `LibraryItem`, `ReadingStatus` — `src/domain/library/types.ts`
- `ReadingProgress`, `ProgressType` — `src/domain/progress/types.ts`
- `StorySegment`, `CharacterState`, `StoryEvent`, `StoryThread`, `StorySnapshot`, `StoryBoundary` — `src/domain/story/types.ts`
- `RecapSchema` (Zod), `ValidatedRecap`, `RecapDetailLevel` — `src/domain/recap/schema.ts`

These mirror the shapes specified in the build prompt §16–17 and are the single source of truth; UI and providers import from here rather than redefining shapes.

## Local guest shelf storage shape

Stored under a single versioned `localStorage` key (`pagecue.shelf.v1`):

```ts
interface StoredShelfV1 {
  version: 1;
  items: LibraryItem[];
}
```

Rules (`src/repositories/library/local-library-repository.ts`):
- Every read is parsed with Zod; invalid/corrupt payloads fall back to an empty, freshly-seeded shelf rather than throwing.
- Writes are validated before being serialized.
- A schema version field allows a future migration function to upgrade `v1 → v2` without losing data.

## D1 schema (target design, not yet migrated — see `docs/DECISIONS.md`)

Tables mirror build prompt §24 exactly: `books`, `editions`, `profiles`, `library_items`, `source_documents`, `chapters`, `segments`, `story_snapshots`, `recaps`. Key design notes for when Stage 10 implements migrations:

- All primary keys are stable, application-generated string IDs (not auto-increment), so the same ID scheme works identically in the in-memory synthetic repository and the D1 repository.
- `segments.text_hash` is stored instead of segment text — D1 never holds raw commercial book text (build prompt §24, §38).
- `story_snapshots.snapshot_json` stores the full `StorySnapshot` for a boundary; `recaps.recap_json` stores the validated `ValidatedRecap`, plus `validation_status` so rejected attempts can be audited without ever being served.
- Foreign keys: `editions.book_id → books.id`, `library_items.edition_id → editions.id`, `chapters.source_document_id → source_documents.id`, `segments.chapter_id → chapters.id`, `story_snapshots.source_document_id → source_documents.id`, `recaps.library_item_id → library_items.id`.
- Suggested indexes: `editions(isbn_13)`, `editions(isbn_10)`, `library_items(profile_id)`, `segments(source_document_id, ordinal)`, `story_snapshots(source_document_id, boundary_segment_ordinal)`, `recaps(library_item_id, created_at)`.

## Synthetic demo novel data

Lives entirely in `src/data/demo/` as typed TypeScript modules (not a database), since Phase 1 has no DB:

- `book.ts` — `BookSummary` + `BookEdition` for the demo title.
- `chapters.ts` — ordered chapter list.
- `segments.ts` — ordered `StorySegment[]`.
- `snapshots.ts` — one `StorySnapshot` per supported boundary, hand-authored to be strictly cumulative (no forward-looking information — see `docs/SPOILER_SAFETY.md`).
- `boundaries.ts` — `StoryBoundary[]` derived from the snapshots, used to populate the progress-mapping UI.
- `mock-recaps.ts` — one pre-authored `RecapSchema`-shaped object per `(boundary, detailLevel)` pair, used by `MockRecapProvider`.
- `malicious-fixtures.ts` — adversarial recap payloads used only in tests (`docs/TESTING.md`).
