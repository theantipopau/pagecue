-- PageCue D1 schema, Stage 10 (D1/Cloudflare). Mirrors build prompt §24 and docs/DATA_MODEL.md.
--
-- Design notes:
-- - All primary keys are application-generated TEXT IDs, not auto-increment, so the same ID
--   scheme works identically in the in-memory synthetic repository and this D1 schema.
-- - `segments.text_hash` stores a hash, never segment text - D1 must never hold raw
--   commercial book text (build prompt §24, §38).
-- - `story_snapshots.snapshot_json` stores the full StorySnapshot for a boundary;
--   `recaps.recap_json` stores the validated recap. `recaps.validation_status` lets a
--   rejected attempt be recorded for debugging without ever being served - a row with
--   validation_status != 'valid' must never be read back by the application as a real recap.
-- - Timestamps are ISO 8601 TEXT, consistent with the rest of the codebase (Date#toISOString).
-- - CHECK constraints encode the same enums as the TypeScript domain types, so a malformed
--   row can't silently exist even though D1/SQLite has no native enum type.

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  canonical_title TEXT NOT NULL,
  subtitle TEXT,
  authors_json TEXT NOT NULL,
  description TEXT,
  language TEXT,
  cover_url TEXT,
  metadata_provider TEXT NOT NULL CHECK (metadata_provider IN ('mock', 'google', 'synthetic')),
  metadata_provider_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE editions (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books (id),
  isbn_10 TEXT,
  isbn_13 TEXT,
  publisher TEXT,
  publication_date TEXT,
  page_count INTEGER,
  format TEXT CHECK (format IN ('hardcover', 'paperback', 'ebook', 'audiobook')),
  language TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_editions_book_id ON editions (book_id);
CREATE INDEX idx_editions_isbn_13 ON editions (isbn_13);
CREATE INDEX idx_editions_isbn_10 ON editions (isbn_10);

-- Placeholder for future accounts (Phase 2). Guest/local mode does not use this table.
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  display_name TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE library_items (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles (id),
  edition_id TEXT NOT NULL REFERENCES editions (id),
  status TEXT NOT NULL CHECK (status IN ('want_to_read', 'reading', 'paused', 'finished')),
  progress_type TEXT CHECK (progress_type IN ('chapter', 'percentage', 'page')),
  progress_value REAL,
  chapter_ordinal INTEGER,
  page_number INTEGER,
  percentage REAL,
  mapped_boundary_segment_ordinal INTEGER,
  mapping_confidence TEXT CHECK (mapping_confidence IN ('exact', 'high', 'medium', 'low')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_library_items_profile_id ON library_items (profile_id);
CREATE INDEX idx_library_items_edition_id ON library_items (edition_id);

CREATE TABLE source_documents (
  id TEXT PRIMARY KEY,
  edition_id TEXT REFERENCES editions (id),
  source_type TEXT NOT NULL CHECK (source_type IN ('synthetic', 'epub', 'txt')),
  processing_status TEXT NOT NULL CHECK (
    processing_status IN ('pending', 'processing', 'ready', 'failed')
  ),
  source_hash TEXT,
  chapter_count INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  source_document_id TEXT NOT NULL REFERENCES source_documents (id),
  ordinal INTEGER NOT NULL,
  title TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_chapters_source_document_id ON chapters (source_document_id, ordinal);

CREATE TABLE segments (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters (id),
  source_document_id TEXT NOT NULL REFERENCES source_documents (id),
  ordinal INTEGER NOT NULL,
  chapter_ordinal INTEGER NOT NULL,
  start_percentage REAL,
  end_percentage REAL,
  text_hash TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_segments_source_document_ordinal ON segments (source_document_id, ordinal);
CREATE INDEX idx_segments_chapter_id ON segments (chapter_id);

CREATE TABLE story_snapshots (
  id TEXT PRIMARY KEY,
  source_document_id TEXT NOT NULL REFERENCES source_documents (id),
  boundary_segment_id TEXT NOT NULL REFERENCES segments (id),
  boundary_segment_ordinal INTEGER NOT NULL,
  boundary_label TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  prompt_version TEXT,
  model TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_story_snapshots_source_document_boundary
  ON story_snapshots (source_document_id, boundary_segment_ordinal);

CREATE TABLE recaps (
  id TEXT PRIMARY KEY,
  library_item_id TEXT NOT NULL REFERENCES library_items (id),
  source_document_id TEXT NOT NULL REFERENCES source_documents (id),
  boundary_segment_ordinal INTEGER NOT NULL,
  detail_level TEXT NOT NULL CHECK (detail_level IN ('quick', 'standard', 'detailed')),
  recap_json TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT,
  prompt_version TEXT,
  validation_status TEXT NOT NULL CHECK (
    validation_status IN (
      'valid',
      'schema_invalid',
      'unknown_segment',
      'future_segment_reference',
      'book_mismatch',
      'boundary_mismatch',
      'unsupported_claim',
      'unsafe_content'
    )
  ),
  created_at TEXT NOT NULL
);

CREATE INDEX idx_recaps_library_item_created_at ON recaps (library_item_id, created_at);
