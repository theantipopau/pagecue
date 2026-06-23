import { buildRecapFromSnapshot } from "@/domain/recap/build-recap-from-snapshot";
import type { Recap, RecapDetailLevel } from "@/domain/recap/schema";
import { demoBook } from "./book";
import { demoSnapshots } from "./snapshots";

const DETAIL_LEVELS: RecapDetailLevel[] = ["quick", "standard", "detailed"];

function recapKey(
  boundaryOrdinal: number,
  detailLevel: RecapDetailLevel,
): string {
  return `${boundaryOrdinal}:${detailLevel}`;
}

/**
 * Pre-derived recaps for every supported boundary and detail level, built deterministically
 * from the already-safe cumulative snapshots in `snapshots.ts`. This is what `MockRecapProvider`
 * serves - no network call, no live model, and still subject to `validateRecap` before display.
 */
export const demoMockRecaps: ReadonlyMap<string, Recap> = new Map(
  demoSnapshots.flatMap((snapshot) =>
    DETAIL_LEVELS.map(
      (detailLevel) =>
        [
          recapKey(snapshot.boundarySegmentOrdinal, detailLevel),
          buildRecapFromSnapshot(snapshot, demoBook.title, detailLevel, "high"),
        ] as const,
    ),
  ),
);

export function getMockRecap(
  boundaryOrdinal: number,
  detailLevel: RecapDetailLevel,
): Recap | undefined {
  return demoMockRecaps.get(recapKey(boundaryOrdinal, detailLevel));
}
