import React from "react";
import Rating from "../../rating";

const BookGeneralDetails: React.FC<{
  title?: string;
  authors?: string[];
  goodreadsRating?: number | null;
}> = ({ title, authors, goodreadsRating }) => (
  <div className="h-full w-full flex flex-col gap-4">
    <div>
      <div className="font text-foreground line-clamp-1 font-bold text-xl pr-2">
        {title}
      </div>
      <div className="text-lg text-muted line-clamp-2">
        {authors?.join(", ")}
      </div>
    </div>
    <Rating rating={goodreadsRating} />
  </div>
);

export default BookGeneralDetails;
