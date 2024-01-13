// use client
import * as React from "react";
import Image from "next/image"; // Next.js Image component for optimized image serving
import { Button } from "./button"; // Adjust the import path as necessary
import Loading from "./loading";
import { EventTracker } from "../eventTracker";

type StarProps = {
  filled: boolean;
  user?: boolean;
  className?: string;
  imageFill?: boolean;
  onClick?: () => void;
};

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
    <div className={className}>
      {imageFill ? (
        <Image src={starSrc} alt="Star" fill onClick={onClick} />
      ) : (
        <img
          src={starSrc}
          alt="Star"
          width={13}
          height={13}
          onClick={onClick}
        />
      )}
    </div>
  );
};

type RatingProps = {
  rating?: number;
  totalRatings?: number;
  userRating?: number;
  goodreadsUrl?: string;
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
  const fullStars = rating ? Math.floor(rating) : 0;
  const emptyStars = 5 - fullStars;
  const fullStarsUser = userRating ? Math.floor(userRating) : 0;
  const emptyStarsUser = 5 - fullStarsUser;

  const RatingLoading = () => (
    <div
      className={`flex items-center justify-start w-content py-4 px-6 rounded-full bg-primary-foreground ${className}`}
    >
      <Loading />
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
        className={`flex items-center justify-start w-fit rounded-full bg-primary-foreground
      ${user ? "py-2.5" : ""}
      `}
      >
        <div className={`flex items-center justify-start px-3  ${className}`}>
          {[...Array(user ? fullStarsUser : fullStars)].map((_, index) => (
            <RatingStar
              key={index}
              filled={true}
              user={user}
              className="inline-block w-4 h-4"
            />
          ))}
          {[...Array(user ? emptyStarsUser : emptyStars)].map((_, index) => (
            <RatingStar
              key={index}
              filled={false}
              className="inline-block w-4 h-4"
            />
          ))}
          <p className="ms-1 text-sm font-thin text-foreground">
            {(user ? userRating : rating)?.toFixed(2)}
            {!user && ` (${totalRatings})`}
          </p>
        </div>
        {goodreadsUrl && !user && (
          <Button
            variant="outline"
            asChild
            className="rounded-full border-none"
          >
            <div className="flex flex-row gap-2">
              <a
                className="text-sm text-primary hover:underline truncate"
                href={goodreadsUrl}
                target="_blank"
                onClick={() => {
                  EventTracker.track("User clicked on Goodreads link");
                }}
              >
                View Details on Goodreads
              </a>
              <Image
                src="/externalLink.png"
                alt="External Link"
                width={16}
                height={16}
              />
            </div>
          </Button>
        )}
      </div>
    );
  };
  return (
    <>
      {loading ? (
        <RatingLoading />
      ) : (
        <div className={`flex flex-col gap-2 ${className}`}>
          {userRating !== undefined && (fullStarsUser ?? 0) > 0 && (
            <RatingComponent user />
          )}
          {rating !== undefined && <RatingComponent />}
        </div>
      )}
    </>
  );
};

export default Rating;
