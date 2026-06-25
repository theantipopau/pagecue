# Decisions Log

Lightweight ADR-style record of decisions that are expensive or difficult to reverse. Reversible, routine implementation choices are not recorded here.

---

## 2026-06-23 — Initialize Next.js from scratch

**Context:** The repository contained only `docs/PAGECUE_CLAUDE_BUILD_PROMPT.md` and brand images. No existing application code or technology stack to preserve.

**Options considered:**

- Hand-roll a Next.js project file by file.
- Use `create-next-app` to scaffold, then merge into the existing repo.

**Choice:** Used `create-next-app@latest` (Next.js 16, App Router, TypeScript, Tailwind CSS v4, ESLint, `src/` directory, `@/*` import alias, npm) scaffolded in a temp directory, then merged into the repository root, preserving `docs/` and `images/`. This gives a correctly wired, current baseline (tsconfig, ESLint flat config, Tailwind v4 PostCSS plugin) rather than a hand-maintained approximation.

**Consequences:** The project tracks current Next.js/React/Tailwind majors (Next 16, React 19, Tailwind 4) rather than the slightly older versions implied by the build prompt's example stack. Tailwind v4 uses CSS-first theme configuration (`@theme` in `globals.css`) instead of `tailwind.config.js`.

**Revisit trigger:** If Cloudflare Workers/OpenNext adapter support lags behind Next 16, consider pinning to the latest Next version with confirmed OpenNext support before deployment.

---

## 2026-06-23 — Git repository initialized locally

**Context:** The directory was not a Git repository and had no Git identity configured (`git config user.*` was unset), which blocks any commit.

**Choice:** Ran `git init` and set **local-only** (not `--global`) `user.name`/`user.email` using the account email already visible in this environment's context, so commits have a real author. No global Git configuration was changed.

**Consequences:** Commit authorship in this repo reflects this local config until the user overrides it.

**Revisit trigger:** If the user has a different preferred commit identity, update local `git config` accordingly.

---

## 2026-06-23 — Phase 1 storage: local guest shelf only, no database

**Context:** Section 4.4 of the build prompt requires the app to work without paid services or a production database. Section 24 asks for D1 migrations to exist even though Phase 1 uses local storage.

**Choice:** Phase 1 ships a `localStorage`-backed `LibraryRepository` implementation behind the same interface a future `D1LibraryRepository` will implement. D1 migrations are deferred to the Cloudflare/D1 stage (Stage 10) rather than built speculatively before any consumer needs them, to avoid maintaining schema and adapter code with no execution path in Phase 1.

**Consequences:** `docs/DATA_MODEL.md` documents the intended D1 schema design so Stage 10 can implement it directly from documentation, but no migration files exist yet.

**Revisit trigger:** Before Stage 10 (Cloudflare/D1 integration) begins.

---

## 2026-06-23 — Recap provider: deterministic mock only in this slice

**Context:** Section 4.4 and Section 19 require the app to run without any AI provider credentials, with the mock provider as the default and a real provider added later behind the same interface.

**Choice:** This vertical slice implements only `MockRecapProvider`, which deterministically selects a pre-authored recap (from `src/data/demo`) matching the requested boundary and detail level, then runs it through the real spoiler-safety validator. No real LLM call exists yet. `OpenAIRecapProvider`/`AnthropicRecapProvider` are deferred to Stage 11.

**Consequences:** The validator is exercised against both legitimate and adversarial fixtures even though no live model is involved yet, proving the safety boundary independent of any specific AI vendor.

**Revisit trigger:** Stage 11, when a real provider is introduced.

---

## 2026-06-23 — "Premature resolution" detection uses evidence-set comparison, not NLU

**Context:** Build prompt §31.2 asks for a malicious fixture where a recap "claims an open thread is resolved too early." The validator (`src/domain/recap/validator.ts`) has no language understanding — it can only check segment-ID provenance — so it cannot literally verify a free-text claim's truth.

**Options considered:**

- Skip this check; rely only on segment-ID provenance checks.
- Add an LLM-based semantic check (a second model call to judge the first model's output).
- Add a deterministic, evidence-set-based heuristic.

**Choice:** The validator scans `currentSituation` text for a fixed list of resolution-claiming phrases (e.g. "is now resolved", "mystery is solved"). If found, it requires at least one of that claim's `supportingSegmentIds` to be in `resolvedThreadEvidenceSegmentIds` - the set of segment IDs that the snapshot's own `resolvedThreads` actually point to. A claim using resolution language without citing real resolution evidence is rejected as `UNSUPPORTED_CLAIM`.

**Consequences:** This catches the concrete fixture in `src/data/demo/malicious-fixtures.ts` (`prematurelyResolvedThreadRecap`) deterministically, with no model call and no risk of the _checker_ itself hallucinating. It is intentionally a narrow, keyword-based heuristic, not general claim verification - documented as a known limitation in `docs/SPOILER_SAFETY.md`.

**Revisit trigger:** If a real provider's output produces resolution claims that don't match these fixed phrases, expand the phrase list rather than introducing a second model-based judge (which would reintroduce the risk this check exists to avoid).

---

## 2026-06-24 — Re-themed `--primary`/`--accent` to match the actual brand mark

**Context:** The repository's `images/icon.png` and `images/header.png` are the real PageCue brand mark (navy book/bookmark glyph with a teal sparkle), supplied by the user. The initial design tokens used an invented muted-forest-green accent, which the build prompt allowed ("muted forest green, deep navy, or burgundy") but which didn't match the actual logo once it was incorporated into the UI.

**Choice:** Sampled the logo's real colors (navy ≈ `#1c2a66`, teal ≈ `#0e8c8a`/`#34d8c8`) and replaced `--primary` (navy in light mode, brightened teal in dark mode, since dark navy has poor contrast on a dark charcoal surface) and added a new `--accent`/`--accent-foreground` pair (teal) used for the "Recap available" brand badge. Semantic `--success`/`--warning`/`--danger` were left as conventional green/amber/red rather than overloaded with brand color, to keep status meaning unambiguous.

**Consequences:** `docs/DESIGN_SYSTEM.md`'s token table needs updating to match (tracked as a follow-up); all primary buttons and the brand badge now visually match the supplied logo in both themes.

**Revisit trigger:** If a future brand refresh changes the logo colors.

---

## 2026-06-25 — Google Books has no "work" ID; synthesized one from a title+author slug

**Context:** PageCue's domain model splits `BookSummary` (the work) from `BookEdition` (a specific printing), so the UI can warn when a search matches multiple editions of the same book. The Google Books volumes API has no equivalent "work" concept - every result is an independent `volume` with its own ID, even when two volumes are clearly the same book in different formats.

**Choice:** `normalizeGoogleVolume` derives a deterministic `book.id` as `google-work-<slug(title + first author)>`, so two volumes with the same title and first author collapse into the same `book.id` and get flagged `hasMultipleEditions`, mirroring how the mock provider already behaves. `edition.id` remains `google-volume-<google's volume id>`, which is always unique and used for shelf deduplication.

**Consequences:** This is a heuristic, not a guarantee - a reprint with a slightly different title or author ordering won't be grouped, and two unrelated books that coincidentally share a title and a same-named first author would be (wrongly) grouped. Accepted as a reasonable approximation for Phase 1; revisit if Google's API or a future licensed catalogue (Phase 4) provides a real work identifier.

**Revisit trigger:** If false groupings or missed groupings are reported, or when a licensed catalogue with real work IDs replaces this provider.

---

## 2026-06-25 — Connected the repository to its GitHub remote, no Claude co-author trailers

**Context:** The user created `github.com/theantipopau/pagecue` and asked for the local repository to be pushed there, explicitly requesting that Claude not appear as a contributor - only them.

**Choice:** Added the remote, renamed the local `master` branch to `main` (the repo was empty, so no conflict), and pushed. Before pushing, rewrote the four existing local-only commits (via `git filter-branch --msg-filter`) to strip the `Co-Authored-By: Claude Sonnet 4.6` trailer each commit message previously had - safe to do because nothing had been pushed anywhere yet, so no shared history was disturbed. Commit `Author`/`Committer` fields were already the user's own local git identity (see the 2026-06-23 "Git repository initialized locally" entry above), so only the trailer needed removing. Future commits in this repository omit the trailer.

**Consequences:** GitHub's contributor graph and commit list will show only the user as author. This instruction is repository-specific context for future sessions: do not add `Co-Authored-By: Claude` trailers to commits in this repository.

**Revisit trigger:** None expected; flag to the user if they ever ask to restore co-author attribution.

---

## 2026-06-25 — Real recap provider: Google Gemini, not OpenAI/Anthropic, because it must stay free to run

**Context:** The build prompt's suggested stack (§9, §11) names `OPENAI_API_KEY`/`ANTHROPIC_API_KEY` as the example real recap provider. Implementing the real provider was the next roadmap item, and the user explicitly added a new product requirement at this point: PageCue "will need to be a free product too - so use free APIs where possible." OpenAI and Anthropic have no ongoing free tier (trial credit only, then pay-per-token); Google's Gemini API has a genuinely free tier (no payment method required) that's generous enough for a low-traffic recap feature.

**Options considered:**

- Implement `OpenAIRecapProvider`/`AnthropicRecapProvider` as the build prompt's example suggests - rejected, since both would make every recap generation cost money once free trial credit runs out, conflicting with the new "free to run" requirement.
- Implement Cloudflare Workers AI - has a free daily allocation and would align with the already-planned Cloudflare deployment, but requires Cloudflare account credentials/bindings that don't exist yet (D1/Cloudflare integration hasn't started). Revisit once that stage begins.
- Implement a `GeminiRecapProvider` against Google's Gemini API - has a real, no-credit-card free tier today, requires only an API key (no infrastructure), and keeps the project in the same "Google" ecosystem already used for `GoogleBooksProvider`.

**Choice:** Built `GeminiRecapProvider` (`src/providers/recap/gemini-recap-provider.ts`) as the first real `RecapProvider` implementation, selected via `RECAP_PROVIDER=gemini` + `GEMINI_API_KEY`. It sends the existing `RECAP_SYSTEM_INSTRUCTION`, the structured snapshot, and the allowed segment IDs via Gemini's REST API (no SDK dependency, keeping it Workers-compatible), using `generationConfig.responseSchema` to constrain JSON output for reliability. Added `gemini` to the `RECAP_PROVIDER` enum alongside the still-unimplemented `openai`/`anthropic` placeholders, rather than replacing them, in case a user of this codebase later wants one of those instead.

**Consequences:** Critically, Gemini's output is **not** trusted any more than the mock provider's - `generateValidatedRecap` runs every recap, from any provider, through the same deterministic `validateRecap`. A dedicated test (`gemini-recap-provider.test.ts`, "defense in depth") proves a Gemini response citing a nonexistent segment is still rejected. Like `GoogleBooksProvider`, `RECAP_PROVIDER=gemini` without `GEMINI_API_KEY` falls back to the mock provider with a logged warning rather than breaking the app.

**Revisit trigger:** If Gemini's free tier terms change materially, or when Cloudflare Workers AI becomes available as an alternative free option once the D1/Cloudflare stage begins.

---

## 2026-06-25 — Default Gemini model changed to `gemini-2.5-flash` after a live free-tier quota test

**Context:** The user supplied a real `GEMINI_API_KEY` for live testing. With that key, `gemini-2.0-flash` (the original default) returned HTTP 429 with `RESOURCE_EXHAUSTED` and `limit: 0` for `generate_content_free_tier_requests` - not a transient rate limit, but a hard zero free-tier quota for that specific model on this project. A direct `curl` test confirmed `gemini-1.5-flash` is deprecated (404) and `gemini-2.5-flash` works (HTTP 200) on the free tier for this project.

**Choice:** Changed the `GeminiRecapProvider` constructor default and `.env.example`'s `GEMINI_MODEL` to `gemini-2.5-flash`. Verified end-to-end through the real app (not just a mocked unit test): generated an actual chapter-4 recap via the live API, which passed `validateRecap` and rendered correctly with the right spoiler boundary.

**Consequences:** Free-tier model availability is per-project and apparently inconsistent across Gemini model versions (confirmed empirically, not documented anywhere obvious) - a model that works on one Google account/project may return a zero quota on another. `.env.example` and `README.md` now note this and point to Google's model list if a chosen model returns a quota error.

**Revisit trigger:** If `gemini-2.5-flash`'s free tier is discontinued or quota changes; re-test with `curl` against the target model before changing the default again, since quota behavior isn't reliably documented.

---

## 2026-06-25 — D1/Cloudflare groundwork laid before account access exists

**Context:** Stage 10 (D1/Cloudflare) needs a real Cloudflare account: `wrangler login` opens a browser auth flow that cannot be done on the user's behalf, and creating a D1 database needs an authenticated session. The user chose to log in themselves and asked for everything else prepared first.

**Choice:** Installed `wrangler` and `@opennextjs/cloudflare`, wrote `migrations/0001_initial_schema.sql` (the full schema from build prompt §24 / `docs/DATA_MODEL.md`, as CREATE TABLE statements with CHECK constraints mirroring the TypeScript enums), and scaffolded `wrangler.jsonc` (using the adapter's own official template, in JSONC rather than TOML since that's what the template ships) with a D1 binding whose `database_id` is deliberately left blank rather than guessed. Added `cf:build`/`cf:preview`/`cf:deploy`/`db:migrate:local`/`db:migrate:remote` npm scripts and a `.dev.vars.example` (wrangler's local-secrets file, distinct from `.env.local`). Deferred R2 cache and image-optimization bindings - the official template includes them, but neither has a consumer yet in this app, so they were left out rather than wired up speculatively.

**Consequences:** `initOpenNextCloudflareForDev()` was deliberately **not** added to `next.config.ts` yet - wiring it in against a `wrangler.jsonc` with a blank `database_id` could break plain `npm run dev` for everyone, which must keep working with zero credentials per build prompt §4.4. It should be added once a real `database_id` exists, with `npm run dev` re-verified immediately after.

**Revisit trigger:** Once the user has run `wrangler login` + `wrangler d1 create pagecue`: fill in `database_id`, run `npm run db:migrate:local`, add `initOpenNextCloudflareForDev()` to `next.config.ts` and verify `npm run dev` still starts cleanly, then implement `D1LibraryRepository`/`D1StorySourceRepository`.
