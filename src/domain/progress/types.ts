export type ProgressType = "chapter" | "percentage" | "page";

export type MappingConfidence = "exact" | "high" | "medium" | "low";

export interface ReadingProgress {
  type: ProgressType;
  value: number;
  chapterOrdinal?: number;
  chapterLabel?: string;
  pageNumber?: number;
  percentage?: number;
  mappedBoundarySegmentOrdinal?: number;
  mappedBoundaryLabel?: string;
  mappingConfidence?: MappingConfidence;
  mappingExplanation?: string;
  updatedAt: string;
}
