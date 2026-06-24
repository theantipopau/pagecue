"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { GUEST_PROFILE_ID } from "@/domain/library/guest-profile";
import type { BookSearchResultItem } from "@/domain/books/provider";
import { localLibraryRepository } from "@/repositories/library/local-library-repository";
import { BookResultCard } from "./book-result-card";

type SearchState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "results"; results: BookSearchResultItem[] };

export function SearchView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [queryText, setQueryText] = useState(initialQuery);
  const [state, setState] = useState<SearchState>({ phase: "idle" });
  const [shelfEditionIds, setShelfEditionIds] = useState<Set<string>>(
    new Set(),
  );
  const [addingEditionId, setAddingEditionId] = useState<string | null>(null);

  useEffect(() => {
    localLibraryRepository.listLibraryItems(GUEST_PROFILE_ID).then((items) => {
      setShelfEditionIds(new Set(items.map((item) => item.edition.id)));
    });
  }, []);

  async function runSearch(text: string) {
    const trimmed = text.trim();
    if (!trimmed) {
      setState({ phase: "idle" });
      return;
    }
    setState({ phase: "loading" });
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(trimmed)}`,
      );
      const data = await response.json();
      if (data.status !== "ok") {
        setState({ phase: "error", message: data.message ?? "Search failed." });
        return;
      }
      setState({ phase: "results", results: data.results });
    } catch {
      setState({
        phase: "error",
        message: "We couldn't reach search right now. Please try again.",
      });
    }
  }

  useEffect(() => {
    // Only run once on mount for the URL's initial query; subsequent searches are user-driven,
    // so this intentionally doesn't depend on `runSearch` re-running on every keystroke.
    if (initialQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate fetch-on-mount for the URL's initial query
      runSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = queryText.trim();
    router.replace(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search",
    );
    runSearch(queryText);
  }

  async function handleAdd(item: BookSearchResultItem) {
    setAddingEditionId(item.edition.id);
    try {
      await localLibraryRepository.addLibraryItem({
        profileId: GUEST_PROFILE_ID,
        book: item.book,
        edition: item.edition,
        status: "want_to_read",
      });
      setShelfEditionIds((prev) => new Set(prev).add(item.edition.id));
    } finally {
      setAddingEditionId(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Search for a book
      </h1>
      <p className="mt-1 text-muted-foreground">
        Search by title, author, or ISBN. Tracking a book never requires recap
        support.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <div className="flex-1">
          <Field id="search-query" label="Title, author, or ISBN">
            <input
              id="search-query"
              type="search"
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              placeholder="e.g. &ldquo;Lanternkeeper&rdquo; or 978-0-306-40615-7"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus-visible:outline-none"
            />
          </Field>
        </div>
        <div className="self-end">
          <Button type="submit">Search</Button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {state.phase === "idle" && (
          <p className="text-sm text-muted-foreground">
            Enter a search above to get started.
          </p>
        )}

        {state.phase === "loading" && (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        )}

        {state.phase === "error" && (
          <Card role="alert">
            <p className="text-foreground">{state.message}</p>
          </Card>
        )}

        {state.phase === "results" && state.results.length === 0 && (
          <Card>
            <p className="text-foreground">No results for that search.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This preview only searches a small set of mock catalogue fixtures,
              not a real book database.
            </p>
          </Card>
        )}

        {state.phase === "results" &&
          state.results.map((item) => (
            <BookResultCard
              key={item.edition.id}
              item={item}
              alreadyOnShelf={shelfEditionIds.has(item.edition.id)}
              adding={addingEditionId === item.edition.id}
              onAdd={() => handleAdd(item)}
            />
          ))}
      </div>
    </div>
  );
}
