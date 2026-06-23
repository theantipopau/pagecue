import { LibraryItemView } from "@/components/book/library-item-view";

export default async function LibraryItemPage({
  params,
}: {
  params: Promise<{ libraryItemId: string }>;
}) {
  const { libraryItemId } = await params;
  return <LibraryItemView libraryItemId={libraryItemId} />;
}
