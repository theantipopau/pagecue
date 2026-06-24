# PageCue — Testing

## Tooling

- **Unit / integration:** Vitest (`npm run test`, `npm run test:watch`).
- **End-to-end:** Playwright (`npm run test:e2e`) — added once enough UI exists to script a full flow; see `docs/ROADMAP.md` for status.
- **Static checks:** ESLint (`npm run lint`), TypeScript (`npm run typecheck`).

## Unit test coverage (current + planned per build prompt §31.1)

- ISBN normalization, ISBN-10/13 checksum validation, ISBN-10→13 conversion, display formatting, and search-text-vs-ISBN classification (`src/lib/isbn`).
- Mock book search matching by title/author/ISBN, multi-edition results, and missing-cover/page-count/ISBN handling (`src/providers/book-search`). Google Books result normalization and duplicate-edition handling against a real provider are planned for the metadata-integration stage.
- Reading progress validation, safe boundary selection (always the earlier supported boundary), `mappingConfidence` derivation (`src/domain/progress`).
- Story snapshot retrieval restricted to ≤ boundary (`src/repositories/story-source`).
- Recap schema validation and every spoiler-validator rejection reason (`src/domain/recap`).
- Local library repository persistence, schema versioning/migration, corrupt-data recovery (`src/repositories/library`).
- Environment configuration parsing (`src/config/env.ts`).

68 unit tests currently pass across 5 test files.

## Malicious spoiler fixtures (build prompt §31.2)

`src/data/demo/malicious-fixtures.ts` defines one adversarial `RecapSchema`-shaped object per rejection reason:

| Fixture                          | Expected rejection                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `futureSegmentRecap`             | `FUTURE_SEGMENT_REFERENCE`                                                                     |
| `unknownSegmentRecap`            | `UNKNOWN_SEGMENT`                                                                              |
| `wrongBookSegmentRecap`          | `BOOK_MISMATCH`                                                                                |
| `prematurelyResolvedThreadRecap` | `UNSUPPORTED_CLAIM` (resolved-thread claim with no valid supporting evidence at this boundary) |
| `boundaryLabelMismatchRecap`     | `BOUNDARY_MISMATCH`                                                                            |
| `noEvidenceRecap`                | `SCHEMA_INVALID` (schema requires ≥1 supporting segment per claim)                             |

`src/domain/recap/__tests__/validator.test.ts` asserts every fixture is rejected with the exact reason above, and that the legitimate mock recaps in `src/data/demo/mock-recaps.ts` are all accepted.

## Playwright flows (build prompt §31.3 — staged)

The full 20-step flow is the target once Google Books integration and recap history exist. Two specs currently cover the flows that exist:

- `tests/e2e/demo-recap-flow.spec.ts` — landing → guest mode → demo book → boundary confirmation → quick/standard/detailed recap → boundary display → shelf persistence across reload → keyboard reachability.
- `tests/e2e/search-and-shelf.spec.ts` — title/author/ISBN search, multi-edition warnings, an honest empty state, add-to-shelf, and remove-from-shelf from both the shelf dashboard and the book detail page.

20 e2e runs currently pass (both specs × desktop and mobile viewports). Remaining flows (Google Books, recap history) are tracked in `docs/ROADMAP.md` and added alongside the pages that make them meaningful (no point scripting a flow against a page that doesn't exist yet).

## Quality commands

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

Run `lint`, `typecheck`, `test`, and `build` before declaring any milestone complete; results are reported honestly in `CHANGELOG.md` and the session summary, including any known-failing or skipped checks.
