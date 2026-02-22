export default function RefillsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-40 bg-[var(--bento-bg)] rounded-lg" />
        <div className="h-4 w-80 bg-[var(--bento-bg)] rounded-lg mt-2" />
      </div>
      <div className="bento-card-static h-[500px]" />
    </div>
  );
}
