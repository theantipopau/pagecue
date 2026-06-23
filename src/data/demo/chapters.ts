import type { StoryChapter } from "@/domain/story/types";
import { DEMO_SOURCE_DOCUMENT_ID } from "./book";

export const demoChapters: StoryChapter[] = [
  {
    id: "ch-1",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    ordinal: 1,
    title: "The Keeper's Inventory",
  },
  {
    id: "ch-2",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    ordinal: 2,
    title: "Torn Pages",
  },
  {
    id: "ch-3",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    ordinal: 3,
    title: "The Constable's Warning",
  },
  {
    id: "ch-4",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    ordinal: 4,
    title: "Bellamy's Memory",
  },
  {
    id: "ch-5",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    ordinal: 5,
    title: "What the Reef Hides",
  },
  {
    id: "ch-6",
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    ordinal: 6,
    title: "Gull's Point at Low Tide",
  },
];
