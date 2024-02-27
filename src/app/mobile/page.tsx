"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";

const Mobile: React.FC = () => {
  const { userBooksData } = useSelector((state: RootState) => state.userBooks);

  return (
    <div className="w-full h-full">
      {/* <BookListComponent
        books={userBooksData.map((bookData) => bookData.bookData.book!!) ?? []}
      /> */}
    </div>
  );
};

export default Mobile;
