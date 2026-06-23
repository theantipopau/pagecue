import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          PageCue is a reading companion, not a replacement for the books you
          read.
        </p>
        <p>
          Running in demonstration mode &mdash; guest data stays on this device.{" "}
          <Link href="/" className="underline hover:text-foreground">
            Learn more
          </Link>
        </p>
      </div>
    </footer>
  );
}
