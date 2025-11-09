const SkeletonCard = () => {
  return (
    <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-64 bg-zinc-800" />

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title Skeleton */}
        <div className="h-6 bg-zinc-800 rounded w-3/4" />

        {/* Info Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-16" />
            <div className="h-5 bg-zinc-800 rounded w-24" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-12" />
            <div className="h-5 bg-zinc-800 rounded w-16" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-14" />
            <div className="h-5 bg-zinc-800 rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-10" />
            <div className="h-5 bg-zinc-800 rounded w-18" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="pt-2 border-t border-zinc-800">
          <div className="h-5 bg-zinc-800 rounded w-28" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
