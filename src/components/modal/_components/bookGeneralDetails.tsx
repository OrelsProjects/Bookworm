import React from "react";
import { UserBookData } from "../../../models/userBook";
import Rating from "../../rating";

const BookGeneralDetails: React.FC<{ userBookData: UserBookData }> = ({
  userBookData,
}) => (
  <div className="h-full w-full flex flex-col gap-4">
    <div>
      <div className="font text-foreground line-clamp-1 font-bold text-xl pr-2">
        {userBookData.bookData?.book?.title}
      </div>
      <div className="text-lg text-foreground line-clamp-2">
        {userBookData.bookData?.book?.authors?.join(", ")}
      </div>
    </div>
    <Rating rating={userBookData?.goodreadsData?.goodreadsRating} />
  </div>
);

export default BookGeneralDetails;
