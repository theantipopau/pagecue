"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { localLibraryRepository } from "@/repositories/library/local-library-repository";
import { localRecapHistoryRepository } from "@/repositories/recap-history/local-recap-history-repository";

export function SettingsView() {
  const router = useRouter();
  const [resetting, setResetting] = useState(false);

  async function handleResetDemoData() {
    const confirmed = window.confirm(
      "Reset your guest shelf and recap history back to the demonstration book? This removes everything else you've added on this device.",
    );
    if (!confirmed) return;
    setResetting(true);
    await localLibraryRepository.resetToDemo();
    await localRecapHistoryRepository.clearAllHistory();
    setResetting(false);
    router.push("/app");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Settings
      </h1>
      <p className="mt-1 text-muted-foreground">
        Theme, privacy, and what PageCue stores about you.
      </p>

      <Card className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Appearance
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch between light and dark. PageCue also respects your
          system&apos;s reduced-motion preference automatically.
        </p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Your data
        </h2>
        <p className="mt-1 text-sm text-foreground">
          PageCue runs in guest mode: your shelf, reading progress, and recap
          history are stored only in this browser&apos;s local storage. Nothing
          is uploaded to a server, and nothing syncs across devices.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            Clearing your browser&apos;s site data removes everything PageCue
            has stored.
          </li>
          <li>
            If real book search is configured, your search text is sent to
            Google Books to find results - nothing else.
          </li>
          <li>
            If a real recap provider is configured, only the structured story
            data for your confirmed boundary is sent to it - never your personal
            notes, never later parts of the book.
          </li>
        </ul>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={handleResetDemoData}
            disabled={resetting}
          >
            {resetting ? "Resetting…" : "Reset demo data"}
          </Button>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Privacy
        </h2>
        <p className="mt-1 text-sm text-foreground">
          PageCue is meant to be a quiet personal memory aid, not a place that
          collects your reading history for any other purpose. There is no
          account, no tracking pixel, and no analytics on what you read.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a demonstration build. Future versions that let you add your
          own private sources will require explicit consent and deletion
          controls before they ship - PageCue does not store full commercial
          book text today, and won&apos;t without addressing that first. See{" "}
          <Link href="/about" className="underline hover:text-foreground">
            About PageCue
          </Link>{" "}
          for the full spoiler-safety and legal picture.
        </p>
      </Card>
    </div>
  );
}
