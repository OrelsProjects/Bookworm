import React from "react";

interface SkeletonProps {
  className?: string;
  type?: "shimmer" | "pulse" | "none";
}

const skeletonBaseColor = "bg-gray-500";
const shimmerEffect = "shimmer-effect";

const animationClass = ({ className, type }: SkeletonProps) => {
  const baseClass = `${className ?? ""} ${skeletonBaseColor}`;
  let extraClass = "";
  switch (type) {
    case "shimmer":
      extraClass = `${shimmerEffect}`;
    case "pulse":
      extraClass = "animate-pulse";
  }
  return `${baseClass} ${extraClass}`;
};

// Skeleton component for a square
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  type = "shimmer",
}) => <div className={`${animationClass({ className, type })}`}></div>;
