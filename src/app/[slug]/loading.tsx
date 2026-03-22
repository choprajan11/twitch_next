export default function ServiceLoading() {
  return (
    <div className="flex flex-col items-center animate-pulse">
      {/* Hero skeleton */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-12 pb-16 lg:pt-20 lg:pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bento-bg)] mx-auto mb-6" />
          <div className="h-12 w-80 bg-[var(--bento-bg)] rounded-xl mx-auto mb-4" />
          <div className="h-5 w-full max-w-lg bg-[var(--bento-bg)] rounded-lg mx-auto" />
          <div className="h-5 w-2/3 bg-[var(--bento-bg)] rounded-lg mx-auto mt-2" />
        </div>
      </section>

      {/* Plans + Sidebar skeleton */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="bento-card-static overflow-hidden">
              <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                <div className="h-6 w-40 bg-[var(--bento-bg)] rounded-lg" />
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 h-24"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bento-card-static p-6 space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--bento-bg)] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-[var(--bento-bg)] rounded" />
                    <div className="h-3 w-full bg-[var(--bento-bg)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
