# PageCue — Product Specification

**Tagline:** Remember the story. Resume the journey.

## User problem

Readers who pause books for days, weeks, or months lose track of characters, relationships, and unresolved plot threads. Returning to the book means either re-reading large sections or risking spoilers by searching online for a summary.

## Product promise

> Tell PageCue where you stopped, and receive a concise reminder containing only information you have already encountered.

PageCue is a companion to the original book, not a replacement for it, and not a general-purpose AI summarizer.

## Target users

- **The interrupted reader** — reads several books at once, pauses for days or weeks, avoids spoiler-risking summaries.
- **The busy reader** — needs a 10–30 second refresher before a short reading session.
- **The series reader** — needs character/relationship reminders across long genre fiction without future revelations.
- **The physical-book reader** — uses paperbacks/hardcovers, wants to scan an ISBN and enter a page or chapter.
- **The cross-platform reader** — tracks progress across physical books, Kindle, Kobo, Apple Books, Google Play Books, audiobooks, and library ebooks with one shelf.

## User stories (Phase 1)

1. As a reader, I can enter the app as a guest without creating an account.
2. As a reader, I can search for a book by title, author, or ISBN.
3. As a reader, I can add a book to my personal shelf with a reading status.
4. As a reader, I can record my progress as a chapter, percentage, or page.
5. As a reader, when my progress maps imprecisely to a story boundary, I'm told so and asked to confirm or choose an earlier boundary.
6. As a reader, I can request a quick, standard, or detailed recap of the demonstration novel up to my confirmed boundary.
7. As a reader, I can see exactly which boundary and confidence level produced my recap.
8. As a reader, if a book has no approved story source, I'm told recap is unavailable rather than receiving a fabricated summary.

## Functional requirements (Phase 1)

See `docs/ROADMAP.md` for staged delivery. In summary: guest shelf CRUD, mock + optional Google Books search, ISBN detection/validation, progress entry with safe boundary mapping, three-tier recap generation against a synthetic demo novel, deterministic spoiler-safety validation, responsive/accessible UI with light and dark themes, and PWA foundations.

## Non-functional requirements

- Runs locally with zero paid credentials (mock providers + synthetic data).
- Strict TypeScript, validated boundaries (Zod) at every external/system edge.
- WCAG-conscious accessibility baseline (semantic HTML, keyboard nav, focus states, reduced motion).
- Cloudflare Workers deployability via OpenNext (target architecture; see `docs/DEPLOYMENT.md`).
- No fabricated certainty: uncertain mappings are always labeled approximate.

## MVP scope

Defined in full in the build prompt §7.1. This vertical slice (first increment) covers: landing page, guest mode, the synthetic demo book, progress boundary selection, and deterministic mock recap generation/display — the smallest end-to-end path that proves the spoiler-safety model. Search, Google Books integration, shelf CRUD UI, D1/Cloudflare, and the real AI provider follow in subsequent stages (`docs/ROADMAP.md`).

## Non-goals (Phase 1)

Accounts, social login, payments, subscriptions, public profiles/reviews/ratings, book clubs, publisher dashboards, Kindle scraping, DRM circumvention, arbitrary PDF/EPUB ingestion, audiobook syncing, vector search, native mobile apps, push notifications, gamification, public summary sharing, full-text book storage, or a general chat interface.

## Terminology

| Term                        | Meaning                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| Story segment               | The smallest ordered unit of story content within a chapter; the atomic unit for spoiler boundaries.  |
| Boundary / boundary ordinal | The maximum segment ordinal a recap is allowed to use.                                                |
| Story snapshot              | The cumulative, reader-safe story state (characters, threads, events) as of a boundary.               |
| Supporting segment IDs      | The segment IDs that justify a specific factual claim in a recap; required on every claim.            |
| Detail level                | Quick, standard, or detailed recap length.                                                            |
| Confidence                  | How exactly the user's entered progress maps to a supported boundary (`exact`/`high`/`medium`/`low`). |

## Success indicators

See build prompt §37. Practically: a first-time user understands the product without explanation, can reach a recap from the demo book in under a minute, always sees the boundary that produced the recap, and a deliberately malicious recap fixture (referencing a future segment) is rejected by the validator rather than displayed.

## Risks

- **Legal/copyright risk** if recap generation were ever pointed at real commercial text without rights — mitigated by restricting Phase 1 to a synthetic novel only (see `docs/SPOILER_SAFETY.md` and build prompt §38).
- **False confidence risk** if page-to-boundary mapping is presented as exact when it isn't — mitigated by explicit confidence labeling.
- **Model drift risk** if a future AI provider injects outside knowledge — mitigated by the deterministic validator rejecting any unsupported claim regardless of provider.

## Future phases

Summarized in `docs/ROADMAP.md`; full detail in the build prompt §8.
