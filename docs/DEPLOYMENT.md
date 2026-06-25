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

## Cloudflare Workers (Stage 10, in progress)

PageCue uses the OpenNext Cloudflare adapter so the same Next.js app can run on Workers. `@opennextjs/cloudflare` and `wrangler` are installed; `wrangler.jsonc`, `open-next.config.ts`, and `migrations/0001_initial_schema.sql` already exist in this repository. What's left is account-specific and must be done by whoever owns the Cloudflare account:

1. `npx wrangler login` (opens a browser auth flow - cannot be scripted).
2. `npx wrangler d1 create pagecue` → copy the returned `database_id` into the `d1_databases[0].database_id` field in `wrangler.jsonc` (currently blank).
3. Apply migrations locally: `npm run db:migrate:local`.
4. Apply migrations to the real remote database: `npm run db:migrate:remote`.
5. Build for Workers: `npm run cf:build`.
6. Run locally against the actual Workers runtime (Miniflare): `npm run cf:preview`. Copy `.dev.vars.example` to `.dev.vars` first if you want real provider keys available to this build (wrangler reads `.dev.vars`, not `.env.local`).
7. Deploy: `npm run cf:deploy`.
8. Set production secrets one at a time (never commit values): `npx wrangler secret put GOOGLE_BOOKS_API_KEY`, `npx wrangler secret put GEMINI_API_KEY`, etc.

`LIBRARY_REPOSITORY=d1` and `STORY_SOURCE_REPOSITORY=d1` (selecting `D1LibraryRepository`/`D1StorySourceRepository` once they exist) are still future work - the migrations and bindings above are groundwork for that, not a complete D1 integration yet. See `docs/ROADMAP.md`.

R2 (incremental cache, future upload storage) and Workers AI (a candidate free-tier alternative to Gemini, see `docs/DECISIONS.md`) bindings are deliberately not wired up yet - add them to `wrangler.jsonc` only once there's a concrete consumer, per `open-next.config.ts`'s inline comment and https://opennext.js.org/cloudflare/caching.

### Local dev with Cloudflare bindings

`initOpenNextCloudflareForDev()` (from `@opennextjs/cloudflare`) would let plain `next dev` see Cloudflare bindings like D1 via Miniflare, but it is **not** wired into `next.config.ts` yet - doing so before `wrangler.jsonc`'s `database_id` is filled in would risk breaking the default zero-credential `npm run dev` for everyone (build prompt §4.4 is non-negotiable). Add it once step 2 above is done, and verify `npm run dev` still starts cleanly afterward.

## Environment variables

See `.env.example` for the full list (used by `next dev`/`next build`) and `.dev.vars.example` for the wrangler-local equivalent (used by `npm run cf:preview`). None are required for local/demo use; `GOOGLE_BOOKS_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`/`ANTHROPIC_API_KEY`, and the `CLOUDFLARE_*` values are only needed once those optional integrations are enabled.

## Known limitations

- `wrangler.jsonc`'s `database_id` is blank until a Cloudflare account owner runs `wrangler login` + `wrangler d1 create pagecue`. No D1 database exists yet.
- `D1LibraryRepository`/`D1StorySourceRepository` are not implemented yet - the schema and migration exist, but `LIBRARY_REPOSITORY`/`STORY_SOURCE_REPOSITORY` only support `local`/`synthetic` today.
- No actual deploy to Cloudflare has happened yet; the build/preview/deploy commands above are documented but unexercised in this repository.
- No CI pipeline is configured yet; `npm run lint`, `typecheck`, `test`, and `build` should be run manually before merging until one exists.
