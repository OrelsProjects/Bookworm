import React from "react";
import { UserBookData } from "../../models";

interface itemProps {
  userBookData: UserBookData;
}

const item: React.FC<itemProps> = ({ userBookData }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-3">
        <img
          className="w-12 h-12"
          src={userBookData.bookData.book?.thumbnailUrl}
          alt={userBookData.bookData.book?.title}
        />
        <div>
          <div>{userBookData.bookData.book?.title}</div>
          <div>{userBookData.bookData.book?.authors?.join(", ")}</div>
        </div>
      </div>
      {/* ... other book details */}
    </div>
  );
};

export default item;
