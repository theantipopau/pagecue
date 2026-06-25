# PageCue — Spoiler Safety

This is the most important document in the repository. If anything here conflicts with convenience, safety wins.

## Threat model

| Threat                                                      | Example                                                                          | Mitigation                                                                                                                                                              |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model uses outside/general knowledge of a real book         | Recap mentions a twist from the model's training data, not the supplied snapshot | §4.2 system instruction prohibition + structured-input-only design; Phase 1 ships no real-book recap path at all                                                        |
| Model receives future content                               | A later snapshot accidentally included in the request                            | Retrieval only ever fetches the snapshot at or below the confirmed boundary (`StorySourceRepository.getSnapshotAtBoundary`)                                             |
| Model output references a segment beyond the boundary       | A claim cites a segment ID with `segmentOrdinal > boundary`                      | Deterministic validator rejects (`FUTURE_SEGMENT_REFERENCE`)                                                                                                            |
| Model output references a nonexistent or wrong-book segment | Hallucinated or cross-contaminated segment ID                                    | Validator rejects (`UNKNOWN_SEGMENT` / `BOOK_MISMATCH`)                                                                                                                 |
| Model claims a thread is resolved before it actually is     | "The mystery is solved" before the resolving segment                             | Snapshot data is authored so `openThreads`/`resolvedThreads` are only ever correct as of the boundary; validator additionally rejects claims with no supporting segment |
| Unsupported claim with no evidence                          | A factual sentence with zero `supportingSegmentIds`                              | Schema requires ≥1 supporting segment per claim; validator rejects `UNSUPPORTED_CLAIM`                                                                                  |
| Unsafe markup in output                                     | HTML/script injected into a text field                                           | Validator rejects `UNSAFE_CONTENT`; UI renders all recap text, never `dangerouslySetInnerHTML`                                                                          |
| Page progress silently treated as exact                     | User enters page 214, app implies the boundary is precise                        | UI always labels page-based mapping confidence (`exact`/`high`/`medium`/`low`) and never auto-advances to a later boundary                                              |
| Unsupported title fabricates a recap                        | A book with no approved structured source still produces something               | `StorySourceRepository.getBookSupport()` gates the recap UI entirely; there is no fallback path that invents content                                                    |

## Product rules (non-negotiable)

1. No recap without an approved structured story source (build prompt §4.1).
2. No general AI knowledge as a story source — only supplied structured data (§4.2).
3. Every claim traceable to ≤-boundary segment IDs; no validated output without it (§4.3).
4. Honest UI about uncertainty — approximate boundaries are always labeled approximate (§4.5).

## Future-information risks

The single highest-risk failure mode is a recap that _sounds_ plausible but encodes knowledge the reader hasn't reached. This is why validation is deterministic TypeScript, not another model call: an LLM judge could itself be fooled by confident phrasing. The validator only trusts segment-ID membership, which is a closed, checkable set.

## Prompt-level controls

The system instruction (build prompt §19, `RECAP_SYSTEM_INSTRUCTION` in `src/domain/recap/prompt-version.ts`, sent by `GeminiRecapProvider`) explicitly prohibits outside knowledge, foreshadowing, speculation, invented motives/events, direct quotation, and requires schema-only output with citations. This is a _defense in depth_ layer, not the primary control — see validation below.

## Retrieval controls

`StorySourceRepository.getSnapshotAtBoundary(sourceDocumentId, maxOrdinal)` is the only way recap generation gets story content, and it physically cannot return segments above `maxOrdinal`. There is no code path where the recap provider receives the "next" snapshot "just in case."

## Deterministic validation

`validateRecap(recap, { sourceDocumentId, boundaryOrdinal, allowedSegmentIds })` in `src/domain/recap/validator.ts`:

1. Re-validates the shape with `RecapSchema` (`SCHEMA_INVALID` on failure).
2. Confirms the recap's `boundaryLabel` matches the confirmed boundary (`BOUNDARY_MISMATCH`).
3. Walks every character/situation/thread claim and confirms each `supportingSegmentIds` entry:
   - exists in the known segment set (`UNKNOWN_SEGMENT` otherwise),
   - belongs to `sourceDocumentId` (`BOOK_MISMATCH` otherwise),
   - has `segmentOrdinal <= boundaryOrdinal` (`FUTURE_SEGMENT_REFERENCE` otherwise),
   - is non-empty (`UNSUPPORTED_CLAIM` otherwise).
4. Rejects plain-text fields containing HTML/script-like markup (`UNSAFE_CONTENT`).
5. Returns `{ valid: true, recap }` only if every check passes; otherwise `{ valid: false, reason, safeMessage }`.

The result is never partially trusted — a single invalid claim rejects the whole recap rather than stripping the bad part and showing the rest, because a partially-redacted recap can itself leak structure (e.g. an oddly short "unresolved threads" list).

## Testing strategy

`src/domain/recap/__tests__/validator.test.ts` and `src/data/demo/malicious-fixtures.ts` cover every rejection reason above with a concrete adversarial fixture (future segment, unknown segment, wrong-book segment, prematurely-resolved thread, mismatched boundary label, zero-evidence claim). See `docs/TESTING.md`.

## Incident handling

If a validation failure occurs in production, the API logs only `{ reason, sourceDocumentId, boundaryOrdinal }` — never source text or the rejected recap body — and returns a safe retry-capable message. Repeated failures for the same boundary should be treated as a pipeline bug (snapshot/prompt mismatch), not retried indefinitely (no unbounded retry loops, build prompt §19).

## Known limitations

- `GeminiRecapProvider` is now a real, live LLM behind the same interface as the mock provider, and its output passes through the identical `validateRecap` - see the "defense in depth" test in `src/providers/recap/__tests__/gemini-recap-provider.test.ts`, which proves a fabricated Gemini response citing a nonexistent segment is still rejected. The system-prompt controls in `RECAP_SYSTEM_INSTRUCTION` are exercised against real model variance for the first time via this provider, though only at whatever traffic volume this deployment actually sees - they have not been adversarially red-teamed against a live model at scale.
- The validator checks structural safety (segment provenance), not stylistic leakage (e.g., a name's tone implying a twist). This is an acknowledged residual risk that now applies to real model output (previously only a theoretical concern with the mock provider).
- HTML/markup detection is pattern-based, not a full sanitizer; output is also never rendered as HTML, which is the primary control.
