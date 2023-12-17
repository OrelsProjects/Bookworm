import React from 'react';

interface SkeletonProps {
  className?: string;
  type?: 'shimmer' | 'pulse';
}

const skeletonBaseColor = 'bg-gray-500';
const shimmerEffect = 'shimmer-effect';

// Skeleton component for a square
export const SquareSkeleton: React.FC<SkeletonProps> = ({
  className = '',
  type = 'shimmer',
}) => (
  <div
    className={`${className} ${skeletonBaseColor} ${type === 'pulse' ? 'animate-pulse' : shimmerEffect}`}
  ></div>
);

// Skeleton component for a circle
export const CircleSkeleton: React.FC<SkeletonProps> = ({
  className = '',
  type = 'shimmer',
}) => (
  <div
    className={`${className} rounded-full ${skeletonBaseColor} ${type === 'pulse' ? 'animate-pulse' : shimmerEffect}`}
  ></div>
);

// Skeleton component for a line
export const LineSkeleton: React.FC<SkeletonProps> = ({
  className = '',
  type = 'shimmer',
}) => (
  <div
    className={`${className} ${skeletonBaseColor} ${type === 'pulse' ? 'animate-pulse' : shimmerEffect}`}
  ></div>
);
