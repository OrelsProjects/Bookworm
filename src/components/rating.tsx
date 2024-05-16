// use client
import * as React from "react";
import Loading from "./ui/loading";
import Image from "next/image";
import { cn } from "../lib/utils";

type StarProps = {
  filled?: boolean;
  user?: boolean;
  className?: string;
  imageFill?: boolean;
  onClick?: () => void;
};

function clamp(num: number, min: number, max: number): number {
  return Math.min(num, max);
}

export const RatingStar: React.FC<StarProps> = ({
  user,
  filled,
  onClick,
  imageFill,
  className,
}) => {
  const starSrc = filled
    ? user
      ? "/starUser.svg"
      : "/star.svg"
    : "/starEmpty.svg"; // Assuming you have an 'star-empty.svg' for empty stars
  return (
    <div
      className={`w-4 h-4 md:w-10 md:h-10 md:flex md:justify-center md:items-center relative ${className}`}
    >
      <Image src={starSrc} alt="Star" fill onClick={onClick} />
    </div>
  );
};

type RatingProps = {
  loading?: boolean;
  className?: string;
  rating?: number | null;
  textClassName?: string;
  starClassName?: string;
  userRating?: number | null;
  totalRatings?: number | null;
  goodreadsUrl?: string | null;
  startsContainerClassName?: string;
};

const Rating: React.FC<RatingProps> = ({
  rating,
  loading,
  className,
  userRating,
  totalRatings,
  goodreadsUrl,
  textClassName,
  starClassName,
  startsContainerClassName,
}) => {
  const fullStars = clamp(rating ? Math.round(rating) : 0, 0, 5);
  const emptyStars = clamp(5 - fullStars, 0, 5);
  const fullStarsUser = clamp(userRating ? Math.round(userRating) : 0, 0, 5);
  const emptyStarsUser = clamp(5 - fullStarsUser, 0, 5);

  const RatingLoading = () => (
    <div
      className={`flex items-center justify-start w-content py-4 rounded-full bg-primary-foreground ${
        className ?? ""
      }`}
    >
      <Loading />
    </div>
  );

  const Stars = ({ user }: { user?: boolean }) => (
    <div
      className={`flex items-center justify-start md:justify-center gap-1 md:gap-16 ${
        className ?? ""
      }`}
    >
      <div
        className={cn(
          "flex flex-row gap-1 md:gap-2.5",
          startsContainerClassName
        )}
      >
        {[...Array(user ? fullStarsUser : fullStars)].map((_, index) => (
          <RatingStar
            key={index}
            filled
            user={user}
            className={cn("inline-block", starClassName)}
          />
        ))}
        {[...Array(user ? emptyStarsUser : emptyStars)].map((_, index) => (
          <RatingStar
            key={index}
            className={cn("inline-block", starClassName)}
          />
        ))}
      </div>
      <p
        className={cn(
          "ms-1 md:ms-0 text-lg font-thin text-foreground md:text-[24px] leading-[48px]",
          textClassName
        )}
      >
        {(user ? userRating : rating)?.toFixed(2)}
        {!user && totalRatings && ` (${totalRatings})`}
      </p>
    </div>
  );

  const RatingComponent = ({
    user,
    className,
  }: {
    user?: boolean;
    className?: string;
  }) => {
    return (
      <div
        className={`flex items-center justify-start w-fit rounded-full
      ${user ? "py-2.5" : ""}
      ${className ?? ""}
      `}
      >
        <Stars user={user} />
      </div>
    );
  };
  return (
    <>
      {loading ? (
        <RatingLoading />
      ) : (
        <div className={`flex flex-col gap-2 ${className ?? ""}`}>
          {userRating !== undefined &&
            userRating != null &&
            (fullStarsUser ?? 0) > 0 && <RatingComponent user />}
          {rating != null && rating !== undefined && <RatingComponent />}
        </div>
      )}
    </>
  );
};

export default Rating;
