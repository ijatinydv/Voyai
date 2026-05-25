export function TripCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="h-1 skeleton" />
      <div className="p-5">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="skeleton h-3 w-28" />
            <div className="skeleton mt-4 h-10 w-3/4" />
          </div>
          <div className="skeleton h-7 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-7 w-16 rounded-full" />
          <div className="skeleton h-7 w-20 rounded-full" />
          <div className="skeleton h-7 w-24 rounded-full" />
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div className="skeleton h-9 w-24 rounded-lg" />
          <div className="skeleton h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
