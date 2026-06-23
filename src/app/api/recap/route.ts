import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getKnownSegments,
  getRecapProvider,
  getStorySourceRepository,
} from "@/config/providers";
import { generateValidatedRecap } from "@/domain/recap/generate-validated-recap";
import { RecapDetailLevelSchema } from "@/domain/recap/schema";
import { checkRateLimit } from "@/lib/security/rate-limit";

const RequestSchema = z.object({
  bookId: z.string().min(1),
  bookTitle: z.string().min(1),
  boundarySegmentOrdinal: z.number().int().positive(),
  detailLevel: RecapDetailLevelSchema,
});

export async function POST(request: Request) {
  const clientKey = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`recap:${clientKey}`, 30, 60_000)) {
    return NextResponse.json(
      {
        status: "rate_limited",
        message: "Too many recap requests. Please wait a moment and try again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "invalid_request", message: "Malformed request body." },
      { status: 400 },
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { status: "invalid_request", message: "Invalid recap request." },
      { status: 400 },
    );
  }

  const outcome = await generateValidatedRecap(parsed.data, {
    storySourceRepository: getStorySourceRepository(),
    recapProvider: getRecapProvider(),
    knownSegments: getKnownSegments(),
  });

  return NextResponse.json(outcome);
}
