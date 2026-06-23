# PageCue

**Remember the story. Resume the journey.**

PageCue is a spoiler-safe reading companion. Tell it where you stopped in a book, and it gives you a concise reminder of the story so far — characters, relationships, where things stand, and unresolved threads — using only information you've already reached. It never uses general knowledge of a real book to fabricate a summary, and it never shows you anything beyond your confirmed boundary.

See `docs/PRODUCT_SPEC.md` for the full product spec and `docs/SPOILER_SAFETY.md` for how the spoiler boundary is enforced.

## Current project status

First vertical slice complete: landing page → guest mode → synthetic demonstration novel → reading-progress boundary confirmation → quick / standard / detailed recap generation and display, with the spoiler boundary and confidence always shown. The guest shelf is currently read-only (seeded with the demo book; no add/remove UI yet). Search, Google Books integration, D1/Cloudflare, and a real AI provider are not yet implemented — see `docs/ROADMAP.md`.

## Technology stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (CSS-first theme tokens)
- Zod for validation at every system boundary
- Vitest for unit/integration tests; Playwright for end-to-end tests (added as flows become meaningful)
- Target deployment: Cloudflare Workers via the OpenNext adapter, Cloudflare D1 (future), R2 reserved for future uploads

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables or credentials are required — the app runs entirely on mock providers, an in-browser guest shelf, and the synthetic demo novel.

## Environment variables

Copy `.env.example` to `.env.local` if you want to override defaults. All variables are optional for local/demo use:

| Variable                                                                    | Purpose                                                     |
| --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_APP_MODE`                                                      | `development` / `production` mode indicator (non-secret).   |
| `BOOK_SEARCH_PROVIDER`                                                      | `mock` (default) or `google`.                               |
| `RECAP_PROVIDER`                                                            | `mock` (default); real providers are a future stage.        |
| `LIBRARY_REPOSITORY`                                                        | `local` (default, browser storage); `d1` is a future stage. |
| `STORY_SOURCE_REPOSITORY`                                                   | `synthetic` (default); `d1` is a future stage.              |
| `GOOGLE_BOOKS_API_KEY`                                                      | Enables real book search if `BOOK_SEARCH_PROVIDER=google`.  |
| `OPENAI_API_KEY` / `OPENAI_MODEL`                                           | Future real recap provider (not yet implemented).           |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL`                                     | Future real recap provider (not yet implemented).           |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_DATABASE_ID` / `CLOUDFLARE_R2_BUCKET` | Future Cloudflare deployment (not yet implemented).         |

Never commit `.env` or `.env.local`.

## Commands

```bash
npm run dev          # start the dev server
npm run build        # production build
npm run start         # run the production build locally
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run test           # Vitest, single run
npm run test:watch    # Vitest, watch mode
npm run test:e2e      # Playwright (builds and starts the app, then runs e2e specs)
npm run format         # Prettier write
npm run format:check  # Prettier check
```

## Mock mode

Mock mode is the default and is not a degraded experience — it's how PageCue runs without any paid service, per `docs/PAGECUE_CLAUDE_BUILD_PROMPT.md` §4.4. The demo book, mock recaps, and local shelf are all designed to exercise the real spoiler-safety pipeline end to end.

## Google Books setup (optional)

Set `BOOK_SEARCH_PROVIDER=google` and `GOOGLE_BOOKS_API_KEY=<your key>` in `.env.local`. Not yet wired up in this slice — tracked in `docs/ROADMAP.md`.

## AI provider setup (optional, future)

A real `RecapProvider` (OpenAI or Anthropic) will sit behind the same interface as the mock provider once implemented (Stage 11 in `docs/ROADMAP.md`). It will never replace the deterministic spoiler-safety validator.

## D1 / Cloudflare setup (future)

See `docs/DEPLOYMENT.md` for the planned Wrangler/D1/OpenNext setup. Not yet implemented.

## Testing

See `docs/TESTING.md`. Run `npm run test` for unit/integration coverage, including the spoiler-safety validator's rejection of every adversarial fixture in `src/data/demo/malicious-fixtures.ts`. Run `npm run test:e2e` for the Playwright suite covering the landing page and the full guest-mode recap flow on desktop and mobile viewports.

## Deployment

See `docs/DEPLOYMENT.md`.

## Known limitations

- Search, add/remove-from-shelf UI, and Google Books integration are not yet built (the guest shelf currently only contains the seeded demo book).
- No real AI recap provider exists yet — only the deterministic mock.
- No D1/Cloudflare deployment artifacts exist yet.
- A PWA manifest exists (`src/app/manifest.ts`), but there is no service worker yet, so offline behavior is whatever the browser caches by default.
- Playwright e2e coverage exists for the current slice (landing, guest mode, demo recap flow, persistence, keyboard nav, mobile viewport) only, not the full 20-step flow in the build prompt.
- The PWA icon is a single large source image rather than a generated, size-optimized icon set.

## Roadmap

See `docs/ROADMAP.md`.
