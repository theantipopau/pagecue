import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <section className="text-center">
        <Image
          src="/icons/icon-192.png"
          alt="PageCue logo: a stylized open book beneath a bookmarked page with a sparkle cue"
          width={64}
          height={64}
          className="mx-auto"
          priority
        />
        <p className="mt-3 font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">
          PageCue
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Pick up where you left off.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          PageCue reminds you what has happened in your book so far &mdash;
          without revealing what comes next.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="/app">Continue as guest</LinkButton>
          <LinkButton href="#how-it-works" variant="secondary">
            See how it works
          </LinkButton>
        </div>
      </section>

      <section className="mt-16">
        <Card>
          <p className="font-serif text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Example recap &mdash; demonstration book
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground">
            The story so far
          </h2>
          <p className="mt-2 text-foreground">
            Wren Calder has arrived in the small coastal town of Saltgrave
            Harbor to catalog the late lighthouse keeper Josiah Fenn&apos;s
            papers for the Hall of Records. Town archivist Thomlin Pike and
            harbor master Edda Bellamy both mention that Fenn kept a personal
            atlas of the coastline, though no one has been able to find it since
            his death.
          </p>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Spoiler boundary: End of Chapter 1 &mdash; nothing from later in the
            book was used.
          </p>
        </Card>
      </section>

      <section id="how-it-works" className="mt-16 scroll-mt-24">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          How it works
        </h2>
        <ol className="mt-4 space-y-4 text-foreground">
          <li>
            <strong className="font-semibold">
              1. Tell PageCue where you stopped.
            </strong>{" "}
            Pick a chapter, page, or percentage.
          </li>
          <li>
            <strong className="font-semibold">
              2. PageCue finds the safest boundary.
            </strong>{" "}
            It never reads ahead of where you&apos;ve actually reached.
          </li>
          <li>
            <strong className="font-semibold">
              3. Get a spoiler-safe recap.
            </strong>{" "}
            Story so far, people to remember, and what&apos;s still unresolved
            &mdash; nothing more.
          </li>
        </ol>
      </section>

      <section className="mt-16 space-y-3 text-sm text-muted-foreground">
        <p>
          PageCue never reveals anything beyond the point you&apos;ve told it
          you&apos;ve reached, and it only generates a recap for books that have
          an approved, structured story source.
        </p>
        <p>
          Recap support depends on available story data &mdash; PageCue does not
          claim to summarize every book. The demonstration novel below is fully
          supported so you can try the real flow right now.
        </p>
        <p>
          Guest data stays on this device in Phase 1. Nothing you add to your
          shelf is sent anywhere unless you explicitly search using an external
          metadata provider.
        </p>
      </section>

      <section className="mt-16 text-center">
        <Card>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Try the demonstration book
          </h2>
          <p className="mt-2 text-muted-foreground">
            &ldquo;The Lanternkeeper&apos;s Atlas&rdquo; is an original story
            written for PageCue, so the full recap experience works without any
            account or external service.
          </p>
          <div className="mt-6">
            <LinkButton href="/app">Open my shelf</LinkButton>
          </div>
        </Card>
      </section>
    </div>
  );
}
