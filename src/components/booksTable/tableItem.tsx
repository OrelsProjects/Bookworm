import React from "react";
import { UserBookData } from "../../models";
import Rating from "../rating";
import {
  AddToReadListButton,
  ShowDetailsButton,
} from "../buttons/bookButtons";

interface TableItemProps {
  userBookData: UserBookData;
}

const TableItem: React.FC<TableItemProps> = ({ userBookData }) => {
  return (
    <div className="flex justify-center grid-header-table items-center bg-primary-foreground p-2 rounded-lg">
      <div>
        <img
          className="w-16 h-20 rounded-lg"
          src={userBookData.bookData.book?.thumbnailUrl}
          alt={userBookData.bookData.book?.title}
        />
      </div>
      <div className="truncate">{userBookData.bookData.book?.title}</div>
      <div className="text-primary font-semibold truncate">
        {userBookData.bookData.book?.authors?.join(", ")}
      </div>
      <div className="flex flex-col truncate">
        <div>
          <div>Pages: {userBookData.bookData.book?.numberOfPages}</div>
          <div>Genre: {userBookData.bookData.book?.mainGenreId}</div>
          <div>Date: {userBookData.bookData.book?.datePublished}</div>
        </div>
      </div>
      <Rating
        rating={userBookData.goodreadsData?.goodreadsRating}
        totalRatings={userBookData.goodreadsData?.goodreadsRatingsCount}
        userRating={userBookData.userBook.userRating}
      />
      <div className="flex flex-row gap-2">
        <AddToReadListButton userBook={userBookData.userBook} />
        {userBookData.bookData.book && (
          <ShowDetailsButton book={userBookData.bookData.book} />
        )}
      </div>
    </div>
  );
};

export default TableItem;
