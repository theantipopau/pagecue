export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={`animate-pulse rounded-md bg-muted ${className}`}
    />
  );
}
