export default function UsersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-7 w-40 bg-[var(--bento-bg)] rounded-lg" />
          <div className="h-4 w-72 bg-[var(--bento-bg)] rounded-lg mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-44 bg-[var(--bento-bg)] rounded-xl" />
          <div className="h-10 w-28 bg-[var(--bento-bg)] rounded-xl" />
        </div>
      </div>
      <div className="bento-card-static h-[500px]" />
    </div>
  );
}
