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

### Known limitations

- Without `GOOGLE_BOOKS_API_KEY`, book search only queries a small set of in-repo mock catalogue fixtures, not a real book database.
- No real AI recap provider yet - only the deterministic mock (by design for this phase).
- No D1/Cloudflare deployment artifacts yet.
- Recap history and settings/about pages are not yet implemented.
