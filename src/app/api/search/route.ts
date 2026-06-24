import { NextResponse } from "next/server";
import { z } from "zod";
import { getBookSearchProvider } from "@/config/providers";
import { checkRateLimit } from "@/lib/security/rate-limit";

const QuerySchema = z.object({
  q: z.string().min(1).max(200),
});

export async function GET(request: Request) {
  const clientKey = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`search:${clientKey}`, 60, 60_000)) {
    return NextResponse.json(
      {
        status: "rate_limited",
        message: "Too many searches. Please wait a moment and try again.",
      },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = QuerySchema.safeParse({ q: searchParams.get("q") ?? "" });
  if (!parsed.success) {
    return NextResponse.json(
      { status: "invalid_request", message: "Enter a search term." },
      { status: 400 },
    );
  }

  try {
    const provider = getBookSearchProvider();
    const response = await provider.search({ text: parsed.data.q });
    return NextResponse.json({ status: "ok", ...response });
  } catch (error) {
    console.error("book_search_provider_error", {
      message: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json(
      {
        status: "provider_error",
        message: "Book search is currently unavailable.",
      },
      { status: 503 },
    );
  }
}
