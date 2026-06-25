import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: no R2 incremental cache yet (Phase 1 has no R2 bucket provisioned).
// Add `incrementalCache: r2IncrementalCache` from
// "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache" once an R2
// bucket exists - see docs/DEPLOYMENT.md and https://opennext.js.org/cloudflare/caching.
export default defineCloudflareConfig();
