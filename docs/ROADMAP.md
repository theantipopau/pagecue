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
- Playwright e2e coverage (desktop + mobile viewports) for the landing page, the full guest-mode recap flow, shelf persistence across reload, keyboard reachability, search, ISBN search, multi-edition warnings, and add/remove-from-shelf (20 e2e runs total) - scoped to the flows that exist today, not yet the full 20-step flow in build prompt §31.3.

## In progress / immediately next

- Server-side `GoogleBooksProvider` with normalization and graceful fallback to mock.
- Editable reading status from the UI (currently only advances implicitly when progress is first set).

## Planned

- D1 migrations + `D1LibraryRepository` / `D1StorySourceRepository`, Cloudflare Workers/OpenNext deployment, Wrangler configuration.
- Real AI recap provider (OpenAI or Anthropic) behind the existing `RecapProvider` interface, reusing the same validator.
- Recap history view for the demo book.
- Settings/About pages (theme, privacy explanation, demonstration-mode disclosure).
- Service worker for offline app-shell/guest-shelf caching (manifest exists; service worker does not yet).

## Deferred (explicitly out of scope until a later phase)

Accounts/auth, payments, social features, publisher dashboards, EPUB/PDF ingestion, audiobook sync, native mobile apps, vector search — see build prompt §7.2 and §8 for full phase breakdown (Phase 2: accounts + private ingestion; Phase 3: physical-book edition mapping; Phase 4: licensed catalogue; Phase 5: cross-platform/audio integrations).

## Completion criteria for "Phase 1 done"

See build prompt §40 in full. Not yet satisfied: Google Books integration, D1/Cloudflare, service worker, the full 20-step Playwright flow. Satisfied so far: local-credential-free run, landing page, guest mode, mock book search, shelf add/remove, demo novel, boundary selection, three-tier recap generation with displayed boundary/confidence, unit- and e2e-tested spoiler rejection, light/dark themes with brand-accurate colors, passing lint/typecheck/unit-test/e2e-test/build for the code that exists.
