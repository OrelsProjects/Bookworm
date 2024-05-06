import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "../../lib/utils";

export const SeeAllLoading = ({ title }: { title?: boolean }) =>
  title ? <SeeAllTitleLoading /> : <SeeAllComponentLoading />;

export const SeeAll = ({
  title,
  onClick,
  loading,
  className,
}: {
  title?: string;
  onClick: () => void;
  loading?: boolean;
  className?: string;
}) =>
  loading ? (
    title ? (
      <SeeAllTitleLoading />
    ) : (
      <SeeAllComponentLoading />
    )
  ) : title ? (
    <SeeAllTitle title={title} onSeeAllClick={onClick} />
  ) : (
    <div className={cn("text-see-all", className)} onClick={onClick}>
      see all
    </div>
  );

const SeeAllTitle = ({
  title,
  onSeeAllClick,
  className,
}: {
  title: string;
  onSeeAllClick: () => void;
  className?: string;
}) => (
  <div
    className={cn(
      "w-full flex flex-row justify-between items-center",
      className
    )}
  >
    <div className="text-2xl">{title}</div>
    <SeeAll onClick={onSeeAllClick} />
  </div>
);

const SeeAllComponentLoading = () => (
  <Skeleton className="w-16 h-4 rounded-full" />
);

const SeeAllTitleLoading = () => (
  <div className="w-full flex flex-row justify-between items-center">
    <Skeleton className="w-1/3 h-5 rounded-full" />
    <SeeAllComponentLoading />
  </div>
);
