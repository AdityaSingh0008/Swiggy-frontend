import React from 'react';

const SkeletonCard = () => (
  <div className="glass rounded-2xl overflow-hidden">
    <div className="skeleton h-44 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
