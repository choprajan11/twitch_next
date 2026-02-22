export default function ServicesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-7 w-48 bg-[var(--bento-bg)] rounded-lg" />
          <div className="h-4 w-72 bg-[var(--bento-bg)] rounded-lg mt-2" />
        </div>
        <div className="h-10 w-32 bg-[var(--bento-bg)] rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bento-card-static p-6 h-52" />
        ))}
      </div>
    </div>
  );
}
