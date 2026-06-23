import type {
  GenerateRecapInput,
  RecapProvider,
} from "@/domain/recap/provider";
import type { Recap } from "@/domain/recap/schema";
import { RecapProviderError } from "@/domain/recap/errors";
import { getMockRecap } from "@/data/demo/mock-recaps";

/**
 * Deterministic, zero-credential recap provider. Looks up a pre-derived recap for the
 * requested boundary and detail level rather than calling any AI service - this is what lets
 * PageCue run the full recap flow locally with no API key (build prompt §4.4).
 */
export class MockRecapProvider implements RecapProvider {
  async generateRecap(input: GenerateRecapInput): Promise<Recap> {
    const recap = getMockRecap(
      input.snapshot.boundarySegmentOrdinal,
      input.detailLevel,
    );
    if (!recap) {
      throw new RecapProviderError(
        `No mock recap is available for boundary ordinal ${input.snapshot.boundarySegmentOrdinal} at detail level "${input.detailLevel}".`,
      );
    }
    return recap;
  }
}
