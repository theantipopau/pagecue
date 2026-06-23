# PageCue — AI Recap Pipeline

## Overview

```
Source ingestion → Segmenting → Snapshot construction → Boundary selection
  → Recap generation → Structured output → Validation → Display / safe rejection
```

## Source ingestion (future phases)

Phase 1 has a single, hand-authored synthetic source (`src/data/demo`). Phase 2 introduces private EPUB/TXT ingestion with chapter detection and manual correction (build prompt §8, Phase 2) — not implemented yet.

## Segmenting

A book is split into ordered `StorySegment`s, each tagged with `chapterOrdinal` and `segmentOrdinal`. Segments are the smallest addressable unit for spoiler boundaries — a chapter may be several segments. The demo novel defines six chapters, each as one segment (`src/data/demo/segments.ts`), which is sufficient to prove boundary logic; finer-grained segmentation can be introduced later without changing the pipeline.

## Snapshot construction

A `StorySnapshot` is the cumulative, reader-safe state of the story _as of_ a given `boundarySegmentOrdinal` — characters known so far, their current (not future) state, locations introduced so far, events that have happened, and threads that are open vs. resolved at that point. Snapshots are strictly additive and never retroactively edited with future knowledge (build prompt §16, §4.3). In Phase 1 these are hand-authored per supported boundary; later phases generate them from ingested+segmented source text.

## Boundary selection

`src/domain/progress/boundary.ts` maps a user's entered progress (chapter/percentage/page) to the nearest **supported boundary at or before** that position — never after. If the entered position falls between two supported boundaries, the earlier one is chosen automatically; the user may always choose to go earlier, never later (build prompt §22). Page-based progress against the demo book is explicitly labeled approximate unless an exact edition-to-page map exists.

## Recap generation

`RecapProvider.generateRecap(input)` receives only:

- Book title
- Detail level (`quick` | `standard` | `detailed`)
- Boundary label
- The `StorySnapshot` at that boundary
- The list of allowed segment IDs (≤ boundary)
- Output schema instructions

It never receives later snapshots, the full book, or a request to "recall" the book from general knowledge. `MockRecapProvider` (Phase 1 default) looks up a pre-authored response keyed by `(sourceDocumentId, boundaryOrdinal, detailLevel)` from `src/data/demo/mock-recaps.ts` — fully deterministic, no network call. A real provider (Stage 11) sits behind the identical interface and is given the system instruction in build prompt §19 verbatim, with low-variance sampling, a bounded timeout, and no provider-side storage where supported.

## Structured output

Output must conform to `RecapSchema` (`src/domain/recap/schema.ts`, Zod). Every character entry, situation point, and unresolved thread must cite ≥1 `supportingSegmentIds`. Schema validity alone is not treated as safety.

## Validation

`src/domain/recap/validator.ts` implements `validateRecap()` deterministically (no model call) per `docs/SPOILER_SAFETY.md`. It is run on every recap — mock or real — before anything is returned to the API caller.

## Failure handling

On schema failure, validator rejection, provider timeout, or provider error, the API returns a typed `RecapValidationResult`/error with a safe, user-facing message. The previously confirmed boundary is preserved so the user can retry without re-entering progress. No raw provider error or source text is logged or shown.

## Prompt versioning

`src/domain/recap/prompt-version.ts` exports a `RECAP_PROMPT_VERSION` constant. Stored alongside generated recaps (`recaps.prompt_version` in the future D1 schema) so changes to the system instruction can be correlated with output quality over time. The mock provider also stamps this version for consistency, even though it isn't prompting anything.

## Model-provider abstraction

`RecapProvider` is the only interface the rest of the app depends on. Swapping `MockRecapProvider` for a real provider is a config change (`RECAP_PROVIDER` env var), not a UI or domain change.
