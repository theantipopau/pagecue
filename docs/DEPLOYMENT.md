# PageCue — Deployment

## Local development (Phase 1, no credentials required)

```bash
npm install
npm run dev
```

Default `.env` (or no `.env` at all) runs entirely on mock providers, local storage, and the synthetic demo novel.

## Production build (local verification)

```bash
npm run build
npm run start
```

## Cloudflare Workers (target deployment, future stage)

PageCue is designed for the OpenNext Cloudflare adapter so the same Next.js app can run on Workers:

1. `npm install @opennextjs/cloudflare wrangler --save-dev` (added when Stage 10 begins).
2. Add `wrangler.toml`/`wrangler.jsonc` with a D1 binding (`DB`) and an R2 binding reserved for future uploads.
3. `wrangler d1 create pagecue` → record the database ID in `wrangler` config (not committed if the repo should stay portable — see `docs/DECISIONS.md` conventions).
4. Apply migrations locally: `wrangler d1 migrations apply pagecue --local`.
5. Apply migrations remotely: `wrangler d1 migrations apply pagecue --remote`.
6. Build for Workers: `npx opennextjs-cloudflare build`.
7. Run locally against the Workers runtime: `npx opennextjs-cloudflare preview`.
8. Deploy: `npx opennextjs-cloudflare deploy` (or `wrangler deploy` once built).
9. Set secrets (never commit values): `wrangler secret put GOOGLE_BOOKS_API_KEY`, `wrangler secret put OPENAI_API_KEY`, etc.

These commands are documented ahead of implementation so Stage 10 can follow them directly; the bindings, migrations, and adapter wiring are not yet present in this repository (see `docs/ROADMAP.md`).

## Environment variables

See `.env.example` for the full list. None are required for local/demo use; `GOOGLE_BOOKS_API_KEY`, `OPENAI_API_KEY`/`ANTHROPIC_API_KEY`, and the `CLOUDFLARE_*` values are only needed once those optional integrations are enabled.

## Known limitations

- No Cloudflare bindings exist yet in this repository — `wrangler` config and D1 migrations are a future stage, tracked in `docs/ROADMAP.md`.
- No CI pipeline is configured yet; `npm run lint`, `typecheck`, `test`, and `build` should be run manually before merging until one exists.
