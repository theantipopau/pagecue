import type { StorySegment } from "@/domain/story/types";
import { DEMO_SOURCE_DOCUMENT_ID } from "./book";

export const demoSegments: StorySegment[] = [
  {
    id: "seg-1",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    chapterId: "ch-1",
    chapterOrdinal: 1,
    segmentOrdinal: 1,
    title: "The Keeper's Inventory",
  },
  {
    id: "seg-2",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    chapterId: "ch-2",
    chapterOrdinal: 2,
    segmentOrdinal: 2,
    title: "Torn Pages",
  },
  {
    id: "seg-3",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    chapterId: "ch-3",
    chapterOrdinal: 3,
    segmentOrdinal: 3,
    title: "The Constable's Warning",
  },
  {
    id: "seg-4",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    chapterId: "ch-4",
    chapterOrdinal: 4,
    segmentOrdinal: 4,
    title: "Bellamy's Memory",
  },
  {
    id: "seg-5",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    chapterId: "ch-5",
    chapterOrdinal: 5,
    segmentOrdinal: 5,
    title: "What the Reef Hides",
  },
  {
    id: "seg-6",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    chapterId: "ch-6",
    chapterOrdinal: 6,
    segmentOrdinal: 6,
    title: "Gull's Point at Low Tide",
  },
];
