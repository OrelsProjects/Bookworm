import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "../../lib/utils";

export const SeeAllLoading = ({ title }: { title?: boolean }) =>
  title ? <SeeAllWithTitleLoading /> : <SeeAllComponentLoading />;

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
      <SeeAllWithTitleLoading />
    ) : (
      <SeeAllComponentLoading />
    )
  ) : title ? (
    <SeeAllWithTitle title={title} onSeeAllClick={onClick} />
  ) : (
    <div className={cn("text-see-all", className)} onClick={onClick}>
      see all
    </div>
  );

const SeeAllWithTitle = ({
  title,
  loading,
  className,
  onSeeAllClick,
}: {
  title: string;
  loading?: boolean;
  className?: string;
  onSeeAllClick: () => void;
}) =>
  loading ? (
    <SeeAllWithTitleLoading />
  ) : (
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

export const SeeAllTitle = ({
  title,
  loading,
  className,
}: {
  title: string;
  loading?: boolean;
  className?: string;
}) =>
  loading ? (
    <SeeAllTitleLoading />
  ) : (
    <div className={cn("text-2xl", className)}>{title}</div>
  );

const SeeAllComponentLoading = () => (
  <Skeleton className="w-16 h-4 rounded-full" />
);

const SeeAllTitleLoading = () => (
  <Skeleton className="w-1/3 h-5 rounded-full" />
);

const SeeAllWithTitleLoading = () => (
  <div className="w-full flex flex-row justify-between items-center">
    <SeeAllTitleLoading />
    <SeeAllComponentLoading />
  </div>
);
