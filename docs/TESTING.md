# PageCue — Testing

## Tooling

- **Unit / integration:** Vitest (`npm run test`, `npm run test:watch`).
- **End-to-end:** Playwright (`npm run test:e2e`) — added once enough UI exists to script a full flow; see `docs/ROADMAP.md` for status.
- **Static checks:** ESLint (`npm run lint`), TypeScript (`npm run typecheck`).

## Unit test coverage (current + planned per build prompt §31.1)

- ISBN normalization, ISBN-10/13 checksum validation, search-text-vs-ISBN classification (`src/lib/isbn`).
- Google Books result normalization, duplicate-edition handling, missing-metadata handling (`src/providers/book-search`) — added in the metadata-integration stage.
- Reading progress validation, safe boundary selection (always the earlier supported boundary), `mappingConfidence` derivation (`src/domain/progress`).
- Story snapshot retrieval restricted to ≤ boundary (`src/repositories/story-source`).
- Recap schema validation and every spoiler-validator rejection reason (`src/domain/recap`).
- Local library repository persistence, schema versioning/migration, corrupt-data recovery (`src/repositories/library`).
- Environment configuration parsing (`src/config/env.ts`).

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

Full 20-step flow is the target once shelf, search, and metadata pages exist. The vertical slice in this session focuses unit coverage on the recap/safety core; the first Playwright spec (`tests/e2e/demo-recap-flow.spec.ts`) covers the slice that does exist: landing → guest mode → demo book → boundary confirmation → quick/standard/detailed recap → boundary display. Remaining flows are tracked in `docs/ROADMAP.md` and added alongside the pages that make them meaningful (no point scripting a flow against a page that doesn't exist yet).

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
