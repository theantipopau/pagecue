import { ProgressEditor } from "@/components/progress/progress-editor";

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ libraryItemId: string }>;
}) {
  const { libraryItemId } = await params;
  return <ProgressEditor libraryItemId={libraryItemId} />;
}
