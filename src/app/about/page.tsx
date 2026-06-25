import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        About PageCue
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Remember the story. Resume the journey.
      </p>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          What PageCue is
        </h2>
        <p className="mt-2 text-foreground">
          PageCue is a spoiler-safe reading companion for people who pause books
          and come back later. Tell it where you stopped, and it gives you a
          concise reminder of the story so far &mdash; characters,
          relationships, where things stand, and unresolved threads &mdash;
          using only information you&apos;ve already reached.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          What PageCue is not
        </h2>
        <p className="mt-2 text-foreground">
          PageCue does not replace reading, and it does not produce condensed
          substitutes for books. It is not a general AI chatbot, not a
          study-notes generator, and not a full-book summary platform. It exists
          to help you return to a book you already own, borrow, or are currently
          reading &mdash; not to read it for you.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          How the spoiler boundary works
        </h2>
        <p className="mt-2 text-foreground">
          Every recap is tied to the exact point you&apos;ve told PageCue
          you&apos;ve reached. The system that builds a recap is never given
          anything beyond that point &mdash; not a later chapter, not a summary
          of what happens next, nothing. Before a recap is ever shown to you, a
          separate, deterministic check independently re-verifies that every
          single claim in it can be traced back to something at or before your
          boundary. If it can&apos;t, the recap is rejected and you see a safe
          error instead &mdash; never a guess.
        </p>
        <p className="mt-2 text-foreground">
          This check runs the same way whether the recap came from a
          deterministic demo response or a real AI model, so a model having a
          bad day can&apos;t leak something you haven&apos;t read yet.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Recap support depends on real data
        </h2>
        <p className="mt-2 text-foreground">
          PageCue cannot accurately recap an arbitrary book from its title,
          author, and a page number alone &mdash; and it does not try to. A
          recap is only ever offered for a title that has an approved,
          structured story source behind it. Everything else can still be
          tracked on your shelf; PageCue will just say plainly that a recap
          isn&apos;t available for it, rather than inventing one.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Privacy, in short
        </h2>
        <p className="mt-2 text-foreground">
          In this guest preview, your shelf, progress, and recap history live
          only in your browser&apos;s local storage &mdash; nothing is uploaded
          anywhere by default. See{" "}
          <Link href="/settings" className="underline hover:text-foreground">
            Settings
          </Link>{" "}
          for exactly what is stored and what would be sent to an external
          provider if one is configured.
        </p>
      </section>

      <Card className="mt-8">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          A note on copyright
        </h2>
        <p className="mt-2 text-sm text-foreground">
          This is not legal advice, and using PageCue does not constitute legal
          advice about copyright. This demonstration only ever uses an original,
          fictional synthetic novel written for PageCue, public catalogue
          metadata, and your own tracking data. Publisher agreements and proper
          legal review would be required before any future version supports
          recaps for real, commercially published books at scale.
        </p>
      </Card>

      <div className="mt-8">
        <LinkButton href="/app">Open my shelf</LinkButton>
      </div>
    </div>
  );
}
