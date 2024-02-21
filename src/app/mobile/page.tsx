"use client";

import React from "react";
import BookListComponent from "../../components/mobile/bookList";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import Modal from "../../components/mobile/modal";

const Mobile: React.FC = () => {
  const { userBooksData } = useSelector((state: RootState) => state.userBooks);

  return (
    <div className="w-full h-full">
      {/* <BookListComponent
        books={userBooksData.map((bookData) => bookData.bookData.book!!) ?? []}
      /> */}
      {userBooksData.length > 0 && (
        <Modal
          book={userBooksData[0].bookData.book!!}
          goodreadsData={userBooksData[0].goodreadsData!!}
        />
      )}
    </div>
  );
};

export default Mobile;
