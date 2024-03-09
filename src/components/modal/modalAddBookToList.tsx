"use client";

import React from "react";

import Book from "../../models/book";
import useBook from "../../hooks/useBook";
import { UserBookData } from "../../models/userBook";
import BookButtons from "../book/bookButtons";
import BookThumbnail from "../book/bookThumbnail";
import { ModalProps } from "./modal";
import { ModalContent } from "./modalContainers";
import BookGeneralDetails from "./_components/bookGeneralDetails";
import useBooksList from "../../hooks/useBooksList";
import { BurgerLines, Checkmark } from "../icons";
import BooksListList from "../booksList/booksListList";
import { Checkbox } from "../checkbox";
import { BooksList, BooksListData } from "../../models/booksList";
import toast from "react-hot-toast";
import { isEqual } from "lodash";
import { isBooksEqual } from "../../utils/bookUtils";

type ModalBookDetailsProps = {
  book: Book;
} & ModalProps;

const ModalAddBookToList: React.FC<ModalBookDetailsProps> = ({
  book,
  ...modalProps
}) => {
  const { booksLists, addBookToList, loading } = useBooksList();
  const { getBookFullData, userBooksData } = useBook();

  const [bookData, setBookData] = React.useState<
    UserBookData | null | undefined
  >(null);

  React.useEffect(() => {
    const bookFullData = getBookFullData(book);
    setBookData(bookFullData);
  }, [userBooksData]);

  const handleAddBookToList = async (list: BooksListData) => {
    const isBookInList = list.booksInList?.some((bookInList) =>
      isBooksEqual(book, bookInList.book)
    );
    if (isBookInList || loading.current) {
      return;
    }
    await toast.promise(addBookToList(list.listId, book), {
      loading: `Adding ${book.title} to list: ${list.name}...`,
      success: `${book.title} added to list: ${list.name}`,
      error: `Failed to add ${book.title} to list: ${list.name}`,
    });
  };

  const MyReadlists = () => (
    <div className="w-full">
      <div className="w-full flex flex-row gap-1 justify-start items-center">
        <BurgerLines.Fill iconSize="sm" className="!text-foreground" />
        <div className="text-2xl font-bold">My Readlists</div>
      </div>
      <BooksListList
        booksListsData={booksLists}
        direction="column"
        endElementProps={{
          onEndElementClick: (list) => handleAddBookToList(list),
          book,
        }}
      />
    </div>
  );

  const Thumbnail = () => (
    <BookThumbnail
      src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
      book={book}
      thumbnailSize="lg"
    />
  );

  return (
    <ModalContent
      thumbnail={<Thumbnail />}
      thumbnailDetails={
        bookData && <BookGeneralDetails userBookData={bookData} />
      }
      bottomSection={<MyReadlists />}
      {...modalProps}
    />
  );
};

export default ModalAddBookToList;
