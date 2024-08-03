import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "../../lib/utils";
import { EventTracker } from "../../eventTracker";

export const SeeAllLoading = ({ title }: { title?: boolean }) =>
  title ? <SeeAllWithTitleLoading /> : <SeeAllComponentLoading />;

export const SeeAll = ({
  title,
  onClick,
  loading,
  className,
  showSeeAll = true,
}: {
  title?: string;
  onClick: () => void;
  loading?: boolean;
  className?: string;
  showSeeAll?: boolean;
}) =>
  loading ? (
    title ? (
      <SeeAllWithTitleLoading />
    ) : (
      <SeeAllComponentLoading />
    )
  ) : title ? (
    <SeeAllWithTitle
      title={title}
      onSeeAllClick={onClick}
      showSeeAll={showSeeAll}
    />
  ) : (
    <SeeAllText
      className={cn(className, { hidden: !showSeeAll })}
      onClick={() => {
        EventTracker.track("See all clicked", { title });
        onClick();
      }}
    />
  );

const SeeAllText = ({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) => (
  <div
    className={cn(
      "text-see-all cursor-pointer p-2.5 hover:bg-slate-400/10 rounded-full",
      className
    )}
    onClick={onClick}
  >
    See all
  </div>
);

const SeeAllWithTitle = ({
  title,
  loading,
  className,
  onSeeAllClick,
  showSeeAll = true,
}: {
  title: string;
  loading?: boolean;
  className?: string;
  showSeeAll?: boolean;
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
      <div className="text-2xl md:text-3xl">{title}</div>
      <SeeAllText
        onClick={onSeeAllClick}
        className={cn({ hidden: !showSeeAll })}
      />
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
    <div className={cn("text-2xl md:text-3xl", className)}>{title}</div>
  );

const SeeAllComponentLoading = () => (
  <Skeleton
  key={`loading-see-all`}
  className="w-16 h-4 rounded-full" />
);

const SeeAllTitleLoading = () => (
  <Skeleton 
  key={`loading-see-all-title`}
  className="w-48 h-5 md:h-7 rounded-full" />
);

const SeeAllWithTitleLoading = () => (
  <div className="w-full flex flex-row justify-between items-center">
    <SeeAllTitleLoading />
    <SeeAllComponentLoading />
  </div>
);
