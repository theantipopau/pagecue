# PageCue — Accessibility

## Baseline commitments

- Semantic HTML throughout (`<nav>`, `<main>`, `<header>`, `<button>` not `<div onClick>`, etc.).
- Logical heading hierarchy per page (single `<h1>`, nested `<h2>`/`<h3>` in order — no skipped levels).
- Every form control has a visible, associated `<label>`; errors are associated via `aria-describedby` and announced.
- Buttons and links have descriptive, unique accessible names (no bare "Click here" / icon-only buttons without `aria-label`).
- Full keyboard operability for the primary flow (search → add → progress → recap) — no mouse-only interaction.
- A visible focus indicator (`--focus-ring` token) on every interactive element; `outline: none` is never used without a replacement.
- A skip-to-main-content link at the top of the page.
- AA color contrast for text/background pairings in both themes (verified against the tokens in `docs/DESIGN_SYSTEM.md`).
- Status updates (loading, saved progress, recap ready, validation failure) use `aria-live` regions so screen reader users are informed without focus being stolen.
- Cover images have descriptive `alt` text (`"Cover of {title} by {author}"`); purely decorative imagery uses empty `alt=""`.
- No information is conveyed by color alone — status badges pair color with text/icon (e.g. "Approximate" label, not just an amber dot).
- Touch targets are at least 44×44px on mobile layouts.
- Dialogs/modals (if introduced) trap focus and return focus to the triggering element on close.
- No functionality is hover-only; anything revealed on hover is also reachable via focus/keyboard.
- `prefers-reduced-motion: reduce` disables non-essential transitions (see `docs/DESIGN_SYSTEM.md`).

## Testing approach

- Manual keyboard walkthrough of the vertical slice (landing → guest mode → demo book → boundary selection → recap) before marking a milestone done.
- Automated checks: ESLint's `jsx-a11y`-equivalent rules via `eslint-config-next`'s core-web-vitals set, plus targeted unit tests where accessibility is logic-dependent (e.g. error message association).
- Playwright flows (`docs/TESTING.md`) include an explicit keyboard-navigation pass and a mobile-viewport pass.

## Known gaps (to revisit)

- No automated axe-core/Lighthouse CI integration yet — recommended as a Stage 12 follow-up once more pages exist.
- Screen-reader manual testing (NVDA/VoiceOver) has not been performed in this session; only structural/semantic correctness and keyboard operability have been verified.
