# AGENTS.md

Agent-neutral standing instructions for any coding agent (not specific to Claude) working in this repository. See `CLAUDE.md` for the Claude-specific version of the same rules, and `docs/PAGECUE_CLAUDE_BUILD_PROMPT.md` for the full product brief.

## Product context

PageCue is a spoiler-safe reading companion. It helps readers resume books they've paused, without revealing anything beyond the point they've reached. It is not a general-purpose book summarizer and must never be made to behave like one.

## Rules that must not be weakened

- A recap may only be generated from an approved, structured story source (currently: the synthetic demo novel in `src/data/demo`). Never wire up a path that lets the AI provider use its own knowledge of a real book.
- Recap generation must receive only data at or below the user's confirmed boundary. Never pass a full book or a later snapshot "for context."
- Every recap must pass the deterministic validator (`src/domain/recap/validator.ts`) before being shown to a user. Treat schema-valid model output as untrusted until validated.
- The app must work with zero paid/external credentials in its default configuration (mock book search, mock recap, local shelf storage, synthetic story source).
- Keep all API keys and secrets server-side. Never read a secret in client-side code or expose it via a `NEXT_PUBLIC_*` variable.
- Be honest about uncertainty in the UI — approximate boundary mappings must say so; never imply exactness the data doesn't support.

## Working method

1. Read `docs/` before making structural changes.
2. Make cohesive, reviewable changes — don't mix unrelated refactors with feature work.
3. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` before declaring work finished; fix what they find.
4. Update `CHANGELOG.md` with specific entries (not "updated app") and record any expensive-to-reverse decision in `docs/DECISIONS.md`.
5. Do not commit `.env` files or secrets. `.env.example` documents variable names only.
