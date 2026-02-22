export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-48 bg-[var(--bento-bg)] rounded-lg" />
        <div className="h-4 w-72 bg-[var(--bento-bg)] rounded-lg mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bento-card-static p-5 h-28" />
        ))}
      </div>
      <div className="bento-card-static h-80" />
    </div>
  );
}
