const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={`liq-animate-pulse liq-rounded-lg liq-bg-neutral-700/40 ${className ?? ''}`}
  />
);

export const MxLoadSkeleton = () => (
  <div className="liq-flex liq-flex-col liq-gap-1">
    {/* From card */}
    <div className="liq-rounded-2xl liq-bg-neutral-750/50 liq-p-5 lg:liq-p-6 liq-flex liq-flex-col liq-gap-4">
      <SkeletonBlock className="liq-h-4 liq-w-24" />
      <div className="liq-flex liq-justify-between liq-items-center liq-gap-2">
        <SkeletonBlock className="liq-h-10 liq-flex-1" />
        <SkeletonBlock className="liq-h-10 liq-w-32" />
      </div>
    </div>
    {/* To card */}
    <div className="liq-rounded-2xl liq-bg-neutral-750/50 liq-p-5 lg:liq-p-6 liq-flex liq-flex-col liq-gap-4">
      <SkeletonBlock className="liq-h-4 liq-w-24" />
      <div className="liq-flex liq-justify-between liq-items-center liq-gap-2">
        <SkeletonBlock className="liq-h-10 liq-flex-1" />
        <SkeletonBlock className="liq-w-32 liq-h-10" />
      </div>
    </div>
    {/* Button */}
    <SkeletonBlock className="liq-h-12 liq-w-full liq-rounded-xl" />
  </div>
);
