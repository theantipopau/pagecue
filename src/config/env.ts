import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_APP_MODE: z
    .enum(["development", "production"])
    .default("development"),
  BOOK_SEARCH_PROVIDER: z.enum(["mock", "google"]).default("mock"),
  RECAP_PROVIDER: z
    .enum(["mock", "gemini", "openai", "anthropic"])
    .default("mock"),
  LIBRARY_REPOSITORY: z.enum(["local", "d1"]).default("local"),
  STORY_SOURCE_REPOSITORY: z.enum(["synthetic", "d1"]).default("synthetic"),
});

export type AppEnv = z.infer<typeof EnvSchema>;

/**
 * Parses provider/mode selection from environment variables, defaulting to the
 * zero-credential local configuration on any missing or malformed value rather than
 * crashing the app over an env var typo.
 */
export function loadEnv(
  source: Partial<NodeJS.ProcessEnv> = process.env,
): AppEnv {
  const parsed = EnvSchema.safeParse({
    NEXT_PUBLIC_APP_MODE: source.NEXT_PUBLIC_APP_MODE,
    BOOK_SEARCH_PROVIDER: source.BOOK_SEARCH_PROVIDER,
    RECAP_PROVIDER: source.RECAP_PROVIDER,
    LIBRARY_REPOSITORY: source.LIBRARY_REPOSITORY,
    STORY_SOURCE_REPOSITORY: source.STORY_SOURCE_REPOSITORY,
  });
  return parsed.success ? parsed.data : EnvSchema.parse({});
}

export const appEnv = loadEnv();
