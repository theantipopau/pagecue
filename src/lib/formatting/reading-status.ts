import type { ReadingStatus } from "@/domain/library/types";

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  want_to_read: "Want to read",
  reading: "Reading",
  paused: "Paused",
  finished: "Finished",
};

export function formatReadingStatus(status: ReadingStatus): string {
  return READING_STATUS_LABELS[status];
}
