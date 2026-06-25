# PageCue

**Remember the story. Resume the journey.**

PageCue is a spoiler-safe reading companion. Tell it where you stopped in a book, and it gives you a concise reminder of the story so far — characters, relationships, where things stand, and unresolved threads — using only information you've already reached. It never uses general knowledge of a real book to fabricate a summary, and it never shows you anything beyond your confirmed boundary.

See `docs/PRODUCT_SPEC.md` for the full product spec and `docs/SPOILER_SAFETY.md` for how the spoiler boundary is enforced.

## Current project status

Core experience complete: landing page → guest mode → book search (mock or real Google Books) → add/remove from shelf and edit reading status → reading-progress boundary confirmation → quick / standard / detailed recap generation (mock or real Gemini) and display, with the spoiler boundary and confidence always shown. D1/Cloudflare deployment is not yet implemented — see `docs/ROADMAP.md`.

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

| Variable                                                                    | Purpose                                                                                                       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_MODE`                                                      | `development` / `production` mode indicator (non-secret).                                                     |
| `NEXT_PUBLIC_SITE_URL`                                                      | Public origin for resolving absolute URLs (e.g. the social share image); defaults to `http://localhost:3000`. |
| `BOOK_SEARCH_PROVIDER`                                                      | `mock` (default) or `google`.                                                                                 |
| `RECAP_PROVIDER`                                                            | `mock` (default) or `gemini`; `openai`/`anthropic` are documented but not yet implemented.                    |
| `LIBRARY_REPOSITORY`                                                        | `local` (default, browser storage); `d1` is a future stage.                                                   |
| `STORY_SOURCE_REPOSITORY`                                                   | `synthetic` (default); `d1` is a future stage.                                                                |
| `GOOGLE_BOOKS_API_KEY`                                                      | Enables real book search if `BOOK_SEARCH_PROVIDER=google`.                                                    |
| `GEMINI_API_KEY` / `GEMINI_MODEL`                                           | Enables real recap generation if `RECAP_PROVIDER=gemini` (free tier; see below).                              |
| `OPENAI_API_KEY` / `OPENAI_MODEL`                                           | Alternative real recap provider (not yet implemented).                                                        |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL`                                     | Alternative real recap provider (not yet implemented).                                                        |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_DATABASE_ID` / `CLOUDFLARE_R2_BUCKET` | Future Cloudflare deployment (not yet implemented).                                                           |

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

Set `BOOK_SEARCH_PROVIDER=google` and `GOOGLE_BOOKS_API_KEY=<your key>` in `.env.local`, then restart the dev server. Search will query the real Google Books API server-side (the key is never sent to the browser); results are normalized into PageCue's own book/edition shape, and only the in-repo demo book will ever show recap support. If `BOOK_SEARCH_PROVIDER=google` is set without a key, PageCue logs a warning and falls back to the mock provider rather than breaking search.

## AI provider setup (optional)

Set `RECAP_PROVIDER=gemini` and `GEMINI_API_KEY=<your key>` in `.env.local` to generate recaps with a real model instead of the deterministic mock. Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — Gemini's free tier requires no payment method, which is why it was chosen over OpenAI/Anthropic (see `docs/DECISIONS.md`); PageCue is meant to stay free to run. Optionally set `GEMINI_MODEL` (defaults to `gemini-2.5-flash`; free-tier quota varies by model and project, so if one model returns a quota error, try another from [the model list](https://ai.google.dev/gemini-api/docs/models)). If `RECAP_PROVIDER=gemini` is set without a key, PageCue logs a warning and falls back to the mock provider. Every recap, from any provider, passes through the same deterministic spoiler-safety validator before display — see `docs/SPOILER_SAFETY.md`.

`OpenAIRecapProvider`/`AnthropicRecapProvider` are documented placeholders behind the same `RecapProvider` interface, not yet implemented.

## D1 / Cloudflare setup (future)

See `docs/DEPLOYMENT.md` for the planned Wrangler/D1/OpenNext setup. Not yet implemented.

## Testing

See `docs/TESTING.md`. Run `npm run test` for unit/integration coverage, including the spoiler-safety validator's rejection of every adversarial fixture in `src/data/demo/malicious-fixtures.ts`. Run `npm run test:e2e` for the Playwright suite covering the landing page and the full guest-mode recap flow on desktop and mobile viewports.

## Deployment

See `docs/DEPLOYMENT.md`.

## Known limitations

- Without `GOOGLE_BOOKS_API_KEY`, book search only queries a small set of in-repo mock catalogue fixtures, not a real book database.
- Without `GEMINI_API_KEY`, recap generation uses the deterministic mock provider rather than a real model.
- No D1/Cloudflare deployment artifacts exist yet.
- A PWA manifest exists (`src/app/manifest.ts`), but there is no service worker yet, so offline behavior is whatever the browser caches by default.
- Playwright e2e coverage exists for the flows that ship today (landing, guest mode, search, add/remove, status editing, demo recap flow, persistence, keyboard nav, mobile viewport), not the full 20-step flow in the build prompt, and does not exercise the real Google Books or Gemini APIs (both covered by unit tests with a mocked `fetch` instead).

## Roadmap

See `docs/ROADMAP.md`.
