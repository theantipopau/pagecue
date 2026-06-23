# PageCue — Security and Privacy

## Secrets

- All API keys (`GOOGLE_BOOKS_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, Cloudflare credentials) are server-only environment variables, never `NEXT_PUBLIC_*`.
- `.env*` is git-ignored; `.env.example` documents every variable name with no real values.
- Server errors return safe, generic messages — never the underlying provider error body or a stack trace.

## Input validation

Every system boundary validates with Zod before use: search queries, ISBN strings, library item IDs, progress values, recap detail levels, boundary ordinals, provider responses (Google Books, recap provider), and parsed environment variables (`src/config/env.ts`).

## Output safety

- Recap and all AI-influenced text is rendered as plain text/React children — `dangerouslySetInnerHTML` is never used for provider or model output.
- User-supplied values are rendered through normal JSX escaping, never string-concatenated into HTML.
- There is no SQL in Phase 1 (no DB yet); the documented future D1 access (`docs/DATA_MODEL.md`) is parameterized-query-only by design, no string-built SQL.

## Error handling

- Typed errors/results (e.g. `RecapValidationResult`) replace thrown exceptions at user-facing boundaries.
- Validation errors (4xx-shaped, user actionable) are distinguished from service outages (5xx-shaped, retry-suggested).
- No stack traces reach the client in any environment.

## HTTP protections

Configured in `next.config.ts` headers (added during Stage 3/7 hardening): `X-Content-Type-Options: nosniff`, a restrictive `Content-Security-Policy`, `Referrer-Policy: strict-origin-when-cross-origin`, frame protection (`X-Frame-Options: DENY` / `frame-ancestors 'none'`), and a conservative `Permissions-Policy`. HSTS is applied in production deployment (Cloudflare/Workers handles TLS termination).

## Rate limiting

`src/lib/security/rate-limit.ts` defines a minimal abstraction (token-bucket-style, in-memory for local dev) applied to book search and recap generation routes. Production guidance: use Cloudflare's native rate limiting rules or a Workers KV/D1-backed limiter keyed by IP + route, documented for Stage 10.

## Privacy

- Guest shelf data is stored **locally in the browser only** in Phase 1 — it is not synced to any server, and the UI says so explicitly (clearing browser data removes it).
- External metadata searches (when Google Books is configured) send the search query to Google; this is disclosed in `/about` and `/settings`.
- AI recap generation uses only approved structured story-state data — never raw uploaded text, and Phase 1 has no upload feature at all.
- Future private-upload features (Phase 2) will require the user to affirm lawful access and will ship with deletion controls before release — not retrofitted after.
- Raw commercial book text is never logged, and Phase 1 never stores any commercial book text at all (only the original synthetic demo novel).
- Generated recaps are framed as personal memory aids, not redistributable content.
- No legal guarantee is made anywhere in the product copy; a visible note states that publisher licensing and copyright legal review are required before any commercial-catalogue launch (build prompt §38).

## Reporting a concern

Until a formal security contact exists, file an issue in this repository describing the concern without including any private data.
