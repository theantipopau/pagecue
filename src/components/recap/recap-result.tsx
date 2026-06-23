import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import type { Recap } from "@/domain/recap/schema";

const CONFIDENCE_LABELS: Record<Recap["confidence"], string> = {
  high: "High confidence",
  medium: "Approximate",
  low: "Low confidence",
};

export function RecapResult({
  recap,
  libraryItemId,
  onChangeDetailLevel,
}: {
  recap: Recap;
  libraryItemId: string;
  onChangeDetailLevel: () => void;
}) {
  return (
    <article className="space-y-8">
      <header>
        <p className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {recap.bookTitle}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-foreground">
          The story so far
        </h1>
      </header>

      <p className="text-lg leading-relaxed text-foreground">{recap.summary}</p>

      {recap.characters.length > 0 && (
        <section aria-labelledby="people-heading">
          <h2
            id="people-heading"
            className="font-serif text-2xl font-semibold text-foreground"
          >
            People to remember
          </h2>
          <ul className="mt-3 space-y-4">
            {recap.characters.map((character) => (
              <li key={character.name}>
                <p className="font-medium text-foreground">{character.name}</p>
                <p className="text-sm text-muted-foreground">
                  {character.reminder}
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {character.currentState}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recap.currentSituation.length > 0 && (
        <section aria-labelledby="situation-heading">
          <h2
            id="situation-heading"
            className="font-serif text-2xl font-semibold text-foreground"
          >
            Where things currently stand
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground">
            {recap.currentSituation.map((point, index) => (
              <li key={index}>{point.text}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="threads-heading">
        <h2
          id="threads-heading"
          className="font-serif text-2xl font-semibold text-foreground"
        >
          Unresolved threads
        </h2>
        {recap.unresolvedThreads.length > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground">
            {recap.unresolvedThreads.map((thread, index) => (
              <li key={index}>{thread.text}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">
            Nothing is left open at this point in the story.
          </p>
        )}
      </section>

      <Card aria-labelledby="boundary-heading">
        <h2
          id="boundary-heading"
          className="font-serif text-xl font-semibold text-foreground"
        >
          Spoiler boundary
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <Badge tone={recap.confidence === "high" ? "success" : "warning"}>
            {CONFIDENCE_LABELS[recap.confidence]}
          </Badge>
          <span className="text-sm text-foreground">{recap.boundaryLabel}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {recap.confidenceReason}
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">
          {recap.spoilerWarning}
        </p>
      </Card>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={onChangeDetailLevel}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Change recap length
        </button>
        <LinkButton
          href={`/library/${libraryItemId}/progress`}
          variant="secondary"
        >
          Update progress
        </LinkButton>
        <LinkButton href="/app" variant="ghost">
          Return to shelf
        </LinkButton>
      </div>
      <p className="text-xs text-muted-foreground">
        Something look wrong? Problem reporting isn&apos;t available in this
        preview yet.
      </p>
    </article>
  );
}
