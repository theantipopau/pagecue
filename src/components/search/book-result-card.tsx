import { BookCover } from "@/components/book/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BookSearchResultItem } from "@/domain/books/provider";
import { formatIsbnForDisplay } from "@/lib/isbn/isbn";

export function BookResultCard({
  item,
  alreadyOnShelf,
  adding,
  onAdd,
}: {
  item: BookSearchResultItem;
  alreadyOnShelf: boolean;
  adding: boolean;
  onAdd: () => void;
}) {
  const { book, edition } = item;
  const isbn = edition.isbn13 ?? edition.isbn10;
  const metaParts = [
    edition.publisher,
    edition.publicationDate?.slice(0, 4),
    edition.pageCount ? `${edition.pageCount} pages` : undefined,
    edition.language?.toUpperCase(),
  ].filter(Boolean);

  return (
    <Card className="flex gap-4">
      <BookCover
        title={book.title}
        coverUrl={book.coverUrl}
        className="h-32 w-20"
      />
      <div className="flex-1">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {book.title}
          {book.subtitle && (
            <span className="font-sans text-base font-normal text-muted-foreground">
              {" "}
              &mdash; {book.subtitle}
            </span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">
          {book.authors.join(", ")}
        </p>

        {metaParts.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            {metaParts.join(" · ")}
          </p>
        )}
        {isbn && (
          <p className="mt-1 text-xs text-muted-foreground">
            ISBN {formatIsbnForDisplay(isbn)}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {book.isSyntheticDemo ? (
            <Badge tone="brand">Recap available</Badge>
          ) : (
            <Badge tone="neutral">Recap unavailable for this title</Badge>
          )}
          {item.hasMultipleEditions && (
            <Badge tone="warning">Multiple editions &mdash; check format</Badge>
          )}
        </div>

        <div className="mt-3">
          <Button
            variant={alreadyOnShelf ? "secondary" : "primary"}
            disabled={alreadyOnShelf || adding}
            onClick={onAdd}
          >
            {alreadyOnShelf
              ? "Already on shelf"
              : adding
                ? "Adding…"
                : "Add to shelf"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
