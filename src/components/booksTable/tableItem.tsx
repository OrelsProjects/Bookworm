import React from "react";
import { UserBookData } from "../../models";

interface BookItemProps {
  bookData: UserBookData;
}

const BookItem: React.FC<BookItemProps> = ({ bookData }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white border-b">
      <div className="flex items-center space-x-3">
        <img
          className="w-12 h-12"
          src={bookData.bookData.book.thumbnailUrl}
          alt={bookData.bookData.book.title}
        />
        <div>
          <div>{bookData.bookData.book.title}</div>
          <div>{bookData.bookData.book.authors?.join(", ")}</div>
        </div>
      </div>
      {/* ... other book details */}
    </div>
  );
};

export default BookItem;
