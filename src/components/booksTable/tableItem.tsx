import React from "react";
import { UserBookData } from "../../models";

interface itemProps {
  item: UserBookData;
}

const item: React.FC<itemProps> = ({ item }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white border-b">
      <div className="flex items-center space-x-3">
        <img
          className="w-12 h-12"
          src={item.bookData.book.thumbnailUrl}
          alt={item.bookData.book.title}
        />
        <div>
          <div>{item.bookData.book.title}</div>
          <div>{item.bookData.book.authors?.join(", ")}</div>
        </div>
      </div>
      {/* ... other book details */}
    </div>
  );
};

export default item;
