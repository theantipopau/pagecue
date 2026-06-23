import { RecapFlow } from "@/components/recap/recap-flow";

export default async function RecapPage({
  params,
}: {
  params: Promise<{ libraryItemId: string }>;
}) {
  const { libraryItemId } = await params;
  return <RecapFlow libraryItemId={libraryItemId} />;
}
