import type { SegmentId, StorySnapshot } from "../story/types";
import type { RecapDetailLevel, Recap } from "./schema";

export interface GenerateRecapInput {
  bookTitle: string;
  detailLevel: RecapDetailLevel;
  boundaryLabel: string;
  snapshot: StorySnapshot;
  allowedSegmentIds: SegmentId[];
}

export interface RecapProvider {
  generateRecap(input: GenerateRecapInput): Promise<Recap>;
}
