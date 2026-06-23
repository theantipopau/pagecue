# PageCue — Roadmap

Tracked against the implementation sequence in the build prompt (§39) and the Phase definitions (§7–8).

## Completed

- Repository inspection and documentation foundation (this session).
- Next.js 16 / TypeScript / Tailwind v4 / ESLint application foundation, design tokens, light & dark themes.
- Core domain types: books, library items, reading progress, story segments/snapshots, recap schema.
- Synthetic six-chapter demonstration novel with cumulative snapshots, supported boundaries, and pre-authored mock recaps.
- Deterministic spoiler-safety validator with malicious-fixture test coverage.
- Mock recap provider and synthetic story-source repository.
- Guest shelf local repository (versioned `localStorage`, validated, corrupt-data recovery).
- First vertical slice: landing page → guest mode → demo book → boundary confirmation → quick/standard/detailed recap generation and display, with boundary + confidence shown.
- Unit tests for the recap/safety core and boundary selection.

## In progress / immediately next

- Book search page (mock provider) and result cards.
- Shelf dashboard (add/remove, status, progress editor UI) wired to the local repository.
- Book detail page with edition metadata display.
- Playwright coverage for the full 20-step flow in build prompt §31.3 as the corresponding pages land.

## Planned

- Server-side `GoogleBooksProvider` with normalization, ISBN utilities, and graceful fallback to mock.
- PWA manifest + minimal service worker (app shell + cached guest shelf).
- D1 migrations + `D1LibraryRepository` / `D1StorySourceRepository`, Cloudflare Workers/OpenNext deployment, Wrangler configuration.
- Real AI recap provider (OpenAI or Anthropic) behind the existing `RecapProvider` interface, reusing the same validator.
- Rate limiting abstraction applied to search and recap routes.
- Security headers (CSP, frame protection, etc.) in `next.config.ts`.
- Recap history view for the demo book.
- Settings/About pages (theme, privacy explanation, demonstration-mode disclosure).

## Deferred (explicitly out of scope until a later phase)

Accounts/auth, payments, social features, publisher dashboards, EPUB/PDF ingestion, audiobook sync, native mobile apps, vector search — see build prompt §7.2 and §8 for full phase breakdown (Phase 2: accounts + private ingestion; Phase 3: physical-book edition mapping; Phase 4: licensed catalogue; Phase 5: cross-platform/audio integrations).

## Completion criteria for "Phase 1 done"

See build prompt §40 in full. Not yet satisfied: search, shelf CRUD UI, Google Books integration, PWA manifest, D1/Cloudflare, Playwright e2e suite. Satisfied by this session: local-credential-free run, landing page, guest mode, demo novel, boundary selection, three-tier recap generation with displayed boundary/confidence, unit-tested spoiler rejection, light/dark themes, passing lint/typecheck/test/build for the code that exists.
