# CLAUDE.md

Standing instructions for Claude sessions working in this repository. Read this, `AGENTS.md`, and the files in `docs/` before making substantial changes. The authoritative product brief is `docs/PAGECUE_CLAUDE_BUILD_PROMPT.md`.

## Non-negotiable rules

1. **Never use general model knowledge as a story source.** Recap generation must use only the structured `StorySnapshot` data in `src/data/demo` (or a future approved structured source) — never the model's pre-existing knowledge of a real book.
2. **Never send a later snapshot or any segment above the confirmed boundary to recap generation.** `StorySourceRepository.getSnapshotAtBoundary` must remain the only retrieval path, and it must not be made to return future content.
3. **Never display an unvalidated recap.** Every recap, mock or real, must pass `validateRecap()` (`src/domain/recap/validator.ts`) before reaching the UI.
4. **Keep mock mode fully functional.** The app must run with zero external credentials at all times — `BOOK_SEARCH_PROVIDER=mock`, `RECAP_PROVIDER=mock`, `LIBRARY_REPOSITORY=local`, `STORY_SOURCE_REPOSITORY=synthetic` is the default and must keep working as the codebase grows.
5. **Keep secrets server-side.** No API key in a `NEXT_PUBLIC_*` variable or in client-bundled code.
6. **Don't fabricate recap availability.** If a book has no approved structured source, the UI must say recap is unavailable — never produce a best-effort summary from title/author/page alone.
7. **Run the checks before claiming a milestone is done:** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` (and `npm run test:e2e` once Playwright specs exist). Do not claim a check passed without having run it in this session.
8. **Update docs and `CHANGELOG.md` as you go**, not as an afterthought. Record expensive-to-reverse decisions in `docs/DECISIONS.md`.
9. **Preserve Cloudflare Workers compatibility** when adding dependencies — avoid Node-only APIs in code paths that will run on Workers (see `docs/DEPLOYMENT.md`).
10. **Don't overwrite existing work without understanding it first.** Inspect before replacing.
11. **Do not add `Co-Authored-By: Claude` (or similar AI co-author) trailers to commits in this repository.** The user asked for sole authorship on GitHub; see `docs/DECISIONS.md` (2026-06-25).

## Where things live

See `docs/ARCHITECTURE.md` for the full source structure and provider boundaries. Domain types: `src/domain/`. Synthetic novel: `src/data/demo/`. Validator: `src/domain/recap/validator.ts`. Local shelf: `src/repositories/library/local-library-repository.ts`.
