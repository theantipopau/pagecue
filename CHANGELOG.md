# Changelog

All notable changes to PageCue are recorded here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- Documentation foundation: `README.md`, `CLAUDE.md`, `AGENTS.md`, and `docs/{PRODUCT_SPEC,ARCHITECTURE,DATA_MODEL,AI_RECAP_PIPELINE,SPOILER_SAFETY,DESIGN_SYSTEM,SECURITY_AND_PRIVACY,ACCESSIBILITY,TESTING,DEPLOYMENT,ROADMAP,DECISIONS}.md`.
- Application foundation: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, scaffolded via `create-next-app` and merged into the repository alongside existing `docs/` and `images/`.
- Editorial design system: warm-paper/charcoal light and dark themes via CSS custom properties, class-based dark mode toggle (`ThemeToggle`), reduced-motion support, skip link, and a responsive app shell (header/footer/nav).
- Core domain model: book, library item, reading progress, story segment/snapshot, and recap types (`src/domain/**`), plus the `BookSearchProvider`, `RecapProvider`, `LibraryRepository`, and `StorySourceRepository` interfaces from the architecture spec.
- Original synthetic demonstration novel, _The Lanternkeeper's Atlas_ by the fictional Mirela Voss: six chapters, five recurring characters, two locations, a central unresolved mystery, an evolving ally/suspect relationship, and one thread that resolves early and one that resolves late (`src/data/demo`).
- Six strictly cumulative story snapshots (one per chapter boundary) with characters, events, locations, and open/resolved threads that never reference information beyond their boundary.
- Deterministic spoiler-safety validator (`validateRecap`) rejecting unknown segments, future-segment references, cross-book segment references, boundary-label mismatches, unsupported/premature-resolution claims, and unsafe markup or future-oriented phrasing - never displays unvalidated model output.
- Deterministic recap derivation (`buildRecapFromSnapshot`) and a zero-credential `MockRecapProvider` that serves pre-derived quick/standard/detailed recaps for every supported boundary, still subject to full validation before display.
- `SyntheticStorySourceRepository` (book support + boundary-limited snapshot retrieval) and `LocalLibraryRepository` (versioned, schema-validated, corruption-recovering guest shelf in `localStorage`, seeded with the demo book).
- Safe boundary-mapping logic (`selectSafeBoundary`) for chapter/percentage/page progress that always chooses the earlier supported boundary and labels page-based mapping as approximate without an exact page map.
- First complete vertical slice: landing page -> guest mode (`/app`) -> demo book detail (`/library/[id]`) -> progress editor with boundary confirmation (`/library/[id]/progress`) -> recap setup and result (`/library/[id]/recap`), backed by a validated `POST /api/recap` route with basic in-memory rate limiting.
- Baseline security headers (CSP, frame protection, referrer policy, permissions policy) in `next.config.ts`; PWA manifest via `src/app/manifest.ts`.
- Unit tests (Vitest) for the spoiler-safety validator against six malicious fixtures and every legitimate demo recap, the safe-boundary-selection logic, and the local library repository's persistence/seed/corruption-recovery behavior (38 tests).
- End-to-end tests (Playwright, desktop + mobile viewports) covering the landing page, the full guest-mode recap flow, shelf persistence across reload, and keyboard reachability of the primary flow.

### Added (book search, shelf management, and brand identity)

- Brand identity applied throughout: the supplied PageCue logo (navy book/bookmark mark with a teal sparkle) now appears in the header, landing page, favicon, PWA manifest icons, and a generated Open Graph social-share image (`src/app/opengraph-image.tsx`). Re-themed `--primary`/`--accent` design tokens to the logo's actual navy/teal rather than the originally invented forest green (see `docs/DECISIONS.md`).
- ISBN utilities (`src/lib/isbn`): ISBN-10/13 normalization, checksum validation, ISBN-10→13 conversion, display formatting, and search-input classification (ISBN vs. ISBN-shaped-but-invalid vs. free text), with unit tests.
- `BookSearchProvider` interface and a deterministic `MockBookSearchProvider` matching by title/author substring or exact ISBN, backed by mock catalogue fixtures that exercise missing covers, missing page counts, missing ISBNs, and duplicate/multi-edition results - none of which claim recap support except the demo book.
- `/search` page: search by title, author, or ISBN; result cards with cover, metadata, edition-ambiguity warnings, and an honest "recap unavailable for this title" badge for every non-demo result; loading/error/empty states.
- Add-to-shelf from search results and remove-from-shelf from both the shelf dashboard and the book detail page (with a confirmation prompt), wired through the existing `LocalLibraryRepository`.
- `GET /api/search` route (rate-limited, Zod-validated) selecting the book search provider server-side, matching the existing `/api/recap` pattern.
- Fixed a hydration-mismatch warning: the inline theme script intentionally mutates `<html>`'s class before React hydrates (to avoid a light/dark flash), which is expected and now marked with `suppressHydrationWarning` rather than logging a spurious warning on every load.
- Extended the Playwright suite with a second spec (`tests/e2e/search-and-shelf.spec.ts`) covering search, ISBN search, multi-edition warnings, add-to-shelf, remove-from-shelf from both entry points, and the empty-results state (20 e2e runs total across desktop and mobile). Unit test count: 68.

### Added (Google Books integration and editable reading status)

- `GoogleBooksProvider` (`src/providers/book-search/google-books-provider.ts`): a server-only adapter over the real Google Books API, selected via `BOOK_SEARCH_PROVIDER=google` + `GOOGLE_BOOKS_API_KEY`. Normalizes Google's volume shape into PageCue's own book/edition types (independent of Google's response format), routes ISBN-classified queries as `isbn:<value>` lookups, deduplicates repeated volume IDs, and flags multiple editions of the same work the same way the mock provider does.
- Defensive handling for the real provider: a bounded 8-second request timeout with no retry loop, explicit handling for HTTP 429 and other non-OK statuses, unparseable JSON, and a Zod-validated response shape that degrades to an empty result set (not an error) on an unrecognized shape - matching the "validate provider responses" requirement in the build prompt.
- Graceful, logged fallback to the mock provider when `BOOK_SEARCH_PROVIDER=google` is set without `GOOGLE_BOOKS_API_KEY`, keeping the zero-credential default working even with a partially-set environment (`src/config/providers.ts`).
- Editable reading status (want to read / reading / paused / finished) directly from the book detail page, persisted through the existing `LocalLibraryRepository`.
- 10 new unit tests for `GoogleBooksProvider` (mocked `fetch`): normalization, missing title/cover/description/page-count/ISBN, deduplication, multi-edition flagging, ISBN-prefixed queries, non-OK status, network failure, and malformed response shape (78 unit tests total).
- One new Playwright test covering reading-status editing and its persistence across reload (22 e2e runs total).
- Connected the repository to its GitHub remote (`github.com/theantipopau/pagecue`) and pushed `main`.

### Added (real AI recap provider via Gemini's free tier)

- `GeminiRecapProvider` (`src/providers/recap/gemini-recap-provider.ts`): the first real `RecapProvider` implementation, selected via `RECAP_PROVIDER=gemini` + `GEMINI_API_KEY`. Chosen over OpenAI/Anthropic specifically because Gemini has a genuine free usage tier - PageCue is meant to stay free to run, not just free to develop against (see `docs/DECISIONS.md`).
- Sends the existing `RECAP_SYSTEM_INSTRUCTION`, the structured snapshot, and the allowed segment IDs to Gemini's REST API (no SDK dependency), using `generationConfig.responseSchema` to constrain JSON output, `temperature: 0.2` for low variance, a bounded 15-second timeout with no retry loop, and explicit handling for rate limits, non-OK statuses, error envelopes, blocked/empty output, and invalid JSON.
- Graceful, logged fallback to the mock provider when `RECAP_PROVIDER=gemini` is set without `GEMINI_API_KEY`, matching the existing Google Books fallback pattern.
- Defense in depth proven by test: Gemini's output is never trusted more than the mock provider's - a dedicated test feeds a fabricated Gemini response that cites a nonexistent segment through the real `validateRecap` and confirms it is still rejected (`UNKNOWN_SEGMENT`).
- 9 new unit tests for `GeminiRecapProvider` (87 unit tests total across 7 files).
- Verified live end-to-end with a real `GEMINI_API_KEY`: generated an actual chapter-4 recap through the running app, which passed validation and rendered correctly. Discovered the originally-chosen default model (`gemini-2.0-flash`) has a hard zero free-tier quota on at least one real project, while `gemini-2.5-flash` works - changed the default accordingly (see `docs/DECISIONS.md`).
- `playwright.config.ts` now forces `BOOK_SEARCH_PROVIDER=mock` / `RECAP_PROVIDER=mock` for the e2e web server regardless of any real keys in `.env.local`, so e2e stays deterministic and never spends real API quota.

### Added (recap history)

- Every successfully validated recap is now saved to a local, per-shelf-item history (`LocalRecapHistoryRepository`, versioned `localStorage`, schema-validated using the existing `RecapSchema`, corrupt-data recovery, capped at 20 entries per item to keep the payload modest).
- A "Previously generated" section appears on the recap setup screen once history exists, showing detail level, boundary label, and timestamp per entry, with "View" (redisplays the stored recap instantly, no API call or re-validation since it was only ever populated from already-validated recaps) and "Clear history".
- Extracted a shared `createId()` helper (`src/lib/create-id.ts`) used by both the library and recap-history repositories.
- 7 new unit tests for `LocalRecapHistoryRepository` (94 unit tests total across 8 files) and 1 new Playwright test covering generate → view from history → clear (24 e2e runs total).

### Added (settings and about pages)

- `/settings` page: theme toggle, a plain-language explanation of exactly what PageCue stores locally and what would be sent to an external provider if one is configured, and a "Reset demo data" action (clears the shelf and all recap history back to just the seeded demo book).
- `/about` page: product positioning (what PageCue is and isn't), a plain-language explanation of how the spoiler boundary and validator work, why recap support depends on real structured data rather than guessing from a title/author, and a copyright/legal disclaimer (build prompt §38).
- Added `clearAllHistory()` to `RecapHistoryRepository`, used by the settings reset action so it doesn't leave orphaned history behind for a removed item.
- Linked both pages from the header nav ("Settings") and the footer's "Learn more" (now points to `/about` instead of the homepage).
- 1 new unit test for `clearAllHistory()` (95 unit tests total) and a new Playwright spec, `tests/e2e/settings-and-about.spec.ts`, covering both pages and the reset action (32 e2e runs total).

### Added (D1/Cloudflare groundwork)

- Installed `wrangler` and `@opennextjs/cloudflare`. Scaffolded `wrangler.jsonc` and `open-next.config.ts` from the adapter's official template (D1 binding included, R2 cache/image-optimization bindings deliberately deferred until they have a real consumer).
- Wrote `migrations/0001_initial_schema.sql`: the full D1 schema from build prompt §24 (`books`, `editions`, `profiles`, `library_items`, `source_documents`, `chapters`, `segments`, `story_snapshots`, `recaps`), with foreign keys, indexes, and CHECK constraints mirroring the existing TypeScript domain enums.
- Added `cf:build` / `cf:preview` / `cf:deploy` / `db:migrate:local` / `db:migrate:remote` npm scripts and `.dev.vars.example` (wrangler's local-secrets file, distinct from `.env.local`).
- `wrangler.jsonc`'s `database_id` is deliberately left blank - creating the real D1 database requires `wrangler login`, an interactive browser auth flow that has to be done by the Cloudflare account owner, not in this session.
- Deliberately did **not** wire `initOpenNextCloudflareForDev()` into `next.config.ts` yet: doing so against a blank `database_id` could break the default zero-credential `npm run dev` for everyone (build prompt §4.4 is non-negotiable). Verified `npm run dev`/`build` are unaffected by the new Cloudflare files in this session.

### Known limitations

- Without `GOOGLE_BOOKS_API_KEY`, book search only queries a small set of in-repo mock catalogue fixtures, not a real book database.
- Without `GEMINI_API_KEY`, recap generation uses the deterministic mock provider rather than a real model.
- No D1 database exists yet - the migration is written but unapplied, and `D1LibraryRepository`/`D1StorySourceRepository` are not implemented. `LIBRARY_REPOSITORY`/`STORY_SOURCE_REPOSITORY` only support `local`/`synthetic` today.
- No actual Cloudflare deploy has happened yet.
