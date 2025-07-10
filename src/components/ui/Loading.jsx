import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-card animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  const SkeletonTimeBlock = () => (
    <div className="bg-gray-200 rounded-lg p-3 animate-pulse">
      <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-2 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  const SkeletonTask = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const SkeletonNote = () => (
    <div className="bg-white rounded-xl p-6 shadow-card animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  );

  if (type === "calendar") {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded p-2 space-y-1">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <SkeletonTimeBlock />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "kanban") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <SkeletonTask key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "notes") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonNote key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default Loading;