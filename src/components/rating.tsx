// use client
import * as React from "react";
// Next.js Image component for optimized image serving
import { Button } from "./ui/button"; // Adjust the import path as necessary
import Loading from "./ui/loading";
import Image from "next/image";

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
  imageFill,
  filled,
  user,
  className,
  onClick,
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
  rating?: number | null;
  totalRatings?: number | null;
  userRating?: number | null;
  goodreadsUrl?: string | null;
  loading?: boolean;
  className?: string;
};

const Rating: React.FC<RatingProps> = ({
  rating,
  totalRatings,
  goodreadsUrl,
  userRating,
  loading,
  className,
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
      <div className="flex flex-row gap-1 md:gap-2.5">
        {[...Array(user ? fullStarsUser : fullStars)].map((_, index) => (
          <RatingStar key={index} filled user={user} className="inline-block" />
        ))}
        {[...Array(user ? emptyStarsUser : emptyStars)].map((_, index) => (
          <RatingStar key={index} className="inline-block" />
        ))}
      </div>
      <p className="ms-1 md:ms-0 text-lg font-thin text-foreground md:text-[24px] leading-[48px]">
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
