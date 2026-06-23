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
