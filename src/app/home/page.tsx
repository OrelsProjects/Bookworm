"use client";

import React from "react";
import SearchBar from "../../components/search/searchBar";
import Header from "../_components/header";
import { Book } from "../../models";
import Image from "next/image";
import { darkenColor } from "../../utils/thumbnailUtils";
import { useSelector } from "react-redux";
import { selectUserBooks } from "../../lib/features/userBooks/userBooksSlice";
import { removeSubtitle } from "../../utils/bookUtils";

export default function Home(): React.ReactNode {
  const { userBooksData } = useSelector(selectUserBooks);

  return (
    <div className="h-full w-full flex flex-col justify-top items-start gap-6 p-3">
      <Header />
      <SearchBar />
      <BookList books={userBooksData.map((ubd) => ubd.bookData.book)} />
    </div>
  );
}

interface BookProps {
  book?: Book;
}

const BookComponent: React.FC<BookProps> = ({ book }) => {
  const darkenedColor = darkenColor(book?.thumbnailColor);
  return (
    book && (
      <div className="text-foreground m-2 text-center !w-36 h-fit">
        <Image
          src={book.thumbnailUrl ?? ""}
          alt={book.title}
          fill
          className="rounded-lg !w-36 !h-52 !relative"
        />
        <div className="line-clamp-1">{removeSubtitle(book.title)}</div>
        <p
          className="line-clamp-1"
          style={{
            color: darkenedColor,
          }}
        >
          {book.authors?.join(", ") ?? ""}
        </p>
      </div>
    )
  );
};

type BookListProps = {
  books?: (Book | undefined)[];
};

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="flex flex-row justify-center overflow-x-auto">
      {books?.map((book, index) => (
        <BookComponent key={index} book={book} />
      ))}
    </div>
  );
};
