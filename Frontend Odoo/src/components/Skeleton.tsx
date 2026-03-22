export const Skeleton = () => {
  return <div className="h-4 skeleton-shimmer rounded-lg" />;
};

export const SkeletonCard = () => {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 skeleton-shimmer rounded-xl" />
        <div className="w-16 h-6 skeleton-shimmer rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 skeleton-shimmer rounded-lg" />
        <div className="h-8 w-16 skeleton-shimmer rounded-lg" />
      </div>
      <div className="flex items-end gap-0.5 h-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="flex-1 skeleton-shimmer rounded-full" style={{ height: `${30 + Math.random() * 70}%` }} />
        ))}
      </div>
    </div>
  );
};

export const SkeletonTable = () => {
  return (
    <div className="card p-6 space-y-3">
      <div className="h-10 skeleton-shimmer rounded-xl" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-14 skeleton-shimmer rounded-xl" />
      ))}
    </div>
  );
};
