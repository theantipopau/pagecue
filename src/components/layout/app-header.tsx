import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-foreground"
        >
          <Image
            src="/icons/icon-48.png"
            alt=""
            width={28}
            height={28}
            className="rounded-sm"
            priority
          />
          PageCue
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <Link
            href="/search"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Search
          </Link>
          <Link
            href="/app"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            My shelf
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
