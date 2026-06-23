export type SegmentId = string;

export interface StorySegment {
  id: SegmentId;
  sourceDocumentId: string;
  chapterId: string;
  chapterOrdinal: number;
  segmentOrdinal: number;
  title?: string;
  startPercentage?: number;
  endPercentage?: number;
}

export interface StoryChapter {
  id: string;
  sourceDocumentId: string;
  ordinal: number;
  title: string;
}

export interface CharacterRelationship {
  characterId: string;
  description: string;
}

export interface CharacterState {
  id: string;
  name: string;
  aliases: string[];
  reminder: string;
  currentState: string;
  knownRelationships: CharacterRelationship[];
  currentLocationId?: string;
  firstSeenSegmentOrdinal: number;
  lastSeenSegmentOrdinal: number;
  supportingSegmentIds: SegmentId[];
}

export interface StoryEvent {
  id: string;
  description: string;
  segmentOrdinal: number;
  supportingSegmentIds: SegmentId[];
}

export type StoryThreadStatus = "open" | "resolved";

export interface StoryThread {
  id: string;
  description: string;
  status: StoryThreadStatus;
  introducedSegmentOrdinal: number;
  resolvedSegmentOrdinal?: number;
  supportingSegmentIds: SegmentId[];
}

export interface StoryLocation {
  id: string;
  name: string;
  description: string;
  supportingSegmentIds: SegmentId[];
}

export interface StorySnapshot {
  sourceDocumentId: string;
  boundarySegmentOrdinal: number;
  boundaryLabel: string;
  cumulativeSummary: string;
  characters: CharacterState[];
  importantEvents: StoryEvent[];
  openThreads: StoryThread[];
  resolvedThreads: StoryThread[];
  locations: StoryLocation[];
  supportingSegmentIds: SegmentId[];
}

export interface StoryBoundary {
  sourceDocumentId: string;
  segmentOrdinal: number;
  chapterOrdinal: number;
  label: string;
  /** True when this boundary corresponds exactly to a known chapter/segment end, as opposed to an interpolated page or percentage position. */
  isExact: boolean;
}

export interface BookSupportStatus {
  bookId: string;
  sourceDocumentId: string | null;
  isSupported: boolean;
  reason?: string;
}
