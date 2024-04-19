import React from "react";
import { Skeleton } from "../ui/skeleton";
import { BookDetailsProps } from "../book/bookDetails";
import { getThumbnailSize } from "../../consts/thumbnail";
import { getIconSize } from "../../consts/icon";

const BookDetailsSkeleton: React.FC<BookDetailsProps> = ({
  book,
  bookThumbnailSize = "md",
  Icon,
  ThumbnailIcon,
  className,
  direction,
}) => {
  const flexDirection = direction === "row" ? "flex-col" : "flex-row";
  const sizeClass = direction === "row" ? "w-36 h-48" : "w-full h-24"; // Adjust sizes as necessary based on the thumbnail size constants

  return (
    <div
      className={`w-full h-fit flex ${flexDirection} flex-shrink-0 justify-start items-center gap-2 ${sizeClass} ${
        className ?? ""
      }`}
    >
      <Skeleton
        className={`rounded-lg flex-shrink-0 ${
          getThumbnailSize(bookThumbnailSize).className
        }
        `}
      />
      <div className="w-auto flex flex-col gap-2 overflow-visible flex-grow self-center pr-4">
        <Skeleton className="w-3/4 h-2.5 rounded-full flex-shrink" />
        <Skeleton className="w-2/4 h-2.5 rounded-full flex-shrink" />
      </div>
      <Skeleton className={`w-8 h-8 rounded-full`} /> {/* Icon Placeholder */}
    </div>
  );
};

export default BookDetailsSkeleton;
