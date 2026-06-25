# PageCue — Roadmap

Tracked against the implementation sequence in the build prompt (§39) and the Phase definitions (§7–8).

## Completed

- Repository inspection and documentation foundation (this session).
- Next.js 16 / TypeScript / Tailwind v4 / ESLint application foundation, design tokens, light & dark themes, responsive app shell, skip link, reduced-motion support.
- Core domain types and provider/repository interfaces: books, library items, reading progress, story segments/snapshots, recap schema, `BookSearchProvider`/`RecapProvider`/`LibraryRepository`/`StorySourceRepository`.
- Synthetic six-chapter demonstration novel ("The Lanternkeeper's Atlas") with six cumulative snapshots, supported boundaries, and deterministically derived mock recaps.
- Deterministic spoiler-safety validator with malicious-fixture and legitimate-recap test coverage (38 unit tests).
- Mock recap provider and synthetic story-source repository, orchestrated by `generateValidatedRecap` behind a validated `POST /api/recap` route with basic in-memory rate limiting.
- Guest shelf local repository (versioned `localStorage`, schema-validated, corrupt-data recovery, seeded with the demo book).
- Complete vertical slice: landing page → guest mode (`/app`, shelf dashboard) → demo book detail (`/library/[id]`) → progress editor with boundary confirmation (`/library/[id]/progress`) → recap setup and result (`/library/[id]/recap`), with boundary label and confidence always shown.
- Baseline security headers (CSP, frame protection, referrer/permissions policy) and a PWA manifest (`src/app/manifest.ts`).
- Brand identity integrated: logo in header/landing/favicon/manifest icons/Open Graph image, and `--primary`/`--accent` design tokens re-themed to the logo's navy/teal.
- ISBN utilities (normalize, validate ISBN-10/13, convert, format, classify search input) with unit tests.
- Mock book search (`MockBookSearchProvider` + `/search` page) matching by title/author/ISBN, with mock catalogue fixtures covering missing metadata and multi-edition warnings.
- Add-to-shelf from search and remove-from-shelf from both the shelf dashboard and book detail page.
- Playwright e2e coverage (desktop + mobile viewports) for the landing page, the full guest-mode recap flow, shelf persistence across reload, keyboard reachability, search, ISBN search, multi-edition warnings, add/remove-from-shelf, and reading-status editing (22 e2e runs total) - scoped to the flows that exist today, not yet the full 20-step flow in build prompt §31.3.
- Server-side `GoogleBooksProvider`: normalizes Google's response into PageCue's own book/edition shape, dedupes repeated volumes, flags multi-edition works, handles missing covers/descriptions/page counts/ISBNs, applies a bounded request timeout with no retry loop, and falls back to the mock provider with a logged warning if `BOOK_SEARCH_PROVIDER=google` is set without `GOOGLE_BOOKS_API_KEY`.
- Editable reading status (want to read / reading / paused / finished) directly from the book detail page.
- Real AI recap provider: `GeminiRecapProvider` against Google's Gemini API, chosen specifically for its free usage tier so PageCue can stay free to run (see `docs/DECISIONS.md`). Same bounded-timeout/no-retry/graceful-fallback-to-mock pattern as `GoogleBooksProvider`. Its output is never trusted more than the mock provider's - it passes through the identical `validateRecap`, proven by a dedicated "defense in depth" test.
- Connected the repository to its GitHub remote (`github.com/theantipopau/pagecue`) and pushed `main`.
- Live-tested `GeminiRecapProvider` end-to-end with a real API key and switched the default model to `gemini-2.5-flash` after discovering `gemini-2.0-flash` has a hard zero free-tier quota on at least one real project (see `docs/DECISIONS.md`). Hardened `playwright.config.ts` to force mock providers for e2e regardless of real keys in `.env.local`.
- Recap history: every successfully validated recap is saved per shelf item in `localStorage` (capped at 20 entries, versioned, schema-validated, corrupt-data recovery), with a "Previously generated" list on the recap setup screen offering "View" (redisplays the stored recap without a new API call) and "Clear history".
- Settings page (`/settings`): theme toggle, a plain explanation of exactly what's stored locally and what would be sent to an external provider if configured, and a "Reset demo data" action that clears the shelf and all recap history back to just the seeded demo book.
- About page (`/about`): product positioning (what PageCue is/isn't), a plain-language explanation of how the spoiler boundary and validator work, why recap support depends on real structured data, and a copyright/legal disclaimer per build prompt §38. Linked from the header nav and the footer's "Learn more".

## In progress / immediately next

- D1 migrations + `D1LibraryRepository` / `D1StorySourceRepository`, Cloudflare Workers/OpenNext deployment, Wrangler configuration. (Cloudflare Workers AI, also free-tier, is a candidate alternative/companion to Gemini once this stage begins - see `docs/DECISIONS.md`.)

## Planned

- `OpenAIRecapProvider`/`AnthropicRecapProvider` as alternative real recap providers behind the existing `RecapProvider` interface, if ever needed - not a priority given Gemini's free tier already covers the "real provider" need.
- Service worker for offline app-shell/guest-shelf caching (manifest exists; service worker does not yet).

## Deferred (explicitly out of scope until a later phase)

Accounts/auth, payments, social features, publisher dashboards, EPUB/PDF ingestion, audiobook sync, native mobile apps, vector search — see build prompt §7.2 and §8 for full phase breakdown (Phase 2: accounts + private ingestion; Phase 3: physical-book edition mapping; Phase 4: licensed catalogue; Phase 5: cross-platform/audio integrations).

## Completion criteria for "Phase 1 done"

See build prompt §40 in full. Not yet satisfied: D1/Cloudflare, service worker, the full 20-step Playwright flow. Satisfied so far: local-credential-free run, landing page, guest mode, book search (mock and real Google Books), shelf add/remove/status-editing, demo novel, boundary selection, three-tier recap generation (mock and real Gemini) with displayed boundary/confidence and saved history, settings/about pages, unit- and e2e-tested spoiler rejection, light/dark themes with brand-accurate colors, passing lint/typecheck/unit-test/e2e-test/build for the code that exists.
