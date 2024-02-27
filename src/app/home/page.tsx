"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/search/searchBar";
import { Book } from "../../models";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectUserBooks } from "../../lib/features/userBooks/userBooksSlice";
import { removeSubtitle } from "../../utils/bookUtils";
import { Add } from "../../components/icons";
import {
  BottomSheetTypes,
  showBottomSheet,
} from "../../lib/features/modal/modalSlice";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { userBooksData } = useSelector(selectUserBooks);

  return (
    <div className="h-full w-full flex flex-col relative justify-top items-start gap-6 p-3">
      <SearchBar />
      <BookList
        books={userBooksData.map((ubd) => ubd.bookData.book)}
        onSeeAllClick={() => router.push("/my-library")}
      />
    </div>
  );
}

interface BookProps {
  book?: Book;
}

const BookComponent: React.FC<BookProps> = ({ book }) => {
  const dispatch = useDispatch();
  const onBookClick = () =>
    dispatch(showBottomSheet({ book, type: BottomSheetTypes.BOOK_DETAILS }));

  return (
    book && (
      <div className="text-foreground text-center flex flex-col justify-center items-center gap-2">
        <div className="rounded-lg overflow-visible w-24 h-36 relative">
          <Image
            src={book.thumbnailUrl ?? ""}
            alt={book.title}
            width={150}
            height={200}
            layout="responsive"
            onClick={onBookClick}
            className="!w-full !h-full rounded-lg"
          />
          <Add.Outline className="w-8 h-8 absolute -bottom-4 right-2 bg-background rounded-full border-none overflow-hidden" />
        </div>
        <div>
          <div className="line-clamp-1 w-full text-left">
            {removeSubtitle(book.title)}
          </div>
          <div className="line-clamp-1 w-full text-left text-primary">
            {book.authors?.join(", ") ?? ""}
          </div>
        </div>
      </div>
    )
  );
};

type BookListProps = {
  books?: (Book | undefined)[];
  onSeeAllClick?: () => void;
};
const BookList: React.FC<BookListProps> = ({ books, onSeeAllClick }) => {
  return (
    <div className="w-full overflow-auto flex flex-col gap-2">
      <div className="w-full flex justify-between">
        <div className="text-xl font-bold">Books I've Read</div>
        <div className="text-lg font-bold underline" onClick={onSeeAllClick}>
          See all
        </div>
      </div>
      <div className="flex flex-row gap-2 w-full overflow-auto">
        {books?.map((book, index) => (
          <BookComponent key={index} book={book} />
        ))}
      </div>
    </div>
  );
};
