import Image from "next/image";

export function BookCover({
  title,
  coverUrl,
  className = "h-48 w-32",
}: {
  title: string;
  coverUrl?: string;
  className?: string;
}) {
  if (coverUrl) {
    return (
      <Image
        src={coverUrl}
        alt={`Cover of ${title}`}
        width={128}
        height={192}
        className={`flex-shrink-0 rounded-md border border-border object-cover shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex flex-shrink-0 items-center justify-center rounded-md border border-border bg-muted font-serif text-3xl text-muted-foreground shadow-sm ${className}`}
    >
      {title.charAt(0)}
    </div>
  );
}
